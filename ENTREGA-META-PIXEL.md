# Entrega completa — correção do Meta Pixel

Data: 30 de outubro de 2026

## Configuração final

- Pixel: `1144579295213270`
- Evento de visita: `PageView`
- Evento de compra: não configurado nesta página
- Consentimento: obrigatório antes do carregamento da Meta
- API de Conversões: nenhum token ou credencial no front-end
- Inicialização inline: nenhuma
- `unsafe-inline`: não utilizado

## Arquivos alterados

- `js/config.js`: recebeu o ID do Pixel.
- `js/meta-pixel.js`: novo inicializador externo, com consentimento e proteção contra duplicação.
- `js/main.js`: passou a delegar carregamento e eventos personalizados ao módulo externo.
- `index.html`: carrega o módulo externo na ordem correta e atualiza o texto do consentimento.
- `privacidade.html`: documenta o funcionamento atual do marketing.
- `tests/audit.mjs`: valida ID, CSP, consentimento, `PageView`, duplicidade e ausência de `Purchase`.
- `build.ps1`: usa o mesmo build seguro de `build.mjs`.
- `README.md` e `TEST-REPORT.md`: documentação e resultados atualizados.

## Arquivo de segurança validado

`_headers` mantém a CSP e autoriza somente os recursos necessários da Meta:

- `script-src`: `https://connect.facebook.net`
- `connect-src`: `https://www.facebook.com` e `https://connect.facebook.net`
- `img-src`: `https://www.facebook.com`

A política não contém `unsafe-inline` e não foi removida.

## Testes realizados

- Sintaxe dos arquivos JavaScript e do build: PASS.
- Auditoria automatizada: 71 PASS / 0 FAIL.
- Build completo em `dist/`: PASS.
- Arquivos publicáveis acima de 25 MiB: nenhum.
- Cinco checkouts públicos da Braip: parâmetros `pl`, `ck=cherq188` e `af=afidn9137l` preservados.
- UTMs e `fbclid`: propagação preservada.
- Navegador sem consentimento: nenhum script da Meta.
- Navegador após recusa: nenhum script da Meta e nenhum erro de console.
- Navegador após aceite: biblioteca/configuração oficial do Pixel carregada, sem erro de CSP.
- Simulação do Pixel: um `init` e um `PageView`, mesmo chamando o carregador duas vezes.
- Busca por `Purchase`: nenhuma configuração ou disparo encontrado.

## Validação que depende da publicação

Após substituir os arquivos no GitHub e a Cloudflare concluir o novo deploy:

1. Abra o site em janela anônima.
2. Aceite os cookies opcionais.
3. Use o Meta Pixel Helper ou “Testar eventos” no Gerenciador de Eventos.
4. Confirme o Pixel `1144579295213270` e o evento `PageView`.

Se o visitante recusar cookies, o `PageView` não será enviado por decisão de privacidade. O fallback tradicional `<noscript>` foi omitido porque enviaria rastreamento sem possibilidade de consentimento quando o JavaScript estivesse desativado.

## Substituição manual no GitHub

1. Extraia o ZIP em uma pasta vazia.
2. Abra o repositório atual no GitHub.
3. Substitua os arquivos da raiz pelos arquivos extraídos; não envie a pasta externa que contém o projeto.
4. Confirme que `index.html`, `_headers`, `package.json`, `assets`, `css`, `js` e `tests` aparecem diretamente na raiz.
5. Não envie `node_modules`, `dist`, `.wrangler`, `.env` ou os MP4 integrais do backup local.
6. Faça o commit manualmente e acompanhe o build da Cloudflare.
