import path from "path";
import fs from "fs";
import os from "os";

const rootDir = process.cwd().endsWith("admin-app") ? path.join(process.cwd(), "..") : process.cwd();
const DATA_FILE = path.join(rootDir, "data", "site-images.json");
const TMP_DATA_FILE = path.join(os.tmpdir(), "site-images.json");

export const PUBLIC_DIR = path.join(rootDir, "public");
export const UPLOADS_DIR = path.join(rootDir, "public", "uploads");

export function readData() {
  // 1. Check if temporary serverless storage has the latest updated data
  if (fs.existsSync(TMP_DATA_FILE)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(TMP_DATA_FILE, "utf8"));
      if (!parsed.testimonials) parsed.testimonials = [];
      return parsed;
    } catch (e) {
      console.warn("Error reading from temp storage:", e);
    }
  }

  // 2. Read from default bundled data file
  if (fs.existsSync(DATA_FILE)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
      if (!parsed.testimonials) parsed.testimonials = [];
      return parsed;
    } catch (e) {
      console.warn("Error reading from bundled file:", e);
    }
  }

  return { brandVision: {}, heroTunnel: [], exploreGallery: [], testimonials: [] };
}

export function writeData(data: unknown) {
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
