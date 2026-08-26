import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DATA_FILE = path.join(process.cwd(), "data", "site-images.json");
const TMP_DATA_FILE = path.join(os.tmpdir(), "site-images.json");

function readSiteData() {
  if (fs.existsSync(TMP_DATA_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(TMP_DATA_FILE, "utf8"));
      if (!data.testimonials) data.testimonials = [];
      return data;
    } catch (e) {
      console.warn("Error reading from temp storage:", e);
    }
  }

  if (fs.existsSync(DATA_FILE)) {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    if (!data.testimonials) data.testimonials = [];
    return data;
  }

  return { brandVision: {}, heroTunnel: [], exploreGallery: [], testimonials: [] };
}

function writeSiteData(data: unknown) {
  const jsonStr = JSON.stringify(data, null, 2);
  let written = false;

  try {
    const tmpDir = path.dirname(TMP_DATA_FILE);
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    fs.writeFileSync(TMP_DATA_FILE, jsonStr, "utf8");
    written = true;
  } catch (tmpErr) {
    console.warn("Could not write to tmp directory:", tmpErr);
  }

  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, jsonStr, "utf8");
    written = true;
  } catch (fsErr: any) {
    if (fsErr.code !== "EROFS") {
      console.warn("Could not write to project data directory:", fsErr);
    }
  }

  if (!written) {
    throw new Error("Failed to write to file storage");
  }
}

export async function GET() {
  try {
    const data = readSiteData();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    writeSiteData(body);
    return NextResponse.json({ ok: true, message: "Data updated successfully" });
  } catch (e: any) {
    console.error("POST /api/site-data error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
