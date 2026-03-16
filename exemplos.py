import firebirdsql as fb
import logging
from datetime import datetime
from contextlib import contextmanager

logging.basicConfig(level=logging.ERROR, filename="errors.log", 
                    format="%(asctime)s - %(levelname)s - %(message)s")

BD_PATH = r"C:\SERKELLB\EMPRESAS\SANTLUX.FDB"
HOST = "santlux.ddns.net"
IP_LOCAL = '0.0.0.0'

# BD_PATH = r"C:\Projetos\TESTE.FDB"
# HOST = '10.0.0.2'
# IP_LOCAL = '10.0.0.2'
            
@contextmanager
def firebird_connection():
    conn = None
    try:
        conn = fb.connect(
            host=HOST, 
            database=BD_PATH,
            port=3050,
            user="sysdba",
            password="masterkey",
            charset="latin1",
        )
        yield conn  
    except Exception as e:
        logging.error(f"FALHA CRÍTICA NO BANCO: {e}")
        raise e 
    finally:
        if conn is not None:
            try:
                conn.close()
            except:
                pass

def executar_query(query, params=None):
    with firebird_connection() as conn:
        if not conn:
            return []
        try:
            cur = conn.cursor()
            cur.execute(query, params or ())
            return cur.fetchall()
        except Exception as e:
            logging.error(f"Erro ao executar query: {query} | Parâmetros: {params} | Erro: {e}")
            return []
        
def executar_query_one(query, params=None):
    with firebird_connection() as conn:
        if not conn:
            return []
        try:
            cur = conn.cursor()
            cur.execute(query, params or ())
            return cur.fetchone()
        except Exception as e:
            logging.error(f"Erro ao executar query: {query} | Parâmetros: {params} | Erro: {e}")
            return []

def close_connection():
    with firebird_connection() as conn:
        if conn:
            conn.close()  

def get_pedidos(page=0, orderby="PPC.REGISTRO", ascdesc="DESC"):
    qtd_per_page = 25
    query = f"""
    SELECT FIRST ? SKIP ?
        PPC.STATUS,
        PPC.DATA,
        PPC.CON_NOME,
        PPC.REGISTRO,
        PPC.OS,
        PPC.DTENTREGA AS PREVISAO,
        PPC.TRANSPORTADORA,
        PDS.NNOTA,  
        PDS.VOLNUMERO,
        PPC.ENTDATA AS ENTREGUE    
    FROM SKLLPPC PPC
        LEFT JOIN SKLLPDS PDS ON PPC.PEDIDO = PDS.PEDIDO
    WHERE 
        PPC.OS STARTING WITH '20000' 
    ORDER BY {orderby} {ascdesc}     
    """

    return executar_query(query, (qtd_per_page, qtd_per_page * page))

def get_pedido_por_registro(registro):
    query = "SELECT * FROM SKLLPPC WHERE REGISTRO = ?"
    return executar_query(query, (registro))

def get_filtered_pedidos(search, orderby="PPC.REGISTRO", ascdesc="DESC"):
    search = search.replace(".", ",").upper()
    search_terms = [term.strip() for term in search.split(",") if term.strip()]
    search_conditions = []
    query_params = []
    
    if len(search_terms) == 1:  # Single search term
        for term in search_terms:
            search_conditions.append(
            "(PPC.REGISTRO LIKE ? OR PDS.NNOTA LIKE ? OR UPPER(PPC.CON_NOME) LIKE UPPER(?) OR PPC.OS LIKE ?)"
            )
            query_params.extend([f"%{term}%"] * 4)

    else:  # Multiple search terms
        for term in search_terms:    
            search_conditions.append("PDS.NNOTA LIKE ? AND PPC.STATUS <> 'E'")
            query_params.append(f"%{term}%" * 1)
            print(query_params)
     
   
    where_clause = " OR ".join(search_conditions)
    
    query = f"""
        SELECT 
            PPC.STATUS,
            PPC.DATA,
            PPC.CON_NOME,
            PPC.REGISTRO,
            PPC.OS,
            PPC.DTENTREGA AS PREVISAO,
            PPC.TRANSPORTADORA,
            PDS.NNOTA,
            PDS.VOLNUMERO,
            PPC.ENTDATA AS ENTREGUE                    
        FROM SKLLPPC PPC
        LEFT OUTER JOIN SKLLPDS PDS ON PPC.PEDIDO = PDS.PEDIDO
        WHERE 
            ({where_clause})
            AND PPC.OS STARTING WITH '20000'
        ORDER BY {orderby} {ascdesc}    
    """
    
    return executar_query(query, query_params)
    
def get_registro(registro):
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
    return executar_query_one(query, (registro,))

def update_dtentrega(registro, data):
    date_obj = datetime.strptime(data, "%d/%m/%y")
    firebird_date = date_obj.strftime("%Y-%m-%d")

    query = """
            UPDATE SKLLPPC
            SET DTENTREGA = ?
            WHERE REGISTRO = ?
    """
    
    with firebird_connection() as conn:  
        if conn:
            try:
                cursor = conn.cursor()
                cursor.execute(query, (firebird_date, registro))
                conn.commit()
                return cursor.rowcount
            except Exception as e:
                logging.error(f"Erro ao atualizar DTENTREGA: {e}")
                return 0  

def update_volumes(volume: int, pedido: int) -> int:
    print(f"Tentando atualizar: PEDIDO={pedido}, NOVO VOLUME={volume}")
    query = """
        UPDATE SKLLPDS
        SET VOLNUMERO = ?
        WHERE PEDIDO = ?
    """
    with firebird_connection() as conn:
        if conn:
            try:
                cursor = conn.cursor()
                cursor.execute(query, (volume, pedido))
                conn.commit()
                print(f"Linhas afetadas: {cursor.rowcount}")
                if cursor.rowcount == 0:
                    print(f"Nenhum registro atualizado para PEDIDO={pedido}")
                return cursor.rowcount
            except Exception as e:
                print(f"Erro ao atualizar VOLNUMERO para PEDIDO={pedido}: {e}")
                return 0
        else:
            print("Conexão com o banco de dados não estabelecida.")
            return 0

def update_marcar_entregue(nnota: int, data):
    date_obj = datetime.strptime(data, "%d/%m/%y")
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

    with firebird_connection() as conn:
        if conn:
            try:
                cursor = conn.cursor()
                cursor.execute(query1, (firebird_date, nnota))
                cursor.execute(query2, (firebird_date, nnota))
                conn.commit()
                return cursor.rowcount
            except Exception as e:
                logging.error(f"Erro ao marcar como entregue: {e}")
                return 0  

def get_registro_detalhe(registro):
    query = """
      SELECT DISTINCT 
            EMP.EMPRESA,
            EMP.SIGLA,
            EMP.ENDERECO,
            EMP.CIDADE,
            EMP.BAIRRO,
            EMP.ESTADO,
            EMP.CEP,
            EMP.CGC,
            EMP.PREFIXO,
            EMP.TELEFONE,
            PPC.REGISTRO,
            PPC.DATA,
            PPC.DTENTREGA,
            PPC.OS,
            PPC.CON_NOME,
            PPC.OBS,            
            PDS.NNOTA,
            PDS.VOLNUMERO,
            PDS.TRANSEMPRESA,            
            PPI.TP,
            PPI.QUANT,
            PPI.NOME,
            PPI.OBS,
            PPI.COMANDO,
            PPI.LARG,
            PPI.ALT,
            PPI.M2,
            PPI.MODELO,
            PPI.SEQ,
            PPI.COMPR,
            PPI.LATE,
            PPI.LATD,
            PPC.STATUS,
            PPC.PEDIDO

      FROM SKLLPPI PPI
            LEFT OUTER JOIN SKLLEMP EMP ON PPI.SIGLA = EMP.SIGLA
            LEFT OUTER JOIN SKLLPPC PPC ON PPI.REGISTRO = PPC.REGISTRO
            LEFT OUTER JOIN SKLLPDS PDS ON PPC.PEDIDO = PDS.PEDIDO
      WHERE 
        PPC.OS STARTING WITH '20000'
      AND PPI.REGISTRO = ?   
      """

    return executar_query(query, (registro,))

def get_producao():
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
    return executar_query(query)

def get_romaneios():
    query = """
      SELECT 
            PPC.REGISTRO,
            PPC.CON_NOME,
            EMP.EMPRESA,
            EMP.SIGLA,
            PPC.OS,
            PPC.TRANSPORTADORA,
            PPC.CON_OBS,
            PDS.NNOTA,
            PDS.VOLNUMERO,
            PDS.DTENTREGA,
            PDS.PEDIDO 
      FROM SKLLPDS PDS
            LEFT OUTER JOIN SKLLEMP EMP ON PDS.SIGLA = EMP.SIGLA
            LEFT OUTER JOIN SKLLPPC PPC ON PDS.PEDIDO = PPC.PEDIDO
      WHERE (PDS.ENTREGUE =  'ENTREGUE'  AND EMP.RAMO1 = 'CLI'  AND PPC.OS LIKE '20000%' AND PDS.DTENTREGA = CURRENT_DATE)
      """
    return executar_query(query)

def get_comissao(first, last):
    date_obj_first = datetime.strptime(first, "%d/%m/%y")
    date_obj_last = datetime.strptime(last, "%d/%m/%y")
    fb_date_first = date_obj_first.strftime("%Y-%m-%d")
    fb_date_last = date_obj_last.strftime("%Y-%m-%d")

    query = '''
    SELECT 
        PPC.SETOR_PPM,
        SUM(PPI.QUANT) AS TOTAL_QUANT
    FROM SKLLPPC PPC
        LEFT OUTER JOIN SKLLEMP EMP ON PPC.SIGLA = EMP.SIGLA
        LEFT OUTER JOIN SKLLPPI PPI ON PPC.REGISTRO = PPI.REGISTRO
        LEFT OUTER JOIN SKLLPDS PDS ON PPC.PEDIDO = PDS.PEDIDO 
        LEFT OUTER JOIN SKLLPRO PRI ON PPI.PRODUTO = PRI.PRODUTO
    WHERE 
        (PPC.STATUS IN ('F','E') AND (PPI.TP <> 'C' OR PRI.PRODUTO = '012.172.000.00.01') AND PPI.TP <> 'B')         
    AND 
        (PDS.FAT = 'F') 
    AND 
        PDS.DTNOTA >= ? AND PDS.DTNOTA <= ?
    GROUP BY PPC.SETOR_PPM
    ORDER BY PPC.SETOR_PPM
    '''

    return executar_query(query, (fb_date_first, fb_date_last))