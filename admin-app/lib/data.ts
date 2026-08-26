import path from "path";
import fs from "fs";

const rootDir = process.cwd().endsWith("admin-app") ? path.join(process.cwd(), "..") : process.cwd();
const DATA_FILE = path.join(rootDir, "data", "site-images.json");
export const PUBLIC_DIR = path.join(rootDir, "public");
export const UPLOADS_DIR = path.join(rootDir, "public", "uploads");

export function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

export function writeData(data: unknown) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}
