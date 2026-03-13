from fastapi import APIRouter, HTTPException, Query, Depends, Path, Body
from db.db_firebird import run_query
from auth_utils import get_current_user
from datetime import datetime

router = APIRouter(prefix="/pedidos", tags=["Pedidos"],dependencies=[Depends(get_current_user)])

@router.put("/{registro}")
async def update_dtentrega(
    registro: int = Path(..., description="ID do registro"), 
    data: str = Body(..., embed=True)
):
    try:
        
        date_obj = datetime.strptime(data, "%d/%m/%Y")
        firebird_date = date_obj.strftime("%Y-%m-%d")

        query = """
            UPDATE SKLLPPC
            SET DTENTREGA = ?
            WHERE REGISTRO = ?
        """
        
        
        resultado = run_query(query, (firebird_date, registro))
        
        
        if resultado.get("rows_affected") == 0:
            raise HTTPException(status_code=404, detail="Registro não encontrado")

        return {
            "status": "sucesso",
            "registro": registro,
            "nova_data": firebird_date
        }

    except ValueError:
        raise HTTPException(
            status_code=400, 
            detail="Formato inválido. Use DD/MM/YY"
        )
    except Exception as e:
        logging.error(f"Erro ao atualizar: {e}")
        raise HTTPException(status_code=500, detail="Erro interno no banco")


@router.get("/")
async def listar_pedidos(
    page: int = Query(0, ge=0),
    limit: int = 10,
    search: str | None = Query(None)
):

    if search is not None and search.strip() != "":        
        search = search.upper()
        search_terms = [term.strip() for term in search.split(",") if term.strip()]
        
        search_conditions = []
        params = []

        for term in search_terms:
            search_conditions.append("""
            (
            CAST(PPC.REGISTRO AS VARCHAR(20)) LIKE ?
            OR CAST(PDS.NNOTA AS VARCHAR(20)) LIKE ?
            OR UPPER(PPC.CON_NOME) LIKE ?
            OR PPC.OS LIKE ?
            )
            """)

            params.extend([
                f"%{term}%",
                f"%{term}%",
                f"%{term}%",
                f"%{term}%"
            ])

        where_clause = " OR ".join(search_conditions)

        status_filter = ""
        if len(search_terms) > 1:
            status_filter = " AND PPC.STATUS NOT LIKE 'E'"

        sql = f"""
        SELECT
            PPC.STATUS, PPC.DATA, PPC.CON_NOME, PPC.REGISTRO,
            PPC.OS, PPC.DTENTREGA AS PREVISAO,
            PPC.TRANSPORTADORA,
            PDS.NNOTA,
            PDS.VOLNUMERO,
            PPC.ENTDATA AS ENTREGUE
        FROM SKLLPPC PPC
        LEFT JOIN SKLLPDS PDS ON PPC.PEDIDO = PDS.PEDIDO
        WHERE ({where_clause})
        AND PPC.OS STARTING WITH '20000'
        {status_filter}
        ORDER BY PPC.REGISTRO DESC
        """

        dados = run_query(sql, params)

        return {
            "data": dados,
            "metadata": {
                "total": len(dados),
                "page": 0,
                "limit": limit,
                "total_pages": 1
            }
        }

    print("SEARCH RECEBIDO:", search)    

    
    skip = page * limit

    total = run_query(
        "SELECT COUNT(*) AS total FROM SKLLPPC WHERE OS STARTING WITH '20000'"
    )[0]["total"]

    sql = """
    SELECT FIRST ? SKIP ?
        PPC.STATUS, PPC.DATA, PPC.CON_NOME, PPC.REGISTRO,
        PPC.OS, PPC.DTENTREGA AS PREVISAO,
        PPC.TRANSPORTADORA,
        PDS.NNOTA
    FROM SKLLPPC PPC
    LEFT JOIN SKLLPDS PDS ON PPC.PEDIDO = PDS.PEDIDO
    WHERE PPC.OS STARTING WITH '20000'
    ORDER BY PPC.REGISTRO DESC
    """

    dados = run_query(sql, (limit, skip))

    return {
        "data": dados,
        "metadata": {
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": (total // limit) + (1 if total % limit else 0)
        }
    }