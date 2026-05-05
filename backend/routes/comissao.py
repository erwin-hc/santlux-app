import logging
from fastapi import APIRouter, Depends, HTTPException # type: ignore
from db.db_firebird import run_query
from auth_utils import get_current_user
from datetime import datetime

router = APIRouter(prefix="/comissao", tags=["Comissao"])

@router.get("/{ano_str}",dependencies=[Depends(get_current_user)])
def get_comissao_anual(ano_str: str):
    try:
        if not ano_str or ano_str == "undefined":
            ano_str = datetime.now().year
        else:
            ano_str = int(ano_str)  
            
        data_inicio = f"{ano_str}-01-01"
        data_fim = f"{ano_str}-12-31"
        
        query = '''
        SELECT 
            EXTRACT(MONTH FROM PDS.DTNOTA) AS MES,
            PPC.SETOR_PPM,
            SUM(PPI.QUANT) AS TOTAL_QUANT
        FROM SKLLPPC PPC
            LEFT OUTER JOIN SKLLEMP EMP ON PPC.SIGLA = EMP.SIGLA
            LEFT OUTER JOIN SKLLPPI PPI ON PPC.REGISTRO = PPI.REGISTRO
            LEFT OUTER JOIN SKLLPDS PDS ON PPC.PEDIDO = PDS.PEDIDO 
            LEFT OUTER JOIN SKLLPRO PRI ON PPI.PRODUTO = PRI.PRODUTO
        WHERE 
            PPC.STATUS IN ('F','E') 
            AND (PPI.TP <> 'C' OR PRI.PRODUTO = '012.172.000.00.01') 
            AND PPI.TP <> 'B'
            AND PDS.FAT = 'F'
            AND PDS.DTNOTA BETWEEN ? AND ?
        GROUP BY 1, 2
        ORDER BY 1, 2
        '''
        
        resutados = run_query(query, (data_inicio, data_fim))
        return resutados

    except ValueError:
        raise HTTPException(status_code=400, detail="Erro! Esperado ano formato YYYY")
    except Exception as e:
        logging.error(f"Erro ao buscar comissao: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

