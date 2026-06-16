import fs from "fs";
import path from "path";
import process from "process";

const { chromium } = await import("playwright");

const root = process.cwd();
const dataPath = path.resolve(root, "atlas_ops", "logs", "career_os_master.json");

function loadJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function waitForEnter(message) {
  process.stdout.write(`${message}\n`);
  return new Promise((resolve) => {
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    process.stdin.once("data", () => {
      process.stdin.pause();
      resolve();
    });
  });
}

const data = loadJson(dataPath);
const headline = data?.masterProfile?.targetHeadline || "LinkedIn review only";

console.log("Career OS LinkedIn preview helper");
console.log(`Proposed headline: ${headline}`);
console.log("Manual login is required. Nothing will be submitted automatically.");

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();
await page.goto("https://www.linkedin.com/login", { waitUntil: "domcontentloaded" });
await waitForEnter("Log in manually in the browser, then press Enter here to continue review.");
console.log("Review the proposed edits manually in LinkedIn. This helper will not submit changes.");

await waitForEnter("Press Enter again to close the browser.");
await browser.close();
