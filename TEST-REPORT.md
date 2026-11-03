# Relatório de otimização e testes — Nuvessa

Data: 3 de novembro de 2026

Base utilizada: branch `main`, commit `aee28331697532cabdad1a560724512ab78666d8`

Produção alterada: **não**

Commit, push, merge ou deploy executado: **não**

## Melhorias realizadas

- Primeira tela reescrita para apresentar claramente o NervoCure Max, os kits e o acesso à compra pela Braip.
- CTA principal alterado para **Ver kits e preços**.
- Kits de 1, 3 e 5 caixas movidos para logo após a apresentação inicial.
- Kits de 8 e 12 caixas mantidos em seção expansível.
- Destaque do kit de 5 caixas preservado sem a alegação não verificada “Mais escolhido”.
- Quatro depoimentos preservados e movidos para depois das ofertas.
- Todos os depoimentos receberam miniatura própria e `preload="none"`.
- No celular, os depoimentos agora usam rolagem horizontal para reduzir a extensão da página.
- Aviso de cookies reduzido, mantendo aceitar, recusar e rever a decisão.
- Meta Pixel e UTMify continuam condicionados ao consentimento.
- Links Braip, valores, quantidades, brindes, UTMs e `fbclid` foram preservados.
- Domínio de SEO corrigido para `https://nuvessasaude.com.br` em canonical, Open Graph, sitemap e robots.
- Imagens dos kits convertidas para WebP; os PNGs originais permanecem no código-fonte como backup.
- Build público passou a excluir backups e recursos não utilizados.

## Comparação da experiência

| Área | Versão anterior | Versão otimizada |
|---|---|---|
| Primeira tela | Texto genérico e CTA principal para depoimentos | Produto nomeado, informações comerciais e CTA direto para kits |
| Ordem da página | Depoimentos antes das ofertas | Kits antes dos depoimentos |
| Kits no celular | Kit destacado podia mudar de posição | Ordem clara: 1, 3 e 5 caixas |
| Depoimentos | Grade longa antes da compra | Grade após ofertas e carrossel horizontal no celular |
| Vídeos | Parte deles podia carregar metadados sem interação | Todos usam miniaturas e `preload="none"` |
| Cookies | Painel mais largo e botões empilhados no celular | Painel compacto com duas escolhas lado a lado |
| SEO | Referências residuais ao domínio antigo | Domínio real aplicado de forma consistente |

## Resultados automatizados

Comando executado:

```bash
npm test
```

Resultados:

- Auditoria funcional e de segurança: **88 PASS / 0 FAIL**.
- Auditoria do build: **31 PASS / 0 FAIL**.
- Build da Cloudflare: **concluído**.
- Tamanho do diretório público: **2,43 MB**.
- Recursos principais servidos localmente: **HTTP 200**.
- Sintaxe dos arquivos JavaScript: **válida**.
- `git diff --check`: **sem erros**.

Cobertura dos testes:

- cinco kits e links correspondentes;
- valores, parcelamento, quantidades e brindes preservados;
- UTMs e `fbclid` propagados aos botões;
- parâmetros `pl`, `ck` e `af` protegidos nos links legados;
- Pixel `1144579295213270` único;
- `PageView` único após consentimento;
- nenhum evento `Purchase` criado;
- Pixel e UTMify ausentes antes do consentimento;
- aceitar, recusar e rever cookies;
- CSP sem `unsafe-inline` e com permissões da Meta e UTMify;
- ausência aparente de tokens privados no frontend;
- miniaturas e recursos internos presentes;
- vídeos integrais mantidos no R2 e não duplicados no build;
- imagens WebP presentes e abaixo de 250 KB.

## Desempenho

- Conjunto das quatro imagens de kits usado na página: **7,08 MB → 0,42 MB**.
- Redução aproximada desse conjunto: **94,1%**.
- Os vídeos de depoimento continuam no Cloudflare R2 e só são solicitados após interação.
- O vídeo demonstrativo local permanece com `preload="none"`.

## Validações que dependem da produção

- Recebimento real de eventos nos painéis da Meta, UTMify e Braip.
- Evento `InitiateCheckout` enviado pela Braip após o redirecionamento.
- Reprodução dos vídeos pelo domínio público do R2 na rede do visitante.
- Aplicação efetiva dos cabeçalhos `_headers` pela Cloudflare.
- Preços, formas de pagamento, garantia e prazos exibidos pelo checkout no dia da compra.
- Comparação visual por captura real de navegador. O navegador de QA disponível não conseguiu acessar o domínio publicado e a instalação local de Chromium foi bloqueada; por isso a comparação visual foi feita pela estrutura HTML/CSS e pelos testes de responsividade, sem capturas.

## Publicação manual

1. Faça um backup da versão atual do repositório.
2. Extraia o ZIP em uma pasta vazia.
3. Copie todo o conteúdo extraído para a raiz do repositório local, substituindo os arquivos existentes.
4. Não copie uma pasta externa adicional: `index.html`, `package.json`, `wrangler.jsonc`, `_headers`, `assets`, `css` e `js` devem ficar na raiz.
5. Revise as alterações no GitHub Desktop ou VS Code.
6. Faça commit e push para a branch `main` somente quando decidir publicar.
7. Aguarde o deploy da Cloudflare concluir com sucesso.
8. Em aba anônima, teste recusa e aceite de cookies, os cinco kits, os vídeos e uma URL com UTMs.
9. Confira Meta Events Manager, UTMify e Braip após o deploy.

## Pendências de conteúdo

- Composição, quantidades, modo de uso e regularidade regulatória continuam sem alegações porque não foram formalmente verificadas.
- O cadastro empresarial informado não foi validado e nenhum CNPJ foi inventado.
- Os depoimentos são materiais do produtor e continuam recomendados para revisão jurídica.
