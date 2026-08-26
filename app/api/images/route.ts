import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DATA_FILE = path.join(process.cwd(), "data", "site-images.json");
const TMP_DATA_FILE = path.join(os.tmpdir(), "site-images.json");

function readSiteData() {
  // 1. Check if temporary serverless storage has the latest data
  if (fs.existsSync(TMP_DATA_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(TMP_DATA_FILE, "utf8"));
      if (!data.testimonials) data.testimonials = [];
      return data;
    } catch (e) {
      console.warn("Error reading from temp storage:", e);
    }
  }

  // 2. Fall back to bundled data file
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

  // 1. Write to os.tmpdir() (always writable in Vercel / serverless runtime)
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

  // 2. Attempt to write to project data directory (works in local dev)
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, jsonStr, "utf8");
    written = true;
  } catch (fsErr: any) {
    // EROFS is expected on Vercel serverless /var/task read-only file system
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
      headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" },
    });
  } catch (e: any) {
    console.error("GET /api/images error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    writeSiteData(body);
    return NextResponse.json({ ok: true, message: "Site data saved successfully" });
  } catch (e: any) {
    console.error("POST /api/images error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
