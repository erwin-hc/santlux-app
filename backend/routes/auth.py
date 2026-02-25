from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm 
from sqlmodel import Session, select
from db.db_sqlite import User, UserCreate, UserPublic, engine 
from auth_utils import create_access_token, verify_password, get_password_hash, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserPublic)
def register(user_data: UserCreate):
    with Session(engine) as session:
        statement = select(User).where(
            (User.username == user_data.username) | (User.email == user_data.email)
        )
        if session.exec(statement).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Usuário ou Email já cadastrados"
            )
        
        new_user = User(
            username=user_data.username,
            email=user_data.email,
            isAdmin=user_data.isAdmin,
            hashed_password=get_password_hash(user_data.password)
        )
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        return new_user

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    with Session(engine) as session:
        statement = select(User).where(
            (User.email == form_data.username) | (User.username == form_data.username)
        )
        user = session.exec(statement).first()
        
        if not user or not verify_password(form_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Credenciais inválidas"
            )
                
        access_token = create_access_token(data={"sub": user.email})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {"username": user.username, "email": user.email, "isAdmin": user.isAdmin}
        }

@router.get("/users/me")
def read_users_me(current_user: User = Depends(get_current_user)):
    
    return {
        "status": "Autenticado com sucesso!",
        "User": {
            "username": current_user.username,
            "email": current_user.email,
            "isAdmin": current_user.isAdmin
        }
    }

@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    return {"detail": "Logout realizado com sucesso. Até logo, " + current_user.username}