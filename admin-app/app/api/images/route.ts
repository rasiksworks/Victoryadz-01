import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/data";
export async function GET() {
  try { return NextResponse.json(readData()); }
  catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}
export async function POST(req: Request) {
  try { writeData(await req.json()); return NextResponse.json({ ok: true }); }
  catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}
