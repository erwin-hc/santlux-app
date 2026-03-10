import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "0";
  const pageSize = searchParams.get("limit") || "10"; 
  
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const backendUrl = process.env.NEXT_PUBLIC_URLBACKEND;
  const resp = await fetch(`${backendUrl}/pedidos/?page=${page}&limit=${pageSize}`, {
    headers: { 'Authorization': `Bearer ${session.user.accessToken}` }
  });

  const data = await resp.json();
  return NextResponse.json(data);
}