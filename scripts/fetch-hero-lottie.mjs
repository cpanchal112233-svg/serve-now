/**
 * Downloads a small sample dotLottie into public/animations/servenow-hologram.lottie
 * when network is available. Safe to run on every install; skips if file exists.
 */
import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "public", "animations");
const outFile = path.join(outDir, "servenow-hologram.lottie");

const URL =
  "https://lottie.host/4db68efc-31f6-4cd0-84d6-6412e73f432c/DPOWcFx6Xg.lottie";

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (res) => {
        if (res.statusCode && res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
  });
}

async function main() {
  if (fs.existsSync(outFile) && fs.statSync(outFile).size > 1000) {
    console.log("[fetch-hero-lottie] Skipping — file already present.");
    return;
  }
  fs.mkdirSync(outDir, { recursive: true });
  try {
    await download(URL, outFile);
    console.log("[fetch-hero-lottie] Saved", path.relative(root, outFile));
  } catch (e) {
    console.warn("[fetch-hero-lottie] Skipped (offline or blocked):", e.message);
    if (fs.existsSync(outFile)) fs.unlinkSync(outFile);
  }
}

main();
