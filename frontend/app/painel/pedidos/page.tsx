import { columns, Payment } from "./columns"
import { DataTable } from "./data-table"
import { getPedidos } from "@/lib/get-pedidos";

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
  {
    "status": "F",
    "data": "2026-01-09",
    "con_nome": "CLEVERSON MORELLI ",
    "registro": 70653,
    "os": "2000014553065448",
    "previsao": "2026-01-13",
    "nnota": 38956
  },
  ]
}

export default async function Page() {
  // const data = await getData()
  const data = await getPedidos(0); // No fetch call to /api/pedidos!

  if (!data) return <div>Redirecionando ou Erro de Login...</div>;

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}