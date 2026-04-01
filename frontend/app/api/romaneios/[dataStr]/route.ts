import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ dataStr: string }> }) {
  const { dataStr } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_URLBACKEND;

    const resp = await fetch(`${backendUrl}/romaneios/${dataStr}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const result = await resp.json();

    if (!resp.ok) {
      return NextResponse.json(result, { status: resp.status });
    }

    return NextResponse.json({
      status: "sucesso",
      data: result.data || [],
    });
  } catch (error) {
    console.error("Erro no Route Handler:", error);
    return NextResponse.json({ status: "erro", data: [] }, { status: 500 });
  }
}
