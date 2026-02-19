#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const templateAgents = path.resolve(__dirname, "..", "templates", "AGENTS.md");
const targetAgents = path.resolve(process.cwd(), "AGENTS.md");

const skillsSourceDir = path.resolve(__dirname, "..", "skills");
const skillsTargetDir = path.resolve(process.cwd(), "skills");

const args = process.argv.slice(2);
const cmd = args[0] ?? "init";
const force = args.includes("--force");
const withSkills = args.includes("--with-skills");

function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, entry.name);
    if (entry.isDirectory()) copyDir(src, dest);
    else if (entry.isFile()) fs.copyFileSync(src, dest);
  }
}

if (cmd !== "init") {
  console.error("Usage: kervisworkflow init [--force] [--with-skills]");
  process.exit(1);
}

if (!fs.existsSync(templateAgents)) {
  console.error(`Template not found: ${templateAgents}`);
  process.exit(1);
}

if (fs.existsSync(targetAgents) && !force) {
  console.error("AGENTS.md already exists. Use --force to overwrite.");
  process.exit(1);
}

fs.copyFileSync(templateAgents, targetAgents);
console.log("Created AGENTS.md");

if (withSkills) {
  if (!fs.existsSync(skillsSourceDir)) {
    console.error(`Skills dir not found: ${skillsSourceDir}`);
    process.exit(1);
  }

  if (fs.existsSync(skillsTargetDir)) {
    if (!force) {
      console.log("Skipped skills/ (already exists). Use --force to overwrite.");
      process.exit(0);
    }
    fs.rmSync(skillsTargetDir, { recursive: true, force: true });
  }

  copyDir(skillsSourceDir, skillsTargetDir);
  console.log("Created skills/");
}
