import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: Promise<{ notafiscal: string }> }) {
  const { notafiscal } = await params;

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_URLBACKEND;

    const notafiscalID = parseInt(notafiscal);

    const resp = await fetch(`${backendUrl}/pedidos/entrega/${notafiscalID}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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
