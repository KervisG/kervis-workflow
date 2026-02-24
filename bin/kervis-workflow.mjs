#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const skillsSourceDir = path.resolve(__dirname, "..", "skills");
const skillsTargetDir = path.resolve(process.cwd(), "skills");

const args = process.argv.slice(2);
const cmd = args[0] ?? "init";
const force = args.includes("--force");
const withSkills = args.includes("--with-skills");

function getPreset(argv) {
  const inline = argv.find((a) => a.startsWith("--preset="));
  if (inline) return inline.split("=")[1] ?? "";
  const i = argv.indexOf("--preset");
  if (i === -1) return "frontend";
  return argv[i + 1] ?? "";
}

const preset = getPreset(args);

function getAgentsPaths(presetName) {
  if (presetName === "frontend" || presetName === "default") {
    return {
      templateAgents: path.resolve(__dirname, "..", "templates", "AGENTS.md"),
      targetAgents: path.resolve(process.cwd(), "AGENTS.md"),
    };
  }

  if (presetName === "backend") {
    return {
      templateAgents: path.resolve(
        __dirname,
        "..",
        "templates",
        "backend",
        "AGENTS.md"
      ),
      targetAgents: path.resolve(process.cwd(), "backend", "AGENTS.md"),
    };
  }

  if (presetName === "react-native") {
    return {
      templateAgents: path.resolve(
        __dirname,
        "..",
        "templates",
        "react-native",
        "AGENTS.md"
      ),
      targetAgents: path.resolve(process.cwd(), "AGENTS.md"),
    };
  }

  return null;
}

const agentsPaths = getAgentsPaths(preset);

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
  console.error(
    "Usage: kervisworkflow init [--preset frontend|backend|react-native] [--force] [--with-skills]"
  );
  process.exit(1);
}

if (!agentsPaths) {
  console.error(
    `Unknown preset: ${preset}. Use --preset frontend|backend|react-native (default: frontend).`
  );
  process.exit(1);
}

const { templateAgents, targetAgents } = agentsPaths;

if (!fs.existsSync(templateAgents)) {
  console.error(`Template not found: ${templateAgents}`);
  process.exit(1);
}

if (fs.existsSync(targetAgents) && !force) {
  console.error("AGENTS.md already exists. Use --force to overwrite.");
  process.exit(1);
}

fs.mkdirSync(path.dirname(targetAgents), { recursive: true });
fs.copyFileSync(templateAgents, targetAgents);
console.log(`Created ${path.relative(process.cwd(), targetAgents)}`);

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
