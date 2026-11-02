import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const pass = [];
const fail = [];
const check = (condition, label) => (condition ? pass : fail).push(label);
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const sandbox = { window: {} };
vm.runInNewContext(read("js/config.js"), sandbox);
const cfg = sandbox.window.NERVO_CONFIG;
const index = read("index.html");
const mainJs = read("js/main.js");
const metaPixelJs = read("js/meta-pixel.js");
const headers = read("_headers");
const deployFiles = ["index.html", "privacidade.html", "termos.html", "aviso-legal.html", "404.html", "css/styles.css", "js/config.js", "js/meta-pixel.js", "js/main.js"];
const content = deployFiles.map(read).join("\n").toLowerCase();

check(cfg.OFFERS.length === 5, "Cinco ofertas públicas configuradas");
check(cfg.OFFERS.filter(o => o.placement === "main").length === 3, "Primeira vitrine contém 1, 3 e 5 caixas");
check(cfg.OFFERS.find(o => o.id === "5-caixas")?.featured === true, "Kit de 5 caixas marcado como destaque");
check(cfg.OFFERS.filter(o => o.placement === "extended").map(o => o.boxes).join(",") === "8,12", "Kits de 8 e 12 caixas ficam na área expansível");
check(cfg.SHOW_SPECIAL_OFFERS === false && cfg.SPECIAL_OFFERS.length === 4, "Ofertas especiais ocultas e configuráveis por uma chave");
check(cfg.GUARANTEE_DAYS === 90 && index.includes("Garantia de 90 dias"), "Garantia consistente em 90 dias");
check(cfg.LEGAL_RESPONSIBLE === "NUVESSA BEM ESTAR LTDA" && cfg.COMMERCIAL_EMAIL === "nuvessabemestar@gmail.com", "Responsável e contato comercial configurados");
check(cfg.BUSINESS_NAME === "Nuvessa Saúde & Bem-Estar" && index.includes("Nuvessa <b>Saúde &amp; Bem-Estar</b>"), "Nova marca Nuvessa Saúde & Bem-Estar aplicada");
check(index.includes('class="brand-logo"') && index.includes('src="assets/icons/favicon.svg"') && !index.includes('class="brand-mark"'), "Símbolo visual substitui o antigo N no cabeçalho");
check(!index.includes('class="trust-row"') && !index.includes("Informação clara") && !index.includes("Escolha simples"), "Bloco genérico de confiança removido");
check(index.indexOf('id="experiencias"') < index.indexOf('id="ofertas"') && index.indexOf('id="ofertas"') < index.indexOf('id="produto"'), "Jornada ordenada em depoimentos, kits e informação do produto");
check(cfg.BASE_URL === "https://nuvessabemestar.com.br" && read("sitemap.xml").includes(cfg.BASE_URL), "Domínio futuro centralizado no SEO e sitemap");
check(index.includes('id="experiencias"') && index.includes("depoimento-completo-1.mp4") && index.includes("depoimento-completo-4.mp4"), "Depoimentos integrais presentes na seção de experiências");
check((index.match(/class="story-card/g) || []).length === 4 && index.includes('class="stories-grid"') && [1, 2, 3, 4].every(number => index.includes(`depoimento-completo-${number}.mp4`)) && !index.includes("recebimento-caixa"), "Quatro depoimentos integrais e únicos ficam visíveis, sem o vídeo da caixa");
check([1, 2, 3, 4].every(number => index.includes(`https://pub-b31aff6972c544e58790c398b98875c5.r2.dev/depoimento-completo-${number}.mp4`)), "Quatro depoimentos integrais apontam para o bucket público R2");
check(read("_headers").includes("media-src 'self' https://pub-b31aff6972c544e58790c398b98875c5.r2.dev"), "Política de segurança permite mídia do bucket R2 configurado");
check(index.includes('class="mobile-offer-bar"') && index.includes('class="header-cta"'), "Acesso aos kits permanece visível no cabeçalho e no celular");
check(!index.includes("Ermelinda") && !index.includes("94226-8188") && !index.includes("DESTINATÁRIO"), "Provas sociais publicadas sem dados pessoais visíveis no HTML");
check(!content.includes("[responsável legal a definir]") && !content.includes("[e-mail comercial a definir]") && !content.includes("seu-dominio-aqui"), "Nenhum placeholder público restante");
check(cfg.OFFERS.every(o => o.image && fs.existsSync(path.join(root, o.image))), "Todos os kits possuem imagem local configurada");
check(cfg.OFFERS.every(o => o.originalPrice && o.installments === 12 && o.installmentPrice && o.price), "Cinco kits possuem preço anterior, parcelamento e valor à vista conforme a referência do produtor");
check(mainJs.includes('class="offer-quantity"') && mainJs.includes('loading="lazy"'), "Cards exibem quantidade e carregam imagens sob demanda");
check(cfg.META_PIXEL_ID === "1144579295213270", "Meta Pixel configurado com o ID informado");
check(index.indexOf('src="js/config.js"') < index.indexOf('src="js/meta-pixel.js"') && index.indexOf('src="js/meta-pixel.js"') < index.indexOf('src="js/main.js"'), "Scripts externos carregam na ordem configuração, Pixel e aplicação");
check(!index.includes("fbq(") && !index.includes("fbevents.js") && !/<script(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/script>/i.test(index), "Index não contém inicialização inline ou duplicada do Pixel");
check(metaPixelJs.includes('window.fbq("track", "PageView")') && !metaPixelJs.includes('"Purchase"'), "Pixel envia PageView e não dispara Purchase na página");
check(metaPixelJs.includes('localStorage.getItem(consentKey) === "accepted"') && mainJs.includes("NUVESSA_META_PIXEL.load()"), "Pixel permanece condicionado ao consentimento");
check((content.match(/1144579295213270/g) || []).length === 1, "ID do Pixel possui uma única configuração no projeto público");

const appendedScripts = [];
const pixelSandbox = {
  window: { NERVO_CONFIG: cfg },
  localStorage: { getItem: () => "accepted" },
  document: {
    getElementById: () => null,
    createElement: () => ({}),
    head: { append: (node) => appendedScripts.push(node) }
  }
};
vm.runInNewContext(metaPixelJs, pixelSandbox);
pixelSandbox.window.NUVESSA_META_PIXEL.load();
pixelSandbox.window.NUVESSA_META_PIXEL.load();
const pixelQueue = pixelSandbox.window.fbq.queue.map(args => Array.from(args));
check(appendedScripts.length === 1 && appendedScripts[0].src === "https://connect.facebook.net/pt_BR/fbevents.js", "Biblioteca oficial da Meta é carregada uma única vez");
check(pixelQueue.filter(args => args[0] === "init" && args[1] === cfg.META_PIXEL_ID).length === 1, "Pixel é inicializado uma única vez");
check(pixelQueue.filter(args => args[0] === "track" && args[1] === "PageView").length === 1, "PageView é enfileirado uma única vez após consentimento");

for (const offer of [...cfg.OFFERS, ...cfg.SPECIAL_OFFERS]) {
  const url = new URL(offer.url);
  check(url.hostname === "pay.braip.co" && url.searchParams.get("af") === "afidn9137l" && url.searchParams.get("ck") === "cherq188" && Boolean(url.searchParams.get("pl")), `Link ${offer.id} preserva pl, ck e afiliado`);
}

const sample = new URL(cfg.OFFERS[2].url);
const incoming = new URLSearchParams("utm_source=facebook&utm_campaign=teste&fbclid=abc123&af=tentativa");
for (const key of cfg.TRACKABLE_PARAMS) if (incoming.has(key) && !sample.searchParams.has(key)) sample.searchParams.set(key, incoming.get(key));
Object.entries({ ...cfg.ESSENTIAL_AFFILIATE_PARAMS, pl: new URL(cfg.OFFERS[2].url).searchParams.get("pl") }).forEach(([k,v]) => sample.searchParams.set(k,v));
check(sample.searchParams.get("utm_source") === "facebook" && sample.searchParams.get("fbclid") === "abc123", "UTMs e fbclid são propagados");
check(sample.searchParams.get("af") === "afidn9137l" && sample.searchParams.get("pl") === "plag1ngm", "Parâmetros essenciais não são sobrescritos por entrada externa");

const forbidden = [
  ["aprovado pela ", "anvisa"].join(""), ["aprovado pela ", "fda"].join(""),
  ["regenera os ", "nervos"].join(""), ["cura ", "garantida"].join(""),
  ["reversão da ", "neuropatia"].join(""), ["abandone seus ", "medicamentos"].join(""),
  ["estoque ", "acabando"].join(""), ["últimas ", "unidades"].join("")
];
for (const phrase of forbidden) check(!content.includes(phrase), `Ausência da alegação/urgência indevida: ${phrase}`);

const internalLinks = [...index.matchAll(/(?:href|src)="(?!https?:|#|mailto:)([^"?]+)"/g)].map(m => m[1]);
for (const target of internalLinks) check(fs.existsSync(path.join(root, target)), `Recurso interno existe: ${target}`);
check(index.includes('width="768" height="768"') && index.includes('fetchpriority="high"'), "Imagem principal tem dimensões e prioridade declaradas");
check(index.includes('id="cookie-banner"') && index.includes('id="reject-cookies"') && index.includes('id="review-cookies"'), "Consentimento permite aceitar, recusar e rever");
check(headers.includes("Content-Security-Policy") && headers.includes("X-Content-Type-Options"), "Cabeçalhos de segurança configurados");
check(!headers.includes("'unsafe-inline'") && headers.includes("script-src 'self' https://connect.facebook.net"), "CSP permite o script externo da Meta sem unsafe-inline");
check(headers.includes("img-src 'self' data: https://www.facebook.com") && headers.includes("connect-src 'self' https://www.facebook.com https://connect.facebook.net"), "CSP permite beacon e conexões necessárias do Meta Pixel");

console.log(`PASS: ${pass.length}`);
pass.forEach(item => console.log(`  ✓ ${item}`));
if (fail.length) {
  console.error(`FAIL: ${fail.length}`);
  fail.forEach(item => console.error(`  ✗ ${item}`));
  process.exitCode = 1;
} else console.log("FAIL: 0");
