# Handoff para Claude — Martha’s Vintage

Data: 2026-09-18
Projeto: `C:\Projetos\marthas-vintage`
Branch atual: `feat/marthas-authored-world-redesign`

## Pedido do usuário

Continuar o redesign da Martha’s Vintage sem substituir a homepage automaticamente. A implementação experimental está em `/direction`.

Preview local:

```text
http://127.0.0.1:3017/direction
```

A rota foi aberta no Brave e respondeu HTTP 200.

## Onde parei

A seção **Styled by Martha** foi implementada e validada dentro da rota experimental `/direction`.

Ela contém:

- seis fontes fotográficas fornecidas pela Martha;
- cada fonte usada como imagem de look e como detalhe por crop CSS;
- desktop com look dominante, detalhe, observação e seletor;
- mobile com carrossel horizontal acessível;
- uma única linguagem de transição entre looks;
- header direcional integrado à rolagem;
- suporte a `prefers-reduced-motion`;
- sem autoavanço;
- sem aparência de revista, catálogo ou e-commerce convencional.

## Correções finais já feitas

A revisão independente encontrou e a implementação corrigiu:

1. **Carrossel mobile deslocava a página verticalmente**
   - removido `scrollIntoView`;
   - agora usa `container.scrollTo` somente no eixo horizontal;
   - teste confirmou `scrollY` estável em 844 px ao ir para o quinto look.

2. **Região `aria-live` era remontada na troca de look**
   - o `key` variável foi removido do ancestral do palco;
   - teste confirmou `liveRegionStable: true`.

3. **Header oculto podia ficar fora da tela ao receber foco**
   - adicionada regra:

   ```css
   .header[data-scroll-hidden="true"]:focus-within {
     transform: translateY(0);
   }
   ```

   - teste confirmou o header em `top: 0`, link `Home` visível.

4. **Contrato de procedência era fraco**
   - compara os `src` usados em `src/data/styled-by-martha.ts` com o manifesto;
   - recalcula SHA-256;
   - valida dimensões JPEG;
   - opcionalmente valida os originais externos com `MARTHA_ORIGINALS_ROOT`.

## Validações confirmadas

Comandos que passaram:

```bash
node scripts/qa/verify-authored-world-hero.mjs
node scripts/qa/verify-styled-by-martha.mjs
MARTHA_ORIGINALS_ROOT='C:/Users/v27me/Downloads/Marthas Vintage - Martha photos' node scripts/qa/verify-styled-by-martha.mjs
CDP_PORT=9333 node scripts/qa/verify-authored-world-runtime.mjs http://127.0.0.1:3017/direction
CDP_PORT=9333 node scripts/qa/verify-styled-runtime.mjs http://127.0.0.1:3017/direction
CDP_PORT=9333 node scripts/qa/verify-styled-header-runtime.mjs http://127.0.0.1:3017/direction
npm run lint
npm run build
```

Resultados:

- contratos hero e Styled: PASS;
- runtime hero: PASS;
- runtime Styled: PASS;
- runtime header: PASS;
- build: PASS;
- lint: 0 erros e 5 warnings legados de `<img>` em `src/components/desktop-home-hero.tsx`.

## Arquivos principais da feature

```text
src/app/direction/page.tsx
src/components/authored-world/authored-world-page.tsx
src/components/authored-world/site-header.tsx
src/components/authored-world/mobile-navigation.tsx
src/components/authored-world/threshold-hero.tsx
src/components/authored-world/styled-by-martha.tsx
src/components/authored-world/authored-world.module.css
src/data/marthas-media.ts
src/data/styled-by-martha.ts
public/assets/site/authored-world/asset-manifest.json
public/assets/site/authored-world/hero/store-wall-original.jpg
public/assets/site/authored-world/styled/*.jpg
scripts/qa/verify-authored-world-hero.mjs
scripts/qa/verify-authored-world-runtime.mjs
scripts/qa/verify-styled-by-martha.mjs
scripts/qa/verify-styled-runtime.mjs
scripts/qa/verify-styled-header-runtime.mjs
scripts/qa/capture-styled-by-martha.mjs
```

## Procedência dos seis assets Styled

O manifesto contém exatamente 6 registros com `role: "styled-look-and-detail"`.

Condições registradas:

- `provenance: "supplied-by-martha"`;
- revisão visual full-frame;
- nenhum selo ou marca visível de conteúdo gerado encontrado na auditoria;
- SHA-256 e dimensões conferidos;
- nenhum caminho privado serializado no manifesto;
- registros legados dos assets anteriormente bloqueados removidos.

Importante: não declarar autenticidade absoluta baseada apenas em pixels. A formulação correta é que são arquivos fornecidos pela Martha e sem indicação visual de conteúdo gerado na revisão realizada.

## Estado Git importante

O working tree está sujo e ainda não houve commit, push ou deploy.

A revisão encontrou alterações prévias fora da rota experimental, incluindo:

```text
src/app/page.tsx
src/app/vintage-details.css
src/components/mobile-menu.tsx
next.config.ts
public/assets/site/photos/original-3a08f6e67a5968d7537fa464256168b4.webp (deletado)
```

Não reverter essas alterações automaticamente. Antes de qualquer commit, separar claramente:

- trabalho prévio da homepage;
- redesign experimental em `/direction`;
- artefatos de QA/documentação.

O usuário não autorizou commit, push ou deploy.

## Próximos passos recomendados

1. Pedir aprovação visual do usuário para Styled by Martha no Brave.
2. Não integrar a seção à homepage ainda.
3. Se aprovado, criar plano separado para a próxima seção da rota `/direction`.
4. Antes de qualquer commit, limpar/organizar o working tree e confirmar escopo com o usuário.
5. Não alterar `main`; a branch ativa é `feat/marthas-authored-world-redesign`.

## Regras de direção visual

Evitar:

- linguagem de revista/editorial;
- “Chapter One”, “Chapter Two” e números de edição;
- papel sépia dominante;
- molduras, selos e ornamentos indiscriminados;
- filtros vintage fortes;
- cenários gerados por IA;
- catálogo convencional;
- amontoado de peças sem curadoria.

Priorizar:

- boutique vintage americana alternativa;
- olhar pessoal da Martha;
- mistura contemporânea de cores, texturas e proporções;
- fotos autênticas fornecidas por ela;
- responsividade auditada por geometria real;
- acessibilidade e reduced motion.
