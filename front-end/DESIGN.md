# Diretriz de design — seguir rigorosamente

Referência visual de todo o front-end (extraída do site institucional da Ximed).
Tokens implementados em `src/app/globals.css` (Tailwind v4 `@theme`). Não copiar textos,
fotos ou identidade de terceiros: só os padrões visuais abaixo.

## Estilo
Claro, corporativo, minimalista e confiável. Fundo branco dominante, uma única cor de
ação (teal `#166a70`), gradiente teal→navy só em blocos de destaque, amarelo `#f5b800`
somente como acento sobre fundo escuro. Cantos bem arredondados, sombras quase
invisíveis, bastante respiro.

## Tokens (sempre via token/utilitário Tailwind — nunca valores soltos)
Cores: primary `#166a70` · primary-dark `#1f514c` · secondary `#03315a` · accent `#f5b800` ·
bg `#fff` · surface `#f3f3f3` · surface-2 `#fafafa` · tint `#e3ecee` · text `#292929` ·
text-muted `#52575c` · text-subtle `#757575` · border `#e6e6e6` · border-strong `#cfd4d6` ·
success `#1e8e5a` · warning `#f5b800` · error `#c2362b`
Gradiente de marca: `linear-gradient(180deg, #166a70 0%, #03315a 100%)`
Fontes: Inter (títulos/UI) + Roboto (corpo). Nenhuma outra família.
Tipo: h1 `clamp(30px,4vw,40px)`/600/1.2/-0.02em · h2 21px/600 · h3 17px/500 ·
body 16px/400/1.5 · small 14px · caption 13px/500
Espaçamento (escala 4px do Tailwind): 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 100
Radius (no `@theme`, substituem os padrões do Tailwind): `rounded-xs` 8 (inputs, tags) ·
`rounded-sm` 12 · `rounded-md` 16 (cards pequenos, tabela) · `rounded-lg` 20 ·
`rounded-xl` 24 (cards grandes) · `rounded-2xl` 32 · `rounded-full` (botões, pills)
Sombras: `shadow-card` · `shadow-header` · `shadow-button` · `shadow-focus`
Container: 1200px + gutter 20px (estreito 900px)
Breakpoints (substituem os padrões): sm 560 · md 810 · lg 1024 · xl 1200

## Componentes
- Header: pílula flutuante fixa, `rgba(243,243,243,.92)` + blur 10px, radius 999, shadow header.
  Links Inter 14/500 → hover primary. Hambúrguer abaixo de 1200px.
- Botão: pílula, padding `3px 3px 3px 14px`, gap 10px, texto 13–14/500 + círculo 26–33px com
  seta à direita. Primary = fundo primary/texto branco/círculo branco. Secondary = fundo
  branco/texto text/círculo primary. Hover: seta `translateX(2px)`. Active `scale(.98)`.
  Disabled opacity .5. Submit de formulário: largura total, sem ícone.
- Input/select/textarea: altura 44px, padding 10px 12px, radius 8, borda border-strong,
  label 14px acima. Focus: borda primary + shadow focus. Formulários em 2 colunas (1 ≤809px).
- Card padrão: branco com borda border (ou surface), radius 24, padding 24–32.
- Tag/badge: bg secondary, texto branco 14/500, padding 8px 13px, radius 8.
- Tabela: container radius 16 com borda border, cabeçalho surface 14/600, linhas separadas por
  border, padding de célula 12px 16px.
- Modal: radius 24, bg branco, shadow card, overlay `rgba(3,49,90,.55)` + blur 4px.
- Rodapé: bg primary, texto branco.
- Ícones: outline, traço fino, monocromático (Lucide).

## Layout
Seção = padding vertical 100px (64px ≤809px) → H1 centralizado em primary → subtítulo
text-muted 16px/1.6 máx. 720px → conteúdo 48px abaixo.
Grids: 3 colunas gap 20 para coleções; 2 colunas gap 40 para texto + mídia; 1 coluna ≤1023px.

## Movimento
Reveal: opacity 0→1 + translateY(24px)→0 em 700ms. Transições de UI 200–400ms, escala máx.
1.05, sem bounce. Respeitar `prefers-reduced-motion`.

## Logo
`public/logo-ximed.webp` (150×45). Usar só sobre fundo claro (header, card de login),
nunca sobre o gradiente escuro.

## Regras inegociáveis
1. Só primary como cor de ação. Amarelo nunca sobre fundo claro.
2. Nenhum canto vivo; nenhum valor fora da escala de tokens.
3. Contraste mínimo WCAG AA (primary-light `#2aa4a8` não pode ser texto).
4. Foco visível em todo elemento interativo.
5. Mobile-first, testado em 375px, 810px, 1024px e 1440px.
