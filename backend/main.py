from db.db_sqlite import engine
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, comissao, pedidos, producao, romaneios
from sqlmodel import SQLModel

app = FastAPI(title="API SANTLUX")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # URL do seu Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)


# Incluindo as rotas do projeto
app.include_router(pedidos.router)
app.include_router(auth.router)
app.include_router(romaneios.router)
app.include_router(comissao.router)
app.include_router(producao.router)


# Criar as tabelas ao iniciar
@app.get("/")
def root():
    return {"message": "API Online - Conectada ao Firebird 1.5"}
