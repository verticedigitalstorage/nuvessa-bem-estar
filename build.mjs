import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(root, 'dist');
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
for (const item of ['index.html', 'privacidade.html', 'termos.html', 'aviso-legal.html', '404.html', '_headers', 'robots.txt', 'sitemap.xml', 'assets', 'css', 'js']) {
  cpSync(path.join(root, item), path.join(output, item), {
    recursive: true,
    filter: source => !/^depoimento-completo-[1-4]\.mp4$/i.test(path.basename(source))
  });
}
console.log('Site pronto em dist/ (depoimentos integrais servidos pelo Cloudflare R2)');
