import logging
from fastapi import APIRouter, Depends, HTTPException # type: ignore
from db.db_firebird import run_query
from auth_utils import get_current_user
from datetime import datetime
from decimal import Decimal

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
        
        resultados = run_query(query, (data_inicio, data_fim))

        chart_data = {}        

        for row in resultados:
            mes = row['mes']
            setor = row['setor_ppm']
            total = float(row['total_quant']) if isinstance(row['total_quant'], Decimal) else row['total_quant']
          
            if mes not in chart_data:
                chart_data[mes] = {'mes': mes, 'especial': 0, 'horizontal': 0, 'vertical': 0}
           
            if setor == 'ESP':
                chart_data[mes]['especial'] = total

            elif setor == 'HOR':
                chart_data[mes]['horizontal'] = total

            elif setor == 'VER':
                chart_data[mes]['vertical'] = total


        result = sorted(chart_data.values(), key=lambda x: x['mes'])

        full_result = []

        for i in range(1, 13):
            found = next((r for r in result if r['mes'] == i), None)

            if found:
                full_result.append(found)
            else:
                full_result.append({'mes': i, 'especial': None, 'horizontal': None, 'vertical': None})
       
        return full_result


    except ValueError:
        raise HTTPException(status_code=400, detail="Erro! Esperado ano formato YYYY")
    except Exception as e:
        logging.error(f"Erro ao buscar comissao: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

