import * as fs from "fs";
import * as path from "path";
import { spawn } from "child_process";
import { createHash } from "crypto";

const SOUNDS_DIR = "sounds/GladOS";

function sanitizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_");
}

function findAvailableFilename(basePath: string, baseFilename: string): string {
  let filename = baseFilename;
  let counter = 1;

  while (fs.existsSync(path.join(basePath, filename))) {
    const ext = path.extname(baseFilename);
    const nameWithoutExt = baseFilename.slice(0, -ext.length);
    filename = `${nameWithoutExt}_${counter}${ext}`;
    counter++;
  }

  return filename;
}

function generateUniqueFilename(text: string): string {
  const sanitized = sanitizeText(text);
  const hash = createHash("md5").update(text).digest("hex").slice(0, 6);

  const baseFilename = `${sanitized}_${hash}.wav`;
  return findAvailableFilename(SOUNDS_DIR, baseFilename);
}

function generateVoiceLine(text: string): void {
  if (!fs.existsSync(SOUNDS_DIR)) {
    fs.mkdirSync(SOUNDS_DIR, { recursive: true });
  }

  const filename = generateUniqueFilename(text);
  const outputPath = path.join(SOUNDS_DIR, filename);

  const curl = spawn("curl", [
    "-L",
    "--retry",
    "30",
    "--get",
    "--fail",
    "--data-urlencode",
    `text=${text}`,
    "-o",
    outputPath,
    "https://glados.c-net.org/generate",
  ]);

  curl.stdout.on("data", (data) => {
    process.stdout.write(data);
  });

  curl.stderr.on("data", (data) => {
    process.stderr.write(data);
  });

  curl.on("close", (code) => {
    if (code === 0) {
      console.log("\nGenerated successfully!");
      console.log(`Filename: ${filename}`);
      console.log(`Text: "${text}"`);
      console.log(`Path: ${outputPath}`);
    } else {
      console.error(`\nError: Process exited with code ${code}`);
    }
  });
}

const text = process.argv.slice(2).join(" ");

if (!text) {
  console.error("Please provide text to generate");
  console.error('Usage: pnpm voice "Your text here"');
  process.exit(1);
}

generateVoiceLine(text);
