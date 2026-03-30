from auth_utils import get_current_user
from db.db_firebird import run_query
from fastapi import APIRouter, Depends

router = APIRouter(
    prefix="/producao", tags=["Producao"], dependencies=[Depends(get_current_user)]
)


@router.get("/")
def listar_producao():
    query = """
      SELECT 
            PPC.DTENTREGA,
            PPC.REGISTRO,
            EMP.SIGLA,
            EMP.EMPRESA,
            PPC.OS,
            PPC.DATA,
            PPC.CON_NOME,
            PPC.SETOR_PPM,
            PPC.TRANSPORTADORA,
            PPC.STATUS,
            PDS.NNOTA,
            PDS.ENTREGUE,
            PPI.SEQ,
            PPI.NOME,
            PPI.OBS,
            PPI.LARG,
            PPI.ALT,
            PPI.MODELO,
            PPI.M2,
            PDS.TRANSEMPRESA,
            PPI.QUANT,
            PDS.VOLNUMERO,
            PPI.TP,
            PPC.CON_OBS

      FROM SKLLPPC PPC
            LEFT OUTER JOIN SKLLEMP EMP ON PPC.SIGLA = EMP.SIGLA
            LEFT OUTER JOIN SKLLPPI PPI ON PPC.REGISTRO = PPI.REGISTRO
            LEFT OUTER JOIN SKLLPDS PDS ON PPC.PEDIDO = PDS.PEDIDO
      WHERE 
            (PDS.ENTREGUE = 'N' OR PPC.STATUS = '6') 
                  AND
            (PPC.OS LIKE '20000%')
                  AND 
            (PPC.STATUS <> 'A')
      ORDER BY 
            PPC.DTENTREGA
      """
    return run_query(query)
