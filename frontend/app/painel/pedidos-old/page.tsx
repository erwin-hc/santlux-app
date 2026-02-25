import { getPedidos } from "@/lib/get-pedidos";

const Pedidos = async () => {
  const data = await getPedidos(0); // No fetch call to /api/pedidos!

  if (!data) return <div>Redirecionando ou Erro de Login...</div>;

  console.log(data);
  return <>Pedidos</>;
};

export default Pedidos;