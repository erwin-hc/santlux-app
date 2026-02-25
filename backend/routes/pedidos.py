from fastapi import APIRouter, HTTPException, Query, Depends
from db.db_firebird import run_query
from auth_utils import get_current_user

router = APIRouter(prefix="/pedidos", tags=["Pedidos"],dependencies=[Depends(get_current_user)])

@router.get("/")
async def listar_pedidos(page: int = Query(0, ge=0)):
    qtd_per_page = 25
    skip = page * qtd_per_page
    
    # Query adaptada do seu código original
    sql = """
    SELECT FIRST ? SKIP ?
        PPC.STATUS, PPC.DATA, PPC.CON_NOME, PPC.REGISTRO,
        PPC.OS, PPC.DTENTREGA AS PREVISAO, PDS.NNOTA
    FROM SKLLPPC PPC
        LEFT JOIN SKLLPDS PDS ON PPC.PEDIDO = PDS.PEDIDO
        WHERE PPC.OS STARTING WITH '20000'
    ORDER BY PPC.REGISTRO DESC
    """
    
    try:
        dados = run_query(sql, (qtd_per_page, skip))
        return dados
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro no banco: {str(e)}")

@router.get("/{registro}")
async def obter_pedido(registro: int):
    sql = "SELECT * FROM SKLLPPC WHERE REGISTRO = ?"
    resultado = run_query(sql, (registro,))
    
    if not resultado:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
        
    return resultado[0]