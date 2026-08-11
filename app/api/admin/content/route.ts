import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

const dataFilePath = path.join(process.cwd(), 'data', 'site-images.json');

export async function GET() {
  try {
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to read site-images.json:', error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate data structure loosely
    if (!data.heroTunnel || !data.brandVision || !data.recentWorks || !data.exploreGallery) {
      return NextResponse.json({ error: 'Invalid data structure' }, { status: 400 });
    }

    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    
    // Revalidate paths so the main site updates instantly without a hard refresh
    revalidatePath('/');
    revalidatePath('/works');
    
    return NextResponse.json({ success: true, message: 'Data updated successfully' });
  } catch (error) {
    console.error('Failed to write site-images.json:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
