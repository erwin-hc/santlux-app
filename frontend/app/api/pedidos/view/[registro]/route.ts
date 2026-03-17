import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ registro: string }> }) {
  const { registro } = await params;

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // ❌ REMOVIDO: const body = await request.json();
    // Em um GET, não existe body vindo do front.

    const backendUrl = process.env.NEXT_PUBLIC_URLBACKEND;
    const registroId = parseInt(registro);

    const resp = await fetch(`${backendUrl}/pedidos/view/${registroId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
        "Content-Type": "application/json",
      },
      // ❌ REMOVIDO: body: JSON.stringify(body),
      // Seu backend Python também espera um GET puro.
    });

    const data = await resp.json();

    if (!resp.ok) {
      return NextResponse.json(data, { status: resp.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro no Route Handler:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
