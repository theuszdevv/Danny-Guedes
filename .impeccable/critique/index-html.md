---
target: "index.html"
slug: "index-html"
date: "2026-11-23T14:20:00-03:00"
method: "dual-agent (A: e486f3e4-8ee3-4aa8-bfd7-336af59edae6 · B: 1086b4ed-0678-413c-8674-8ca0fe624f82)"
total_score: 16
max_score: 32
na_heuristics: "7,10"
p0_count: 0
p1_count: 3
p2_count: 2
---

Method: dual-agent (A: e486f3e4-8ee3-4aa8-bfd7-336af59edae6 · B: 1086b4ed-0678-413c-8674-8ca0fe624f82)

### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2/4 | Filtros e calculadora atualizam o estado visual, mas clicar em `.nail-card__cta` preenche `#modelInput` sem sincronizar `#serviceSelect`; `#catalogSummaryBar` sem `aria-live` e fora da viewport no mobile. |
| 2 | Match System / Real World | 2/4 | Botão `#toggleFrameBtn` ("Modo Tela Cheia") no header; botões de foto rotulados como nomes de arquivo (`Foto 1`, `Foto 2`, `Pose Unhas`); watermarks em inglês; promessa de "Maquiadora" sem oferta no catálogo. |
| 3 | User Control and Freedom | 2/4 | `.main-nav` desaparece em `<= 880px` (`display: none`) sem menu mobile; calculadora sem botão "Limpar seleção" nem seletor de quantidade para "Reposição de Unha (un)". |
| 4 | Consistency and Standards | 2/4 | Dois fluxos de agendamento concorrentes e dessincronizados (`#catalogSummaryBar` vs. `#bookingForm`). |
| 5 | Error Prevention | 2/4 | Calculadora permite somar serviços mutuamente exclusivos simultaneamente; erro ortográfico em `"Acabamento Fino & Seguraça"`. |
| 6 | Recognition Rather Than Recall | 2/4 | `.nail-card__zoom` invisível (`opacity: 0`) em telas touch; falta explicação entre "Decoração em Gel +" e "Decoração à Parte +"; escolhas da tabela não vão para o formulário. |
| 7 | Flexibility and Efficiency | n/a | Superfície Persuade / Experience de agendamento ocasional. |
| 8 | Aesthetic and Minimalist Design | 3/4 | Paleta editorial forte e fotos reais valorizadas, mas 5 famílias do Google Fonts via `@import`, logo repetido 4 vezes e ruído do toggle de moldura. |
| 9 | Error Recovery | 1/4 | Clicar em `#bookSelectedCatalogBtn` com 0 itens falha silenciosamente e apenas rola a página. |
| 10 | Help and Documentation | n/a | Superfície Persuade / Experience. |
| **Total** | | **16/32** | **Acceptable (50%)** |

### Priority Issues

1. **[P1] Fluxos de agendamento duplicados, dessincronizados e sem regras de negócio entre `#catalogo`, `#portfolio` e `#agendar`** (`/impeccable shape`)
2. **[P1] Colapso da navegação mobile (`<= 880px`), botão técnico `"Modo Tela Cheia"` no header e rótulos de template** (`/impeccable adapt`)
3. **[P1] Promessa "Nail Designer & Maquiadora" sem oferta de maquiagem, falta de localização física e erro ortográfico em `"Seguraça"`** (`/impeccable clarify`)
4. **[P2] Falhas de acessibilidade (WCAG AA contraste, teclado na calculadora, Lightbox sem foco/visibilidade touch e alvos `< 44px`)** (`/impeccable harden`)
5. **[P2] Sobrecarga de performance (5 famílias de fontes via `@import`, 2,41 MB em 4 ícones PNG e conflito de animação sem `prefers-reduced-motion`)** (`/impeccable optimize`)
