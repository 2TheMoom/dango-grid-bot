// @left-curve/sdk@1.0.0 ships subpath imports (e.g. "#actions/*") pointing at
// "./src/*", but only publishes "build/" — so any import resolves to a missing
// file (ERR_MODULE_NOT_FOUND). Repoint the imports map at the shipped build
// output. Runs on every install since node_modules isn't committed.
const fs = require("fs");
const path = require("path");

const pkgPath = path.join(__dirname, "..", "node_modules", "@left-curve", "sdk", "package.json");
if (!fs.existsSync(pkgPath)) process.exit(0);

const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
let changed = false;
for (const key of Object.keys(pkg.imports || {})) {
  if (pkg.imports[key].startsWith("./src/")) {
    pkg.imports[key] = pkg.imports[key].replace("./src/", "./build/");
    changed = true;
  }
}
if (changed) {
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  console.log("Patched @left-curve/sdk imports map (./src/* -> ./build/*)");
}
