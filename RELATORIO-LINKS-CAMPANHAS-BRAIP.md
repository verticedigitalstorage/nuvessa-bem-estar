# Relatório de atualização — campanhas Braip

Data da validação: 2 de novembro de 2026

## Ofertas públicas

| Kit | Link anterior | Nova campanha | Redirecionamento observado |
|---|---|---|---|
| 1 caixa | `https://pay.braip.co/ref?pl=plaxw84g&ck=cherq188&af=afidn9137l` | `https://ev.braip.com/campanhas/cpa/camm7lxep` | `plaxw84g`, `ck=cherq188`, `af=afidn9137l` |
| 3 caixas + massageador | `https://pay.braip.co/ref?pl=pla2nd6z&ck=cherq188&af=afidn9137l` | `https://ev.braip.com/campanhas/cpa/cam91zo6o` | `pla2nd6z`, `ck=cherq188`, `af=afidn9137l` |
| 5 caixas + massageador | `https://pay.braip.co/ref?pl=plag1ngm&ck=cherq188&af=afidn9137l` | `https://ev.braip.com/campanhas/cpa/camgmdlrp` | `plag1ngm`, `ck=cherq188`, `af=afidn9137l` |
| 8 caixas + massageador | `https://pay.braip.co/ref?pl=plagmprj&ck=cherq188&af=afidn9137l` | `https://ev.braip.com/campanhas/cpa/came0o5pl` | `plagmprj`, `ck=cherq188`, `af=afidn9137l` |
| 12 caixas + massageador | `https://pay.braip.co/ref?pl=plao4jzx&ck=cherq188&af=afidn9137l` | `https://ev.braip.com/campanhas/cpa/cam0m268k` | `plao4jzx`, `ck=cherq188`, `af=afidn9137l` |

## Ofertas já existentes, mas ocultas

`SHOW_SPECIAL_OFFERS` continua `false`; nenhum card novo foi criado.

| Oferta | Situação | Destino atual |
|---|---|---|
| 2 caixas | Sem campanha correspondente fornecida; link anterior preservado | `https://pay.braip.co/ref?pl=plaq4e6r&ck=cherq188&af=afidn9137l` |
| 4 caixas | Atualizada para campanha fornecida | `https://ev.braip.com/campanhas/cpa/camk75dgr` |
| 6 caixas | Atualizada para campanha fornecida | `https://ev.braip.com/campanhas/cpa/cam182xmv` |
| Plano mensal de 1 caixa | Sem campanha correspondente fornecida; link anterior preservado | `https://pay.braip.co/ref?pl=pla1lwn6&ck=cherq188&af=afidn9137l` |

## Validação técnica

- As sete campanhas responderam com HTTP 200 após o redirecionamento.
- Cada campanha redirecionou para o `pl` correspondente ao kit, com `ck=cherq188` e `af=afidn9137l` visíveis na URL final observada.
- A campanha de 5 caixas foi testada com `utm_source`, `utm_campaign` e `fbclid`; os três parâmetros chegaram ao checkout final.
- O site acrescenta apenas os parâmetros permitidos de campanha às novas URLs. Ele não injeta manualmente `pl`, `ck` ou `af` nas URLs `/campanhas/cpa/`.
- Os links legados de 2 caixas e mensal continuam protegidos contra substituição de `pl`, `ck` e `af` por parâmetros externos.
- Os preços, quantidades, brindes, imagens, layout e textos não foram alterados.
- O Meta Pixel `1144579295213270`, o `PageView` condicionado ao consentimento e a CSP foram preservados.
- Nenhum evento `InitiateCheckout` ou `Purchase` foi adicionado ao site.

## Limitações

O redirecionamento observado demonstra que o identificador `afidn9137l` chega ao checkout. Isso não comprova contabilmente o crédito de comissão nem confirma o recebimento de `InitiateCheckout` ou `Purchase` pela Meta. Essas confirmações exigem teste real na Braip, acompanhamento no painel de afiliado e validação no Gerenciador de Eventos.
