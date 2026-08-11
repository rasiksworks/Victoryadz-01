import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate that this is the correct structure (basic validation)
    if (!data.hero || !data.brandVision || !data.exploreGrid) {
      return NextResponse.json({ error: 'Invalid data structure' }, { status: 400 });
    }

    // Path to the data file in the root of the project
    const dataFilePath = path.join(process.cwd(), 'data', 'site-images.json');
    
    // Ensure directory exists
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write the new data
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');

    return NextResponse.json({ success: true, message: 'Images updated successfully' });
  } catch (error: any) {
    console.error('Error saving images:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
