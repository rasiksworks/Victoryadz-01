import { NextResponse } from "next/server";
import { mkdirSync } from "fs";
import path from "path";
import sharp from "sharp";
import { UPLOADS_DIR } from "@/lib/data";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    mkdirSync(UPLOADS_DIR, { recursive: true });
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Clean base name and generate .webp filename
    const rawName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
    const cleanBaseName = rawName.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
    const filename = `${Date.now()}-${cleanBaseName}.webp`;
    const outputPath = path.join(UPLOADS_DIR, filename);

    // Automatically convert any image format (PNG, JPG, HEIC, TIFF, etc.) to optimized WebP
    await sharp(buffer)
      .webp({ quality: 85, effort: 4 })
      .toFile(outputPath);

    return NextResponse.json({
      url: `/uploads/${filename}`,
      format: "webp",
      originalName: file.name,
    });
  } catch (e: any) {
    console.error("Upload error:", e);
    return NextResponse.json({ error: e.message || "Failed to process and convert image to WebP" }, { status: 500 });
  }
}
