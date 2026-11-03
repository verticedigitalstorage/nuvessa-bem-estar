import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..", "dist");
const pass = [];
const fail = [];
const check = (condition, label) => (condition ? pass : fail).push(label);
const read = file => fs.readFileSync(path.join(root, file), "utf8");

check(fs.existsSync(root), "Diretório público dist foi gerado");

const index = read("index.html");
const sandbox = { window: {} };
vm.runInNewContext(read("js/config.js"), sandbox);
const cfg = sandbox.window.NERVO_CONFIG;

const internalLinks = [...index.matchAll(/(?:href|src|poster)="(?!https?:|#|mailto:)([^"?]+)"/g)].map(match => match[1]);
for (const target of internalLinks) {
  check(fs.existsSync(path.join(root, target)), `Build contém recurso: ${target}`);
}

for (const offer of cfg.OFFERS) {
  check(fs.existsSync(path.join(root, offer.image)), `Build contém imagem do kit ${offer.id}`);
}

const publicFiles = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else publicFiles.push(full);
  }
}
walk(root);

const publicBytes = publicFiles.reduce((total, file) => total + fs.statSync(file).size, 0);
check(publicBytes < 5_000_000, "Build público permanece abaixo de 5 MB");
check(!publicFiles.some(file => /depoimento-completo-[1-4]\.mp4$/i.test(file)), "Vídeos integrais não são duplicados no build público");
check(!publicFiles.some(file => /kit-(?:3|5|8|12)-caixas-massageador\.png$/i.test(file)), "PNGs pesados dos kits não são enviados ao build público");
check(read("_headers").includes("Content-Security-Policy"), "Build inclui política CSP");

console.log(`BUILD PASS: ${pass.length}`);
pass.forEach(item => console.log(`  ✓ ${item}`));
if (fail.length) {
  console.error(`BUILD FAIL: ${fail.length}`);
  fail.forEach(item => console.error(`  ✗ ${item}`));
  process.exitCode = 1;
} else {
  console.log("BUILD FAIL: 0");
  console.log(`BUILD SIZE: ${(publicBytes / 1_000_000).toFixed(2)} MB`);
}
