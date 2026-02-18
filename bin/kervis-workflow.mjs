#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const template = path.resolve(__dirname, "..", "templates", "AGENTS.md");
const target = path.resolve(process.cwd(), "AGENTS.md");

const args = process.argv.slice(2);
const cmd = args[0] ?? "init";
const force = args.includes("--force");

if (cmd !== "init") {
  console.error("Usage: kervisworkflow init [--force]");
  process.exit(1);
}

if (!fs.existsSync(template)) {
  console.error(`Template not found: ${template}`);
  process.exit(1);
}

if (fs.existsSync(target) && !force) {
  console.error("AGENTS.md already exists. Use --force to overwrite.");
  process.exit(1);
}

fs.copyFileSync(template, target);
console.log("Created AGENTS.md");
