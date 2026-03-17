import logging
from datetime import datetime

from auth_utils import get_current_user
from db.db_firebird import run_query
from fastapi import APIRouter, Body, Depends, HTTPException, Path, Query

router = APIRouter(
    prefix="/pedidos", tags=["Pedidos"], dependencies=[Depends(get_current_user)]
)


@router.put("/previsao/{registro}")
async def update_previsao(
    registro: int = Path(..., description="ID do registro"),
    data: str = Body(..., embed=True),
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

        return {"status": "sucesso", "registro": registro, "nova_data": firebird_date}

    except ValueError:
        raise HTTPException(status_code=400, detail="Formato inválido. Use DD/MM/YY")
    except Exception as e:
        logging.error(f"Erro ao atualizar: {e}")
        raise HTTPException(status_code=500, detail="Erro interno no banco")


@router.put("/entrega/{notafiscal}")
async def update_entrega(
    notafiscal: int = Path(..., description="ID do NFe"),
    data: str = Body(..., embed=True),
):
    try:
        date_obj = datetime.strptime(data, "%d/%m/%Y")
        firebird_date = date_obj.strftime("%Y-%m-%d")

        query1 = """
            UPDATE SKLLPDS PDS
            SET PDS.ENTREGUE = 'ENTREGUE', 
                PDS.DTENTREGA = ?
            WHERE PDS.NNOTA = ?
        """

        query2 = """
            UPDATE SKLLPPC PPC
            SET PPC.STATUS = 'E',
                PPC.ENTDATA = ? 
            WHERE PPC.PEDIDO IN (
                SELECT PDS.PEDIDO 
                FROM SKLLPDS PDS
                WHERE PDS.NNOTA = ?
            )
        """

        res1 = run_query(query1, (firebird_date, notafiscal))
        if res1.get("rows_affected") == 0:
            raise HTTPException(status_code=404, detail="Registro não encontrado")

        res2 = run_query(query2, (firebird_date, notafiscal))
        if res2.get("rows_affected") == 0:
            raise HTTPException(status_code=404, detail="Registro não encontrado")

        return {
            "status": "sucesso",
            "notafiscal": notafiscal,
            "nova_data": firebird_date,
        }

    except ValueError:
        raise HTTPException(status_code=400, detail="Formato inválido. Use DD/MM/YYYY")
    except Exception as e:
        logging.error(f"Erro ao atualizar: {e}")
        raise HTTPException(status_code=500, detail="Erro interno no banco")


@router.put("/naoentregue/{notafiscal}")
async def update_nao_entregue(notafiscal: int = Path(..., description="ID do NFe")):
    try:
        query1 = """
            UPDATE SKLLPDS PDS
            SET PDS.ENTREGUE = 'N', 
                PDS.DTENTREGA = NULL
            WHERE PDS.NNOTA = ?
        """

        query2 = """
            UPDATE SKLLPPC PPC
            SET PPC.STATUS = 'F',
                PPC.ENTDATA = NULL 
            WHERE PPC.PEDIDO IN (
                SELECT PDS.PEDIDO 
                FROM SKLLPDS PDS
                WHERE PDS.NNOTA = ?
            )
        """

        res1 = run_query(query1, (notafiscal,))
        if res1.get("rows_affected") == 0:
            raise HTTPException(status_code=404, detail="Registro não encontrado")

        res2 = run_query(query2, (notafiscal,))

        return {
            "status": "sucesso",
            "notafiscal": notafiscal,
            "mensagem": "Entrega estornada com sucesso (campos zerados)",
        }

    except Exception as e:
        logging.error(f"Erro ao atualizar: {e}")
        raise HTTPException(status_code=500, detail="Erro interno no banco")


@router.get("/")
async def listar_pedidos(
    page: int = Query(0, ge=0), limit: int = 10, search: str | None = Query(None)
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

            params.extend([f"%{term}%", f"%{term}%", f"%{term}%", f"%{term}%"])

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
            PPC.ENTDATA 
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
                "total_pages": 1,
            },
        }

    skip = page * limit

    total = run_query(
        "SELECT COUNT(*) AS total FROM SKLLPPC WHERE OS STARTING WITH '20000'"
    )[0]["total"]

    sql = """
    SELECT FIRST ? SKIP ?
        PPC.STATUS, PPC.DATA, PPC.CON_NOME, PPC.REGISTRO,
        PPC.OS, PPC.DTENTREGA AS PREVISAO,
        PPC.TRANSPORTADORA,
        PDS.NNOTA,
        PPC.ENTDATA
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
            "total_pages": (total // limit) + (1 if total % limit else 0),
        },
    }


@router.get("/view/{registro}")
async def view_pedido(registro: int = Path(..., description="ID do Registro")):
    query = """
        SELECT 
            EMP.EMPRESA, 
            EMP.SIGLA,                   
            PPC.REGISTRO, 
            PPC.OS, 
            PPC.CON_NOME, 
            PPC.SETOR_PPM, 
            PPC.TRANSPORTADORA,  
            PPC.STATUS, 
            PPC.DTENTREGA,                  
            PDS.NNOTA,                         
            PPI.NOME, 
            PPI.OBS, 
            PPI.LARG, 
            PPI.ALT, 
            PPI.M2, 
            PPI.MODELO, 
            PPI.TP, 
            PPI.SEQ             
        FROM SKLLPPC PPC
            LEFT OUTER JOIN SKLLEMP EMP ON PPC.SIGLA = EMP.SIGLA
            LEFT OUTER JOIN SKLLPPI PPI ON PPC.REGISTRO = PPI.REGISTRO
            LEFT OUTER JOIN SKLLPDS PDS ON PPC.PEDIDO = PDS.PEDIDO
        WHERE PPC.REGISTRO = ?
    """
    dados = run_query(query, (registro,))

    return {
        "data": dados,
    }
