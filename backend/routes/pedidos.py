import logging
from datetime import datetime
from typing import Annotated

from auth_utils import get_current_user
from db.db_firebird import get_db, run_query
from fastapi import APIRouter, Body, Depends, HTTPException, Path, Query  # type: ignore

SQL_LISTAGEM = """
SELECT FIRST ? SKIP ?
    PPC.STATUS, PPC.DATA, PPC.CON_NOME, PPC.REGISTRO,
    PPC.OS, PPC.DTENTREGA AS PREVISAO,
    PPC.TRANSPORTADORA,
    PDS.NNOTA,
    PPC.ENTDATA,
    PDS.VOLNUMERO,
    PDS.PEDIDO,
    EMP.EMPRESA
FROM SKLLPPC PPC
    LEFT JOIN SKLLPDS PDS ON PPC.PEDIDO = PDS.PEDIDO
    LEFT JOIN SKLLEMP EMP ON PPC.SIGLA = EMP.SIGLA
WHERE PPC.OS STARTING WITH '20000'
ORDER BY PPC.REGISTRO DESC
"""


def listar_pedidos_paginado(limit: int, skip: int):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM SKLLPPC WHERE OS STARTING WITH '20000'")
        total = cur.fetchone()[0]
        cur.execute(SQL_LISTAGEM, (limit, skip))
        columns = [col[0].lower() for col in cur.description]
        dados = [dict(zip(columns, row)) for row in cur.fetchall()]
    return total, dados


router = APIRouter(prefix="/pedidos", tags=["Pedidos"])


@router.put("/previsao/{registro}", dependencies=[Depends(get_current_user)])
def update_previsao(
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


@router.put("/entrega/{pedido}", dependencies=[Depends(get_current_user)])
def update_entrega(
    pedido: int = Path(..., description="ID do Pedido"),
    data: str = Body(..., embed=True),
):
    try:
        date_obj = datetime.strptime(data, "%d/%m/%Y")
        firebird_date = date_obj.strftime("%Y-%m-%d")

        query1 = """
            UPDATE SKLLPDS PDS
            SET PDS.ENTREGUE = 'ENTREGUE', 
                PDS.DTENTREGA = ?
            WHERE PDS.PEDIDO = ?
        """

        query2 = """
            UPDATE SKLLPPC PPC
            SET PPC.STATUS = 'E',
                PPC.ENTDATA = ? 
            WHERE PPC.PEDIDO = ?
        """

        res1 = run_query(query1, (firebird_date, pedido))
        if res1.get("rows_affected") == 0:
            raise HTTPException(status_code=404, detail="Pedido não encontrado")

        res2 = run_query(query2, (firebird_date, pedido))
        if res2.get("rows_affected") == 0:
            raise HTTPException(status_code=404, detail="Pedido não encontrado")

        return {
            "status": "sucesso",
            "pedido": pedido,
            "nova_data": firebird_date,
        }

    except ValueError:
        raise HTTPException(status_code=400, detail="Formato inválido. Use DD/MM/YYYY")
    except Exception as e:
        logging.error(f"Erro ao atualizar: {e}")
        raise HTTPException(status_code=500, detail="Erro interno no banco")


@router.get("/view/{registro}", dependencies=[Depends(get_current_user)])
def view_pedido(registro: int = Path(..., description="ID do Registro")):
    query = """
        SELECT 
            EMP.EMPRESA, 
            EMP.SIGLA,                   
            PPC.REGISTRO, 
            PPC.DATA,
            PPC.OS, 
            PPC.OBS AS CAPAOBS,
            PPC.CON_NOME, 
            PPC.SETOR_PPM, 
            PPC.TRANSPORTADORA,  
            PPC.STATUS, 
            PPC.DTENTREGA,                  
            PDS.NNOTA,                         
            PPI.NOME, 
            PPI.QUANT,
            PPI.OBS, 
            PPI.LARG, 
            PPI.ALT, 
            PPI.M2, 
            PPI.MODELO,             
            PPI.SEQ,
            PPI.LATD,
            PPI.LATE,
            PPI.COMPR,             
            PPI.TP             
        FROM SKLLPPC PPC
            LEFT OUTER JOIN SKLLEMP EMP ON PPC.SIGLA = EMP.SIGLA
            LEFT OUTER JOIN SKLLPPI PPI ON PPC.REGISTRO = PPI.REGISTRO
            LEFT OUTER JOIN SKLLPDS PDS ON PPC.PEDIDO = PDS.PEDIDO
        WHERE PPC.REGISTRO = ?
    """
    dados = run_query(query, (registro,))

    return {
        "data": dados if dados is not None else [],
    }


@router.put("/qtvolume/{pedido}", dependencies=[Depends(get_current_user)])
def update_volume(
    pedido: int = Path(..., description="ID do pedido"),
    volnumero: str = Body(..., embed=True),
):
    try:
        query = """
            UPDATE SKLLPDS
                SET VOLNUMERO = ?
            WHERE PEDIDO = ?
            """

        res = run_query(query, (volnumero, pedido))
        if res.get("rows_affected") == 0:
            raise HTTPException(status_code=404, detail="Pedido não encontrado")

        return {
            "status": "sucesso",
            "notafiscal": pedido,
            "mensagem": "Volume alterado!",
        }

    except ValueError:
        raise HTTPException(status_code=400, detail="Erro!")
    except Exception as e:
        logging.error(f"Erro ao atualizar: {e}")
        raise HTTPException(status_code=500, detail="Erro interno no banco")


@router.put("/naoentregue/{pedido}", dependencies=[Depends(get_current_user)])
def update_nao_entregue(pedido: int = Path(..., description="ID do Pedido")):
    try:
        query1 = """
            UPDATE SKLLPDS PDS
            SET PDS.ENTREGUE = 'N', 
                PDS.DTENTREGA = NULL
            WHERE PDS.PEDIDO = ?
        """

        query2 = """
            UPDATE SKLLPPC PPC
            SET PPC.STATUS = 'F',
                PPC.ENTDATA = NULL 
            WHERE PPC.PEDIDO = ?
        """

        res1 = run_query(query1, (pedido,))
        if res1.get("rows_affected") == 0:
            raise HTTPException(status_code=404, detail="Pedido não encontrado")

        res2 = run_query(query2, (pedido,))
        if res2.get("rows_affected") == 0:
            raise HTTPException(status_code=404, detail="Pedido não encontrado")

        return {
            "status": "sucesso",
            "pedido": pedido,
            "mensagem": "Entrega estornada com sucesso (campos zerados)",
        }

    except Exception as e:
        logging.error(f"Erro ao atualizar: {e}")
        raise HTTPException(status_code=500, detail="Erro interno no banco")


@router.get("/", dependencies=[Depends(get_current_user)])
def listar_pedidos(
    page: Annotated[int, Query(ge=0)] = 0,
    limit: int = 10,
    search: Annotated[str | None, Query()] = None,
):

    if search is not None and search.strip() != "":
        search = search.upper()
        search_terms = [term.strip() for term in search.split(",") if term.strip()]

        search_conditions = []
        params = []

        for term in search_terms:
            conditions = []

            if term.isdigit():
                conditions.append("PPC.REGISTRO = ?")
                params.append(term)

                conditions.append("PDS.NNOTA = ?")
                params.append(term)

            else:
                conditions.append("PPC.CON_NOME LIKE ?")
                params.append(f"%{term}%")

                conditions.append("PPC.OS STARTING WITH ?")
                params.append(term)

            search_conditions.append(f"({' OR '.join(conditions)})")

        where_clause = " OR ".join(search_conditions)

        status_filter = ""
        if len(search_terms) > 1:
            status_filter = " AND PPC.STATUS NOT LIKE 'E' AND PPC.REGISTRO > 70000"

        sql = f"""
        SELECT
            PPC.STATUS, PPC.DATA, PPC.CON_NOME, PPC.REGISTRO,
            PPC.OS, PPC.DTENTREGA AS PREVISAO,
            PPC.TRANSPORTADORA,
            PDS.NNOTA,
            PDS.PEDIDO,
            PDS.VOLNUMERO,
            PPC.ENTDATA,
            EMP.EMPRESA
        FROM SKLLPPC PPC
            LEFT JOIN SKLLPDS PDS ON PPC.PEDIDO = PDS.PEDIDO
            LEFT JOIN SKLLEMP EMP ON PPC.SIGLA = EMP.SIGLA
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
    total, dados = listar_pedidos_paginado(limit, skip)

    sql = """
    SELECT FIRST ? SKIP ?
        PPC.STATUS, PPC.DATA, PPC.CON_NOME, PPC.REGISTRO,
        PPC.OS, PPC.DTENTREGA AS PREVISAO,
        PPC.TRANSPORTADORA,
        PDS.NNOTA,
        PPC.ENTDATA,
        PDS.VOLNUMERO,
        PDS.PEDIDO,
        EMP.EMPRESA
    FROM SKLLPPC PPC
        LEFT JOIN SKLLPDS PDS ON PPC.PEDIDO = PDS.PEDIDO
        LEFT JOIN SKLLEMP EMP ON PPC.SIGLA = EMP.SIGLA
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
