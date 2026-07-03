const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "src");

const replacements = [
  { from: "@/shared/components", to: "@/presentation/components" },
  { from: "@/shared/hooks", to: "@/presentation/hooks" },
  { from: "@/shared/stores", to: "@/presentation/stores" },
  { from: "@/shared/styles", to: "@/presentation/styles" },
  { from: "@/shared/img", to: "@/presentation/assets/img" },
  { from: "@/assets", to: "@/presentation/assets" },
  { from: "@/shared/config", to: "@/core/config" },
  { from: "@/config", to: "@/core/config" },
  { from: "@/shared/types", to: "@/core/types" },
  { from: "@/shared/utils", to: "@/core/utils" },
  { from: "@/shared/data", to: "@/core/constants" },
  { from: "@/shared/lib", to: "@/infrastructure/lib" },
];

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let originalContent = content;

  replacements.forEach(({ from, to }) => {
    // Escape special regex characters if needed, but for simple paths it's fine.
    // We replace generic occurrences.
    const regex = new RegExp(from, "g");
    content = content.replace(regex, to);
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Updated: ${filePath}`);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walk(filePath);
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      updateFile(filePath);
    }
  });
}

console.log("Starting import update...");
walk(rootDir);
console.log("Import update complete.");
