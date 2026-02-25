from sqlmodel import SQLModel, Field, create_engine
from typing import Optional
from pydantic import EmailStr

# --- CONFIGURAÇÃO DO ENGINE ---
sqlite_file_name = "userdb.db"
sqlite_url = f"sqlite:///db/{sqlite_file_name}"
engine = create_engine(sqlite_url, echo=True) 

# --- MODELOS ---
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True)
    isAdmin: str = Field(default=False)
    hashed_password: str

class UserCreate(SQLModel):
    username: str
    email: EmailStr
    password: str
    isAdmin: bool 

class UserLogin(SQLModel):
    email: EmailStr
    password: str

class UserPublic(SQLModel):
    id: int
    username: str
    email: str
    isAdmin: bool