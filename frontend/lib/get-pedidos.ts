import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export interface PedidosResponse {
  data: unknown[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export async function getPedidos(
  page: number = 0,
  limit: number = 10,
): Promise<PedidosResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.user?.accessToken;

  if (!session || !token) return null;

  const backendUrl =
    process.env.NEXT_PUBLIC_URLBACKEND || "http://127.0.0.1:8000";

  try {
    const resp = await fetch(
      `${backendUrl}/pedidos/?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    if (!resp.ok) {
      console.error("Erro na API:", resp.status, resp.statusText);
      return null;
    }

    const data = await resp.json();

    return data;
  } catch (error) {
    console.error("Falha na requisição:", error);
    return null;
  }
}
