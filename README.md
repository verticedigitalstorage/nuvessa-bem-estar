# Nuvessa Bem-Estar

Loja estática, mobile-first e sem dependências para apresentar o catálogo da Nuvessa Bem-Estar. A primeira vitrine apresenta o NervoCure Max e conclui a compra em ambiente externo seguro.

## Publicação rápida

### GitHub + Cloudflare Pages (recomendado)

1. Extraia `nervocuremax-github-completo.zip` em uma pasta.
2. Crie o repositório `nervocuremax-landing-afiliado` no GitHub e envie o conteúdo extraído. `index.html`, `build.mjs`, `assets`, `css` e `js` devem ficar na raiz do repositório. Não envie apenas o ZIP.
3. No Cloudflare Pages, crie um projeto conectado a esse repositório e selecione a branch `main`.
4. Framework: `None`. Comando de build: `npm run build`. Comando de deploy: `npx wrangler deploy`. Diretório raiz: deixe vazio (raiz do repositório). O arquivo `wrangler.jsonc` limita a publicação à pasta `dist/`.
5. Publique e abra a URL `pages.dev` informada pelo Cloudflare. Atualizações enviadas à branch conectada geram novas publicações.
6. Para usar `nuvessabemestar.com.br`, registre o domínio e adicione-o como domínio personalizado no projeto Pages, seguindo as instruções de DNS.

O build usa Node.js e funciona no ambiente Linux do Cloudflare. O Wrangler é instalado pelas dependências do projeto. `build.ps1` é uma alternativa apenas para uso local no Windows.

### Cloudflare Pages por upload direto

Use `nervocuremax-cloudflare-publicar.zip`, que contém somente os arquivos públicos, com `index.html` na raiz. Envie esse ZIP na opção de upload de arquivos do Cloudflare Pages. Se a interface solicitar uma pasta, extraia o ZIP e selecione a pasta extraída. Não há comando de build nesse modo.

O nome e o e-mail já estão preenchidos. O domínio configurado é `https://nuvessabemestar.com.br`. Se usar outro endereço definitivo, ajuste `BASE_URL` em `js/config.js` e as URLs em `index.html`, `robots.txt` e `sitemap.xml`. Meta Pixel vazio é intencional.

### Publicação pelo terminal com Wrangler

Na pasta do projeto, execute:

```powershell
npm ci
npm run cf:login
npm run deploy
```

O login abre a autorização da sua conta Cloudflare. O arquivo `wrangler.jsonc` define o projeto `nuvessa-bem-estar` e publica somente `dist/`, evitando o envio de `node_modules` e dos arquivos-fonte como assets públicos.

O Wrangler é uma dependência local de desenvolvimento; não é carregado pelos visitantes. Envie `package.json` e `package-lock.json` ao GitHub; nunca envie `node_modules`, `.wrangler` ou credenciais. O upload pelo painel e a integração do Pages com GitHub continuam disponíveis sem login local.

### GitHub Pages (opcional)

Como o site não depende de servidor, o conteúdo de `dist/` também pode ser publicado no GitHub Pages. Para Cloudflare, mantenha `_headers` na raiz do diretório publicado.

## Configuração centralizada

Edite apenas `js/config.js` para alterar:

- `BUSINESS_NAME`: nome da loja (`Nuvessa Bem-Estar`);
- `LEGAL_RESPONSIBLE`: NUVESSA BEM ESTAR LTDA;
- `COMMERCIAL_EMAIL`: `nuvessabemestar@gmail.com`;
- `BASE_URL`: preparado para `https://nuvessabemestar.com.br`;
- `META_PIXEL_ID`: ID futuro do Meta Pixel;
- `GUARANTEE_DAYS`: configurado em `90`, conforme a página atual do produtor verificada em 29/10/2026;
- `SHOW_SPECIAL_OFFERS`: altere para `true` somente após confirmar as condições das ofertas ocultas;
- `OFFERS` e `SPECIAL_OFFERS`: links, valores e disponibilidade.

Com `META_PIXEL_ID: ""`, nenhum script da Meta é carregado. Mesmo após inserir um ID, o Pixel só é iniciado depois do consentimento para cookies opcionais.

## Testes

Execute:

```powershell
node .\tests\audit.mjs
powershell -ExecutionPolicy Bypass -File .\build.ps1
```

O teste automatizado verifica ofertas, destaque, garantia, links Braip, afiliado, propagação de UTMs, alegações indevidas, recursos internos, consentimento e cabeçalhos de segurança.

## Materiais utilizados

Apresentação `assets/videos/apresentacao-embalagem.mp4` e capa `.jpg`: origem `Remarketing Nervocuremax.mp4`, Drive `1OuFJz6ty_FC70986dSJJ2tQ3OzgNfzb1`. Recorte da metade direita abaixo das faixas promocionais (510 × 640), excluindo etiquetas de envio da metade esquerda. Áudio removido; vídeo H.264 a 30 fps, sem autoplay e com preload desativado. Capa extraída aos 13 segundos. Exibido após a apresentação textual e antes dos feedbacks.

Vídeo `assets/videos/recebimento-caixa.mp4`: trecho de 0 a 2,5 segundos de `WhatsApp Video 2026-02-23 at 14.29.56.mp4`, arquivo Drive `1v9_aNFWMUWhrzjb3U3Anq7atzREDYuh4`, pasta DEPOIMENTOS. Recorte superior para excluir papéis de fundo, áudio removido e trecho com etiqueta excluído. `recebimento-caixa.jpg` é um quadro do mesmo vídeo. Reprodução manual, sem carregamento antecipado. O segundo vídeo (`depoimento nervo.mp4`) foi excluído por mostrar apenas etiqueta com dados pessoais.

Depoimentos `assets/videos/depoimento-recomendacao.mp4` e `depoimento-agradecimento.mp4`: trechos neutros dos arquivos `DEPOIMENTO 2.mp4` (Drive `1dNNTi01iXP6RNLKue9YX8r5B5KgkSVYG`) e `depoimento 4.mp4` (Drive `1yAmYmVzdAV0uU7AK2xg-RD0YuDBXut6i`), localizados em `SITES JSON / ESTRUTURA PROPRIA > Angulo Nervos/dores > Depoimentos video`. Foram mantidas apenas uma recomendação geral e uma mensagem de agradecimento. Partes com alegações terapêuticas, promessa de resultado ou abandono de medicamentos não foram publicadas. Vídeos convertidos para H.264, com reprodução manual e capas locais.

Identificação empresarial alterada para `NUVESSA BEM ESTAR LTDA` conforme informado pelo proprietário; cadastro empresarial não verificado e nenhum CNPJ adicionado.

| Arquivo local | Uso | Origem |
|---|---|---|
| `assets/images/frasco-oficial-02.webp` | Imagem principal do produto | Pasta pública “💊 FRASCOS PNG” no Drive principal fornecido pelo afiliado: `1gtRBG5jJjgROlyhknQoVGPDKDO4LZ3GR` |
| `assets/images/kit-source-02.jpeg` | Foto autorizada na vitrine do kit de 8 caixas | Pasta pública “💊 FRASCOS PNG” no mesmo Drive principal |
| `assets/images/kit-source-03.jpeg` | Foto autorizada na vitrine do kit de 12 caixas | Pasta pública “💊 FRASCOS PNG” no mesmo Drive principal |
| `assets/images/kit-source-04.jpeg` | Foto autorizada na vitrine do kit de 1 caixa | Pasta pública “💊 FRASCOS PNG” no mesmo Drive principal |
| `assets/icons/favicon.svg` | Símbolo abstrato neutro | Criado para este projeto; não representa certificação médica |

Nenhuma imagem é carregada por hotlink. Os arquivos brutos que continham dados pessoais não fazem parte do pacote publicável.

## Pendências antes da publicação definitiva

- registrar e conectar `nuvessabemestar.com.br` à hospedagem;
- realizar pesquisa formal de disponibilidade da marca Nuvessa no INPI antes do registro;
- informar Meta Pixel ID, se for utilizado;
- revisar juridicamente o rótulo atual antes de eventual inclusão de composição, quantidades, advertências e modo de uso;
- fazer revisão jurídica final dos textos legais e das condições do produtor/Braip.

Composição, doses e posologia foram deliberadamente omitidas nesta versão até uma revisão regulatória do rótulo atual. A garantia de 90 dias foi conferida na página atual do produtor; a página não reproduz alegações terapêuticas, selos de autoridade, endossos, estudos ou prazos absolutos encontrados em materiais promocionais. Os depoimentos publicados foram limitados a trechos neutros.

## Estrutura

```text
index.html
privacidade.html
termos.html
aviso-legal.html
404.html
assets/
css/styles.css
js/config.js
js/main.js
tests/audit.mjs
_headers
robots.txt
sitemap.xml
build.ps1
dist/                 # gerado pelo build
```

## Observação de afiliação

Os links preservam `pl`, `ck=cherq188` e `af=afidn9137l`. A função de navegação acrescenta, quando presentes, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` e `fbclid`, sem aceitar que a visita sobrescreva os parâmetros essenciais.
