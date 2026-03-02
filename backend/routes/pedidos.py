from fastapi import APIRouter, HTTPException, Query, Depends
from db.db_firebird import run_query
from auth_utils import get_current_user

router = APIRouter(prefix="/pedidos", tags=["Pedidos"],dependencies=[Depends(get_current_user)])

@router.get("/")
async def listar_pedidos(page: int = Query(0, ge=0), limit: int = 10):
    qtd_per_page = limit
    skip = page * qtd_per_page
    
    # Query de contagem simplificada
    sql_count = "SELECT COUNT(*) FROM SKLLPPC WHERE OS STARTING WITH '20000'"
    
    # Query de dados
    sql_dados = """
        SELECT FIRST ? SKIP ?
            PPC.STATUS, PPC.DATA, PPC.CON_NOME, PPC.REGISTRO,
            PPC.OS, PPC.DTENTREGA AS PREVISAO, PPC.TRANSPORTADORA, PDS.NNOTA
        FROM SKLLPPC PPC
            LEFT JOIN SKLLPDS PDS ON PPC.PEDIDO = PDS.PEDIDO
        WHERE PPC.OS STARTING WITH '20000'
        ORDER BY PPC.REGISTRO DESC
    """
    
    try:
        res_count = run_query(sql_count)
        res_count = run_query("""SELECT COUNT(*) AS total FROM SKLLPPC WHERE OS LIKE '20000%'""")              

        dados = run_query(sql_dados, (qtd_per_page, skip))

        if res_count and isinstance(res_count, list):          
            total_registros = res_count[0].get('TOTAL', res_count[0].get('total', 0))            
        else:
            total_registros = 0
            
        
        return {
            "data": dados,
            "metadata": {
                "total": total_registros,
                "page": page,
                "limit": qtd_per_page,
                "total_pages": round(total_registros / qtd_per_page)
            }
        }
    except Exception as e:        
        print(f"ERRO CRÍTICO NO BANCO: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@router.get("/{registro}")
async def obter_pedido(registro: int):
    sql = "SELECT * FROM SKLLPPC WHERE REGISTRO = ?"
    resultado = run_query(sql, (registro,))
    
    if not resultado:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
        
    return resultado[0]