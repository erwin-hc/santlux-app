export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ anoStr: string }> },
) {
  const resolvedParams = await params;
  const anoVindoDaUrl = resolvedParams.anoStr;

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_URLBACKEND;

    const anoValido =
      anoVindoDaUrl && anoVindoDaUrl !== "undefined"
        ? anoVindoDaUrl
        : new Date().getFullYear().toString();

    const url = `${backendUrl}/comissao/${anoValido}`;

    console.log("ANO DEFINITIVO PARA O BACKEND:", anoValido);

    const resp = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!resp.ok) {
      const errorData = await resp.json();
      return NextResponse.json(
        { error: errorData.detail || "Erro" },
        { status: resp.status },
      );
    }

    const data = await resp.json();

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Erro no Route Handler:", error);
    return NextResponse.json({ message: "Falha no servidor" }, { status: 500 });
  }
}
