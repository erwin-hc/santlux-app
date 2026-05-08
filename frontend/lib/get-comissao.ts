export async function getComissao(anoString: string) {
  const request = await fetch(`/api/comissao/${anoString}`, {
    cache: "no-store",
  });

  if (!request.ok) {
    throw new Error("Erro ao buscar comissão");
  }

  const resp = await request.json();

  return Array.isArray(resp.data) ? resp.data : [];
}
