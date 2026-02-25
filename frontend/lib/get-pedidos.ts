import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function getPedidos(qtd : Number | 0) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.accessToken;

  if (!session || !token) return null;

  const backendUrl = process.env.NEXT_PUBLIC_URLBACKEND || 'http://127.0.0.1:8000';
  const resp = await fetch(`${backendUrl}/pedidos/?page=${qtd}`, {
    headers: { 'Authorization': `Bearer ${token}` },
    cache: 'no-store'
  });

  return resp.json();
}