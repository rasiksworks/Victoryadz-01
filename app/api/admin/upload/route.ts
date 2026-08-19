import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const rawName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const cleanBaseName = rawName.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
    const filename = `${Date.now()}-${cleanBaseName}.webp`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);

    // Convert to high quality WebP
    await sharp(buffer)
      .webp({ quality: 85, effort: 4 })
      .toFile(filePath);

    const fileUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: fileUrl, format: 'webp' });
  } catch (error: any) {
    console.error('File upload failed:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload file' }, { status: 500 });
  }
}
