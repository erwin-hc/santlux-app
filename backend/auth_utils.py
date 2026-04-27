import bcrypt
from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select
from db.db_sqlite import User, engine 
from fastapi import Request

SECRET_KEY = "sua_chave_secreta_aqui"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 10080
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_password_hash(password: str) -> str:
    # O bcrypt exige bytes. Convertemos a string, geramos o salt e o hash.
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(pwd_bytes, salt)
    return hashed_password.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Compara a senha digitada com o hash do banco
    return bcrypt.checkpw(
        plain_password.encode('utf-8'), 
        hashed_password.encode('utf-8')
    )

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({
        "exp": expire,
        "email": data.get("sub"),
        "isAdmin": data.get("isAdmin")
    })

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(
    request: Request,
    token: str = Depends(oauth2_scheme)
):
    if hasattr(request.state, "user"):
        return request.state.user

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        user = {
            "email": payload.get("email"),
            "isAdmin": payload.get("isAdmin")
        }

        if user["email"] is None:
            raise HTTPException(status_code=401)

    except JWTError:
        raise HTTPException(status_code=401)

    request.state.user = user
    return user
