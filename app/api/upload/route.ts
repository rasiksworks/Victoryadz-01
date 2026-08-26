import { NextResponse } from "next/server";
import { mkdirSync } from "fs";
import path from "path";
import sharp from "sharp";

export const dynamic = "force-dynamic";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Clean base name and generate .webp filename
    const rawName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
    const cleanBaseName = rawName.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
    const filename = `${Date.now()}-${cleanBaseName}.webp`;

    // Process and convert image to WebP buffer
    const webpBuffer = await sharp(buffer)
      .webp({ quality: 85, effort: 4 })
      .toBuffer();

    // Try saving to public/uploads directory (works in writable environments)
    try {
      mkdirSync(UPLOADS_DIR, { recursive: true });
      const outputPath = path.join(UPLOADS_DIR, filename);
      await sharp(buffer).webp({ quality: 85, effort: 4 }).toFile(outputPath);
      return NextResponse.json({
        url: `/uploads/${filename}`,
        format: "webp",
        originalName: file.name,
      });
    } catch (fsErr: any) {
      // In serverless / read-only filesystem environments (Vercel EROFS), return base64 WebP data URL
      const base64Url = `data:image/webp;base64,${webpBuffer.toString("base64")}`;
      return NextResponse.json({
        url: base64Url,
        format: "webp",
        originalName: file.name,
      });
    }
  } catch (e: any) {
    console.error("Upload error:", e);
    return NextResponse.json(
      { error: e.message || "Failed to process and convert image to WebP" },
      { status: 500 }
    );
  }
}
