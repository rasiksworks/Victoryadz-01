import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DATA_FILE = path.join(process.cwd(), "data", "site-images.json");

export async function GET() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
      if (!data.testimonials) data.testimonials = [];
      return NextResponse.json(data, {
        headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" },
      });
    }
    return NextResponse.json({ error: "Data file not found" }, { status: 404 });
  } catch (e: any) {
    console.error("GET /api/images error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(body, null, 2), "utf8");
    return NextResponse.json({ ok: true, message: "Site data saved successfully" });
  } catch (e: any) {
    console.error("POST /api/images error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
