import path from "path";
import fs from "fs";
const DATA_FILE = path.join(process.cwd(), "..", "data", "site-images.json");
export const UPLOADS_DIR = path.join(process.cwd(), "..", "public", "uploads");
export function readData() { return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")); }
export function writeData(data: unknown) { fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8"); }
