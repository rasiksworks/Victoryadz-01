import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const dataFilePath = path.join(process.cwd(), "data", "site-images.json");
    if (fs.existsSync(dataFilePath)) {
      const data = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
      return NextResponse.json(data, {
        headers: {
          "Cache-Control": "no-store, max-age=0, must-revalidate",
        },
      });
    }
    return NextResponse.json({ error: "Data file not found" }, { status: 404 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
