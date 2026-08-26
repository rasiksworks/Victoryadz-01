import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    return NextResponse.json(readData(), {
      headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" },
    });
  } catch (e: any) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    writeData(body);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
