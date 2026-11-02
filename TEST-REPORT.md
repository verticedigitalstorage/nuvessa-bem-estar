# Relatório final de testes

Data: 2 de novembro de 2026

| Verificação | Resultado | Evidência |
|---|---:|---|
| Layout em 360 px | PASS | Sem rolagem horizontal; CTA e destaque legíveis |
| Layout em 390 px | PASS | Sem rolagem horizontal; cards em coluna |
| Layout em 768 px | PASS | Sem rolagem horizontal; hierarquia preservada |
| Layout desktop em 1440 px | PASS | Hero em duas colunas e ofertas equilibradas |
| Produto em destaque | PASS | Imagem oficial ocupa a maior área visual do hero no desktop e aparece primeiro no celular |
| Ordem da jornada | PASS | Produto → depoimentos → kits → garantia → informações e dúvidas |
| Identidade visual | PASS | Símbolo da marca no cabeçalho e nome Nuvessa Saúde & Bem-Estar em todas as páginas |
| Bloco genérico removido | PASS | “Compra segura”, “Informação clara” e “Escolha simples” não aparecem mais na primeira dobra |
| Kit de 5 caixas primeiro no celular | PASS | Ordem visual verificada em 360, 390 e 768 px |
| Kit de 5 caixas com maior destaque | PASS | Borda, selo e elevação exclusivos |
| Kits de 8 e 12 caixas acessíveis | PASS | Seção expansível testada no navegador |
| Ofertas de 2, 4, 6 caixas e mensal ocultas | PASS | `SHOW_SPECIAL_OFFERS: false`; ativação por uma configuração |
| Cinco links públicos corretos | PASS | Campanhas de 1, 3, 5, 8 e 12 caixas correspondem rigorosamente aos kits |
| Links especiais documentados | PASS | Campanhas de 4 e 6 atualizadas; 2 caixas e mensal preservados por falta de campanha correspondente |
| Redirecionamentos Braip | PASS | Sete campanhas retornaram HTTP 200 e chegaram ao `pl`, `ck` e `af=afidn9137l` esperados |
| Propagação de UTMs e `fbclid` | PASS | Campanha de 5 caixas manteve os parâmetros até o checkout final |
| Links renderizados no navegador | PASS | Os cinco botões públicos exibiram a campanha correta com UTMs e `fbclid`; 8 e 12 permaneceram na área expansível |
| Proteção dos parâmetros essenciais | PASS | Campanhas não recebem parâmetros artificiais; links legados não aceitam sobrescrita de `pl`, `ck` ou `af` |
| Garantia de 90 dias | PASS | Condição verificada na página atual do produtor; configuração, hero, selo, seção e FAQ coerentes |
| Imagens nos cinco kits | PASS | Cada card representa visualmente 1, 3, 5, 8 ou 12 embalagens; os quatro kits com brinde exibem o massageador e usam carregamento tardio |
| Condições promocionais | PASS | Preço anterior, 12 parcelas e valor à vista dos cinco kits conferidos na página de referência do produtor em 30/10/2026; checkout prevalece |
| Depoimentos em vídeo | PASS | Quatro arquivos integrais do último Drive carregados pelo Cloudflare R2 |
| Exibição dos depoimentos | PASS | Os quatro vídeos aparecem uma única vez; o antigo vídeo da caixa permanece removido |
| Redesign inspirado na referência | PASS | Hero comercial, acentos laranja, produto ampliado e prova social priorizada, sem copiar alegações ou identidade de terceiros |
| Navegação de conversão | PASS | Botão de kits no cabeçalho e barra fixa no celular levam diretamente às ofertas |
| Identificação e contato | PASS | Responsável legal e e-mail comercial exibidos nas páginas públicas e documentos legais |
| Domínio preparado | PASS | Canonical, configuração, Open Graph, sitemap e robots preparados para `nuvessabemestar.com.br` |
| Busca por referências antigas e alegações indevidas | PASS | Nenhuma ocorrência encontrada no código publicável |
| Consentimento de cookies | PASS | Aceitar, recusar e rever testados |
| Meta Pixel e consentimento | PASS | ID 1144579295213270 configurado; biblioteca, inicialização e PageView únicos após consentimento |
| Meta Pixel recusado | PASS | Em origem limpa, a recusa manteve zero scripts da Meta e zero erros no console |
| Meta Pixel aceito | PASS | Em origem limpa, aceitar carregou a biblioteca/configuração oficial do ID e ocultou o banner sem erro de CSP |
| CSP do Pixel | PASS | `script-src`, `connect-src` e `img-src` permitem somente os hosts necessários; sem `unsafe-inline` |
| Evento Purchase | PASS | Nenhuma ocorrência ou disparo de `Purchase` no front-end |
| Páginas legais | PASS | Privacidade, Termos e Aviso Legal retornaram HTTP 200 |
| Página 404 | PASS | Rota inexistente retornou HTTP 404 com página própria |
| Recursos internos | PASS | Imagem, CSS, JS, favicon e links internos encontrados |
| Console do navegador | PASS | Zero erros e zero avisos durante a QA |
| Auditoria equivalente a Lighthouse | PASS | HTML semântico, árvore acessível, foco, contraste, SEO, dimensões de imagem, preload, recursos locais, segurança e peso dos recursos revisados; CLI Lighthouse não estava disponível no ambiente |
| Build estático | PASS | Conteúdo gerado em `dist/` e servido localmente |

Auditoria automatizada: **72 PASS / 0 FAIL**.

## Limitações documentadas

- A composição e o modo de uso foram omitidos nesta versão até revisão regulatória do rótulo atual.
- Prazo de entrega absoluto não foi publicado.
- O domínio está preparado no código, mas ainda precisa ser registrado e conectado. O Meta Pixel usa arquivo externo e permanece bloqueado até consentimento.
- Esta atualização do Pixel foi preparada e testada localmente, mas não foi enviada ao GitHub nem publicada na Cloudflare, conforme solicitado. Os vídeos integrais permanecem no R2 e não são incluídos no pacote GitHub.
- O navegador local confirmou o carregamento da biblioteca oficial e da configuração do ID sem erro de CSP. A confirmação final no Gerenciador de Eventos/Meta Pixel Helper depende da publicação manual no domínio real e do consentimento do visitante.
- Os redirecionamentos exibiram `afidn9137l`, mas o crédito de comissão e os eventos de conversão da Braip não podem ser comprovados sem teste real nos respectivos painéis.
