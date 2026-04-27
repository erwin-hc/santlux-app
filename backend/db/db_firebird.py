import logging
from contextlib import contextmanager

import firebirdsql as fb

# Configurações de conexão
BD_CONFIG = {
    "host": "localhost",
    "database": r"C:\TESTE.FDB",
    "port": 3050,
    "user": "sysdba",
    "password": "masterkey",
    "charset": "latin1",
}


@contextmanager
def get_db():
    """Gerenciador de contexto para garantir que a conexão sempre feche."""
    conn = None
    try:
        conn = fb.connect(**BD_CONFIG)
        yield conn
    except Exception as e:
        logging.error(f"Erro de conexão: {e}")
        raise e
    finally:
        if conn:
            conn.close()


def run_query(query: str, params: tuple = ()):
       
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute(query, params)

        if cur.description is None:
            conn.commit()
            return {"rows_affected": cur.rowcount}

        columns = [col[0].lower() for col in cur.description]
        return [dict(zip(columns, row)) for row in cur.fetchall()]
