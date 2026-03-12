import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const page = searchParams.get("page") || "0";
  const limit = searchParams.get("limit") || "15";

  const backendUrl = process.env.NEXT_PUBLIC_URLBACKEND;

  // We hit the same FastAPI endpoint, just passing different query params
  const targetUrl = search ? `${backendUrl}/pedidos/?search=${encodeURIComponent(search)}` : `${backendUrl}/pedidos/?page=${page}&limit=${limit}`;

  try {
    const resp = await fetch(targetUrl, {
      headers: { Authorization: `Bearer ${session.user.accessToken}` },
    });
    const data = await resp.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Connection to backend failed" }, { status: 500 });
  }
}
