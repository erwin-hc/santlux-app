from fastapi import APIRouter, Depends, HTTPException
from db.db_firebird import run_query
from auth_utils import get_current_user

router = APIRouter(prefix="/producao", tags=["Producao"],dependencies=[Depends(get_current_user)])

@router.get("/")
def listar_producao():
    sql = """ SELECT FIRST 10 * FROM SKLLPPC """
    
    try:
        dados = run_query(sql)
        return dados
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro no banco: {str(e)}")

