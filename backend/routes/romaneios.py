import logging
from datetime import datetime

from auth_utils import get_current_user
from db.db_firebird import run_query
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter(
    prefix="/romaneios", tags=["Romaneio"], dependencies=[Depends(get_current_user)]
)


@router.get("/{data_str}")
def get_romaneios(data_str: str):
    try:
        date_obj = datetime.strptime(data_str, "%d-%m-%Y")
        firebird_date = date_obj.strftime("%Y-%m-%d")

        query = """
        SELECT PPC.REGISTRO, PPC.CON_NOME, EMP.EMPRESA, EMP.SIGLA, 
               PPC.OS, PPC.TRANSPORTADORA, PPC.CON_OBS, PDS.NNOTA, 
               PDS.VOLNUMERO, PDS.DTENTREGA, PDS.PEDIDO 
        FROM SKLLPDS PDS
        LEFT OUTER JOIN SKLLEMP EMP ON PDS.SIGLA = EMP.SIGLA
        LEFT OUTER JOIN SKLLPPC PPC ON PDS.PEDIDO = PPC.PEDIDO
        WHERE (PDS.ENTREGUE = 'ENTREGUE' AND EMP.RAMO1 = 'CLI' 
               AND PPC.OS LIKE '20000%' AND PDS.DTENTREGA = ?)
        ORDER BY PPC.TRANSPORTADORA, PPC.REGISTRO
        """

        resultado = run_query(query, (firebird_date,))

        if not resultado:
            return {"status": "sucesso", "count": 0, "data": []}

        return {
            "status": "sucesso",
            "romaneio_data": firebird_date,
            "count": len(resultado),
            "data": resultado,
        }

    except ValueError:
        raise HTTPException(status_code=400, detail="Formato inválido. Use DD-MM-YYYY")
    except Exception as e:
        logging.error(f"Erro ao buscar romaneios: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")
