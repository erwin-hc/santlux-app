from contextlib import contextmanager
from queue import Empty, Queue
from threading import Lock

import firebirdsql as fb  # pyright: ignore[reportMissingImports]


class FirebirdPool:
    def __init__(self, config: dict, size: int = 5):
        self._config = config
        self._pool: Queue = Queue(maxsize=size)
        self._lock = Lock()
        for _ in range(size):
            self._pool.put(self._new_conn())

    def _new_conn(self):
        return fb.connect(**self._config)

    @contextmanager
    def get_conn(self):
        try:
            conn = self._pool.get(timeout=10)
        except Empty:
            raise RuntimeError("Pool esgotado")
        try:
            yield conn
        except Exception:
            # Conexão pode estar corrompida — descarta e cria nova
            try:
                conn.close()
            except:  # noqa: E722
                pass
            conn = self._new_conn()
            raise
        finally:
            self._pool.put(conn)


BD_CONFIG = {
    "host": "localhost",
    "database": r"C:\TESTE.FDB",
    "port": 3050,
    "user": "sysdba",
    "password": "masterkey",
    "charset": "latin1",
}

# BD_CONFIG = {
#     "host": "10.0.0.2",
#     "database": r"C:\SERKELLB\EMPRESAS\SANTLUX.FDB",
#     "port": 3050,
#     "user": "sysdba",
#     "password": "masterkey",
#     "charset": "latin1",
# }

_pool = FirebirdPool(BD_CONFIG, size=5)


def get_db():
    return _pool.get_conn()


def run_query(query: str, params: tuple = ()):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute(query, params)
        if cur.description is None:
            conn.commit()
            return {"rows_affected": cur.rowcount}
        columns = [col[0].lower() for col in cur.description]
        return [dict(zip(columns, row)) for row in cur.fetchall()]
