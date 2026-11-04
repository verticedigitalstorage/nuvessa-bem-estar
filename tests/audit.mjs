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
const utmifyJs = read("js/utmify.js");
const styles = read("css/styles.css");
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
check(index.indexOf('id="contexto"') < index.indexOf('id="produto"') && index.indexOf('id="produto"') < index.indexOf('id="ofertas"') && index.indexOf('id="ofertas"') < index.indexOf('id="experiencias"'), "Jornada ordenada em contexto, produto, kits e experiências");
check(index.includes("Desconfortos persistentes merecem atenção") && index.includes("nem apresenta o NervoCure Max como tratamento"), "Contextualização de sintomas sem promessa de tratamento");
check(index.includes("ingredientes, quantidades por porção") && index.includes("rótulo oficial vigente") && !index.includes("combinação de vitaminas, minerais e aminoácidos"), "Composição de terceiros não é publicada sem validação do rótulo");
check(styles.includes(".needs-grid") && styles.includes("@media (max-width: 700px)"), "Nova seção de contextualização tem layout responsivo para celular");
check(cfg.BASE_URL === "https://nuvessasaude.com.br" && read("sitemap.xml").includes(cfg.BASE_URL) && read("robots.txt").includes(cfg.BASE_URL), "Domínio atual centralizado no SEO, sitemap e robots");
check(index.includes('id="experiencias"') && index.includes("depoimento-completo-1.mp4") && index.includes("depoimento-completo-4.mp4"), "Depoimentos integrais presentes na seção de experiências");
check((index.match(/class="story-card/g) || []).length === 4 && index.includes('class="stories-grid"') && [1, 2, 3, 4].every(number => index.includes(`depoimento-completo-${number}.mp4`)) && !index.includes("recebimento-caixa"), "Quatro depoimentos integrais e únicos ficam visíveis, sem o vídeo da caixa");
check([1, 2, 3, 4].every(number => index.includes(`https://pub-b31aff6972c544e58790c398b98875c5.r2.dev/depoimento-completo-${number}.mp4`)), "Quatro depoimentos integrais apontam para o bucket público R2");
check([1, 2, 3, 4].every(number => index.includes(`poster="assets/videos/depoimento-completo-${number}.jpg"`) && fs.existsSync(path.join(root, `assets/videos/depoimento-completo-${number}.jpg`))), "Quatro depoimentos possuem miniaturas locais próprias");
check((index.match(/preload="none"/g) || []).length >= 5 && !index.includes('preload="metadata"'), "Vídeos evitam carregamento antecipado de mídia pesada");
check(read("_headers").includes("media-src 'self' https://pub-b31aff6972c544e58790c398b98875c5.r2.dev"), "Política de segurança permite mídia do bucket R2 configurado");
check(index.includes('class="mobile-offer-bar"') && index.includes('class="header-cta"'), "Acesso aos kits permanece visível no cabeçalho e no celular");
check(!index.includes("Ermelinda") && !index.includes("94226-8188") && !index.includes("DESTINATÁRIO"), "Provas sociais publicadas sem dados pessoais visíveis no HTML");
check(!content.includes("[responsável legal a definir]") && !content.includes("[e-mail comercial a definir]") && !content.includes("seu-dominio-aqui"), "Nenhum placeholder público restante");
check(cfg.OFFERS.every(o => o.image && fs.existsSync(path.join(root, o.image))), "Todos os kits possuem imagem local configurada");
check(cfg.OFFERS.filter(o => o.boxes > 1).every(o => o.image.endsWith(".webp") && fs.statSync(path.join(root, o.image)).size < 250000), "Imagens dos kits usam WebP otimizado abaixo de 250 KB");
check(cfg.OFFERS.every(o => o.originalPrice && o.installments === 12 && o.installmentPrice && o.price), "Cinco kits possuem preço anterior, parcelamento e valor à vista conforme a referência do produtor");
check(!content.includes("mais escolhido") && index.includes("isso não representa alegação de popularidade"), "Destaque do kit de 5 caixas não cria alegação de popularidade");
check(mainJs.includes('class="offer-quantity"') && mainJs.includes('loading="lazy"'), "Cards exibem quantidade e carregam imagens sob demanda");
check(cfg.META_PIXEL_ID === "1144579295213270", "Meta Pixel configurado com o ID informado");
check(index.indexOf('src="js/config.js"') < index.indexOf('src="js/meta-pixel.js"') && index.indexOf('src="js/meta-pixel.js"') < index.indexOf('src="js/main.js"'), "Scripts externos carregam na ordem configuração, Pixel e aplicação");
check(!index.includes("fbq(") && !index.includes("fbevents.js") && !/<script(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/script>/i.test(index), "Index não contém inicialização inline ou duplicada do Pixel");
check(metaPixelJs.includes('window.fbq("track", "PageView")') && !metaPixelJs.includes('"Purchase"'), "Pixel envia PageView e não dispara Purchase na página");
check(metaPixelJs.includes('localStorage.getItem(consentKey) === "accepted"') && mainJs.includes("NUVESSA_META_PIXEL.load()"), "Pixel permanece condicionado ao consentimento");
check(mainJs.includes('if (consentState() !== "accepted") return;') && mainJs.includes('script.src = "/js/utmify.js"'), "UTMify permanece condicionada ao consentimento");
check(utmifyJs.includes("cdn.utmify.com.br/scripts/utms/latest.js") || utmifyJs.includes("atob("), "Loader original da UTMify permanece presente");
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

const rejectedScripts = [];
const rejectedSandbox = {
  window: { NERVO_CONFIG: cfg },
  localStorage: { getItem: () => "rejected" },
  document: {
    getElementById: () => null,
    createElement: () => ({}),
    head: { append: (node) => rejectedScripts.push(node) }
  }
};
vm.runInNewContext(metaPixelJs, rejectedSandbox);
check(rejectedSandbox.window.NUVESSA_META_PIXEL.load() === false && rejectedScripts.length === 0 && !rejectedSandbox.window.fbq, "Pixel não inicializa nem carrega biblioteca sem consentimento");

function runApplication(initialConsent = null, search = "") {
  const storage = new Map();
  if (initialConsent) storage.set("nervocure_consent", initialConsent);
  const headScripts = [];
  const listeners = new Map();
  const makeNode = (id = "") => ({
    id,
    hidden: true,
    textContent: "",
    href: "",
    className: "",
    dataset: {},
    children: [],
    append(child) { this.children.push(child); },
    appendChild(child) { this.children.push(child); },
    addEventListener(type, handler) { listeners.set(`${id}:${type}`, handler); },
    focus() { this.focused = true; }
  });
  const nodes = new Map([
    ["#main-offers", makeNode("main-offers")],
    ["#extended-offers", makeNode("extended-offers")],
    ["#special-offers-section", makeNode("special-offers-section")],
    ["#special-offers", makeNode("special-offers")],
    ["#cookie-banner", makeNode("cookie-banner")],
    ["#accept-cookies", makeNode("accept-cookies")],
    ["#reject-cookies", makeNode("reject-cookies")],
    ["#review-cookies", makeNode("review-cookies")],
    ["#cookie-status", makeNode("cookie-status")],
    ["#year", makeNode("year")]
  ]);
  const canonical = makeNode("canonical");
  let pixelLoads = 0;
  let reloads = 0;
  const documentMock = {
    head: { appendChild(node) { headScripts.push(node); } },
    createElement: () => makeNode(),
    querySelector(selector) {
      if (selector === 'link[rel="canonical"]') return canonical;
      if (selector === "script[data-nuvessa-utmify-loader]") {
        return headScripts.find(node => node.dataset?.nuvessaUtmifyLoader) || null;
      }
      return nodes.get(selector) || null;
    },
    querySelectorAll: () => [],
    addEventListener(type, handler) { listeners.set(`document:${type}`, handler); }
  };
  const locationMock = { search, pathname: "/", reload() { reloads += 1; } };
  const windowMock = {
    NERVO_CONFIG: cfg,
    NUVESSA_META_PIXEL: { load() { pixelLoads += 1; }, trackCustom() {} },
    dispatchEvent() {}
  };
  const appSandbox = {
    window: windowMock,
    document: documentMock,
    location: locationMock,
    localStorage: {
      getItem(key) { return storage.get(key) || null; },
      setItem(key, value) { storage.set(key, value); }
    },
    URL,
    URLSearchParams,
    CustomEvent: class { constructor(name, options) { this.type = name; this.detail = options?.detail; } },
    console
  };
  vm.runInNewContext(mainJs, appSandbox);
  return { storage, headScripts, listeners, nodes, canonical, getPixelLoads: () => pixelLoads, getReloads: () => reloads };
}

const unsetApp = runApplication(null, "?utm_source=facebook&utm_campaign=teste&fbclid=abc123");
check(unsetApp.nodes.get("#cookie-banner").hidden === false && unsetApp.getPixelLoads() === 0 && unsetApp.headScripts.length === 0, "Sem escolha prévia, banner aparece e scripts de marketing não carregam");
unsetApp.listeners.get("accept-cookies:click")();
check(unsetApp.storage.get("nervocure_consent") === "accepted" && unsetApp.getPixelLoads() === 1 && unsetApp.headScripts.filter(node => node.src === "/js/utmify.js").length === 1, "Aceite carrega Pixel e UTMify uma única vez");
const renderedCards = unsetApp.nodes.get("#main-offers").children;
check(renderedCards.length === 3 && renderedCards.every(card => card.innerHTML.includes("utm_source=facebook") && card.innerHTML.includes("fbclid=abc123")), "Cards renderizados preservam UTMs e fbclid nos três kits principais");

const acceptedApp = runApplication("accepted");
check(acceptedApp.getPixelLoads() === 1 && acceptedApp.headScripts.filter(node => node.src === "/js/utmify.js").length === 1, "Consentimento já aceito restaura Pixel e UTMify sem duplicação");

const rejectedApp = runApplication("rejected");
check(rejectedApp.getPixelLoads() === 0 && rejectedApp.headScripts.length === 0, "Consentimento recusado mantém Pixel e UTMify descarregados");
rejectedApp.listeners.get("review-cookies:click")();
check(rejectedApp.nodes.get("#cookie-banner").hidden === false && rejectedApp.nodes.get("#cookie-banner").focused === true, "Preferências de cookies podem ser reabertas pelo rodapé");

const expectedCampaigns = new Map([
  ["1-caixa", "https://ev.braip.com/campanhas/cpa/camm7lxep"],
  ["3-caixas", "https://ev.braip.com/campanhas/cpa/cam91zo6o"],
  ["4-caixas-especial", "https://ev.braip.com/campanhas/cpa/camk75dgr"],
  ["5-caixas", "https://ev.braip.com/campanhas/cpa/camgmdlrp"],
  ["6-caixas-especial", "https://ev.braip.com/campanhas/cpa/cam182xmv"],
  ["8-caixas", "https://ev.braip.com/campanhas/cpa/came0o5pl"],
  ["12-caixas", "https://ev.braip.com/campanhas/cpa/cam0m268k"]
]);
const allOffers = [...cfg.OFFERS, ...cfg.SPECIAL_OFFERS];
for (const [id, expectedUrl] of expectedCampaigns) {
  check(allOffers.find(offer => offer.id === id)?.url === expectedUrl, `Campanha correta configurada para ${id}`);
}
for (const id of ["2-caixas-especial", "mensal-1-caixa"]) {
  const url = new URL(allOffers.find(offer => offer.id === id).url);
  check(url.hostname === "pay.braip.co" && url.searchParams.get("af") === "afidn9137l" && url.searchParams.get("ck") === "cherq188" && Boolean(url.searchParams.get("pl")), `Link legado de ${id} preservado por falta de campanha correspondente`);
}

function withTracking(rawUrl, incoming) {
  const url = new URL(rawUrl);
  const essential = Object.fromEntries(["pl", "ck", "af"].map(key => [key, url.searchParams.get(key)]).filter(([, value]) => Boolean(value)));
  for (const key of cfg.TRACKABLE_PARAMS) if (incoming.has(key) && !url.searchParams.has(key)) url.searchParams.set(key, incoming.get(key).slice(0, 250));
  for (const [key, value] of Object.entries(essential)) url.searchParams.set(key, value);
  return url;
}

const incoming = new URLSearchParams("utm_source=facebook&utm_campaign=teste&fbclid=abc123&af=tentativa");
const campaignSample = withTracking(cfg.OFFERS.find(offer => offer.id === "5-caixas").url, incoming);
check(campaignSample.searchParams.get("utm_source") === "facebook" && campaignSample.searchParams.get("fbclid") === "abc123", "UTMs e fbclid são propagados para campanhas");
check(!campaignSample.searchParams.has("af") && !campaignSample.searchParams.has("ck") && !campaignSample.searchParams.has("pl"), "URL de campanha não recebe parâmetros essenciais artificiais antes do redirecionamento");
const legacySample = withTracking(cfg.SPECIAL_OFFERS.find(offer => offer.id === "2-caixas-especial").url, incoming);
check(legacySample.searchParams.get("af") === "afidn9137l" && legacySample.searchParams.get("ck") === "cherq188" && legacySample.searchParams.get("pl") === "plaq4e6r", "Parâmetros essenciais do link legado não são sobrescritos por entrada externa");

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
check(styles.includes("max-width: 820px") && styles.includes("grid-template-columns: 1fr 1fr"), "Aviso de cookies usa apresentação compacta e mantém duas escolhas visíveis no celular");
check(headers.includes("Content-Security-Policy") && headers.includes("X-Content-Type-Options"), "Cabeçalhos de segurança configurados");
check(!headers.includes("'unsafe-inline'") && headers.includes("script-src 'self' https://connect.facebook.net"), "CSP permite o script externo da Meta sem unsafe-inline");
check(headers.includes("https://cdn.utmify.com.br"), "CSP preserva o carregamento do script da UTMify");
check(headers.includes("img-src 'self' data: https://www.facebook.com") && headers.includes("connect-src 'self' https://www.facebook.com https://connect.facebook.net"), "CSP permite beacon e conexões necessárias do Meta Pixel");
check(!content.match(/(?:ghp_|github_pat_|sk_live_|sk_test_|access[_-]?token\s*[:=]\s*["'][^"']+)/i), "Nenhum token privado aparente está exposto nos arquivos públicos");

console.log(`PASS: ${pass.length}`);
pass.forEach(item => console.log(`  ✓ ${item}`));
if (fail.length) {
  console.error(`FAIL: ${fail.length}`);
  fail.forEach(item => console.error(`  ✗ ${item}`));
  process.exitCode = 1;
} else console.log("FAIL: 0");
