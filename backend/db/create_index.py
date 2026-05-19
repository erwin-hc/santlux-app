import firebirdsql as fb

# Suas configurações de conexão originais
BD_CONFIG = {
    "host": "localhost",
    "database": r"C:\TESTE.FDB",
    "port": 3050,
    "user": "sysdba",
    "password": "masterkey",
    "charset": "latin1",
}

indices = [
    "CREATE INDEX IDX_SKLLPDS_PEDIDO ON SKLLPDS (PEDIDO);",
    "CREATE INDEX IDX_SKLLPPC_OS ON SKLLPPC (OS);",
    "CREATE INDEX IDX_SKLLPPC_REGISTRO ON SKLLPPC (REGISTRO);",
    "CREATE INDEX IDX_SKLLPDS_NNOTA ON SKLLPDS (NNOTA);",
]

print("Conectando ao banco de dados para criar os índices...")

try:
    conn = fb.connect(**BD_CONFIG)
    cur = conn.cursor()

    for sql in indices:
        nome_indice = sql.split()[2]
        try:
            print(f"Criando {nome_indice}...")
            cur.execute(sql)
            conn.commit()  # Garante a gravação de cada índice
            print(f"✓ {nome_indice} criado com sucesso!")
        except Exception as idx_err:
            # Caso o índice já exista por algum motivo, ele não trava o script
            print(f"X Erro ou índice já existente ({nome_indice}): {idx_err}")
            conn.rollback()

    cur.close()
    conn.close()
    print("\nProcesso finalizado!")

except Exception as e:
    print(f"Erro ao conectar no banco: {e}")
