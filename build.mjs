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
    filter: source => {
      const name = path.basename(source);
      const normalized = source.replaceAll("\\", "/");
      if (/^depoimento-completo-[1-4]\.mp4$/i.test(name)) return false;
      if (/^kit-(?:3|5|8|12)-caixas-massageador\.png$/i.test(name)) return false;
      if (/^(?:depoimento-agradecimento|depoimento-recomendacao|recebimento-caixa)\.(?:jpg|mp4)$/i.test(name)) return false;
      if (/^kit-source-\d+\.jpe?g$/i.test(name)) return false;
      if (normalized.includes("/assets/brand/") || normalized.includes("/assets/images/social/")) return false;
      return true;
    }
  });
}
console.log('Site pronto em dist/ (vídeos integrais no R2; vitrines servidas em WebP)');
