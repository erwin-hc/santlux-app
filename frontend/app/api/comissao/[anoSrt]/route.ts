import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { anoStr: string } },
) {
  const { anoStr } = params;

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_URLBACKEND;

    const anoValido =
      anoStr && anoStr !== "undefined"
        ? anoStr
        : new Date().getFullYear().toString();

    const url = `${backendUrl}/comissao/${anoValido}`;

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
        {
          error: errorData.detail || "Erro ao buscar comissão",
        },
        { status: resp.status },
      );
    }

    const data = await resp.json();

    return NextResponse.json({
      data,
    });
  } catch (error) {
    console.error("Erro no Route Handler:", error);

    return NextResponse.json(
      {
        status: "erro",
        message: "Falha na comunicação com o servidor",
      },
      { status: 500 },
    );
  }
}
