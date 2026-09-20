# Nova Direção Visual — Hero Martha’s Vintage Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Reposicionar a hero como entrada autêntica no universo alternativo e eclético da Martha, preservando a força da animação existente, mas removendo a metáfora de revista vintage e qualquer dependência de imagem artificial.

**Architecture:** Desktop e mobile continuarão como composições separadas nos breakpoints atuais. A nova hero será construída em três gates — direção/asset, composição estática e movimento — para permitir aprovação antes de tocar nas seções seguintes. O mecanismo de expansão por scroll e handoff do menu será reaproveitado quando servir à nova composição, sem obrigar o novo desenho a manter a geometria antiga.

**Tech Stack:** Next.js, React, TypeScript, CSS, GSAP/ScrollTrigger, assets fotográficos originais enviados pela Martha, Playwright/CDP para auditoria visual.

---

## 1. Norte criativo aprovado para orientar a hero

### Posicionamento operacional

```text
thrift/resale ← curated vintage boutique ← collector-led world/archive
                         ▲ Martha’s Vintage
```

A marca deve carregar:

- a energia e acessibilidade de uma boutique/brechó alternativo americano;
- a edição e autoria de uma coleção pessoal;
- cor, mistura de épocas, styling e descoberta;
- sofisticação produzida por seleção, ritmo e fotografia — não por aparência luxuosa ou histórica.

### Frase-diretriz

> Vintage no inventário; contemporânea, alternativa e pessoal na interface.

### Tensões que toda decisão deve equilibrar

- eclética, mas não caótica;
- pessoal, mas não amadora;
- colorida, mas não infantil;
- comercial, mas não marketplace;
- vintage, mas não nostálgica ou presa a uma década;
- sofisticada, mas não aristocrática;
- tátil, mas não artificialmente envelhecida.

---

## 2. O que muda especificamente na hero

### Preservar

- o lettering/logotipo Martha’s Vintage;
- o princípio da hero ocupar o primeiro viewport;
- a transição por scroll em que a imagem ganha escala e conduz à página;
- o mesmo menu persistindo depois da hero, sem uma navegação duplicada;
- a sensação de descoberta;
- o funcionamento independente de desktop e mobile;
- reduced motion e acessibilidade já previstos no componente desktop.

### Transformar

- **Imagem central:** substituir a composição atual de aparência publicitária/possivelmente sintética por fotografia original da Martha ou por composição feita exclusivamente com os looks reais enviados por ela.
- **Logo dividido:** manter o lettering, mas transformá-lo em uma assinatura mais coesa; evitar “Martha’s” e “Vintage” funcionando como manchetes opostas de uma capa.
- **Menu:** trocar a coluna com pontilhados, que remete a índice editorial, por navegação mais simples, direta e contemporânea.
- **Textura:** reduzir drasticamente o papel envelhecido e o grunge; usar um neutro quente limpo e, se necessário, uma textura quase imperceptível.
- **Cor:** deixar a cor vir das roupas, joias, plantas e needlework reais. Elementos de UI usam apenas acentos extraídos das fotografias.
- **Animação:** manter expansão e handoff, mas fazer a animação revelar mais do mundo da Martha, não simular uma capa de revista se abrindo.
- **Borboleta:** retirar como protagonista voadora. Só poderá permanecer como pequeno símbolo de marca, se a composição provar que ela acrescenta identidade sem cenografia.
- **Copy:** substituir o parágrafo institucional dominante por uma frase curta e uma linha de contexto. Copy final precisa de aprovação; nenhuma frase nova será tratada como definitiva por conta própria.

### Remover

- modelo/imagem com caráter de campanha de época;
- filtros laranja/sépia fortes;
- excesso de grunge e papel amarelado;
- pontilhados de índice;
- título espalhado nos quatro cantos;
- hierarquia de “capa de revista”;
- ornamento usado apenas para comunicar “vintage”;
- card textual pesado no mobile;
- numeração `01 / 06` se não representar uma navegação real.

---

## 3. Conceito proposto para a nova hero

### Nome interno

**Styled Through Martha’s Eye**

### Composição desktop

1. Fundo marfim/mineral limpo, com textura mínima.
2. Logo coeso no topo, com escala expressiva, mas sem dominar como manchete.
3. Navegação simples nas bordas ou em uma linha superior; sem leader dots.
4. Um palco fotográfico autêntico como protagonista.
5. O palco inicial apresenta um look real ou uma composição de 2–3 looks reais montados pela Martha.
6. No scroll, o palco expande e revela mais contexto, cor e combinações; o logo se compacta para a navegação persistente.
7. Uma frase curta explica imediatamente a categoria e o ponto de vista.
8. CTA discreto para explorar a coleção — não “ler a história” como uma publicação.

### Composição mobile

1. Layout recomposto, não versão encolhida do desktop.
2. Hero de um viewport visual (`100svh`/`100lvh` conforme teste real de browser chrome).
3. Logo e botão de menu legíveis no topo.
4. Uma fotografia vertical real ocupa a maior parte da tela.
5. Copy curta, fora de card marrom e sem coluna editorial.
6. CTA claro na área inferior, sem colisão com browser chrome.
7. Ornamento, se existir, é pequeno e subordinado à fotografia.

### Copy candidata — somente para protótipo e aprovação

Eyebrow/contexto:

> Bastrop, Texas · clothing, jewelry, textiles & beautiful oddities

Headline candidata:

> Vintage, styled through Martha’s eye.

CTA candidato:

> Explore the collection

Antes de implementação final, comparar essas linhas com o PDF/manual e pedir aprovação. Se a copy atual tiver sido previamente aprovada, preservar seu sentido e apenas condensar a forma.

---

## 4. Paleta inicial derivada das fotos

A etapa de implementação deverá medir cores diretamente nos 67 arquivos, mas o sistema inicial seguirá:

- **base:** marfim quente / branco mineral;
- **ink:** marrom quase preto, não preto puro;
- **accent 1:** vermelho tomate/coral encontrado em flores, vestidos e colares;
- **accent 2:** azul-petróleo/cobalto encontrado em vestidos, bordados e joias;
- **accent 3:** verde folha derivado das plantas e roupas;
- **counterpoint raro:** rosa/fúcsia ou amarelo ácido, usado em pequena quantidade.

Regra: a interface não deve competir com a variedade cromática das fotografias. No máximo um acento de UI dominante por estado da hero.

---

## 5. Sequência progressiva de trabalho

### Gate 0 — Congelar e documentar o estado atual

**Objective:** Proteger o trabalho existente e separar as mudanças da hero do restante da árvore suja.

**Files:**
- Read only: `src/components/desktop-home-hero.tsx`
- Read only: `src/app/page.tsx`
- Read only: `src/app/globals.css`
- Read only: `src/app/vintage-details.css`
- Create evidence under: `audit/hero-redirection/baseline/`

**Steps:**

1. Registrar `git status --short` e não limpar arquivos não relacionados.
2. Gerar hashes dos componentes e blocos CSS da hero atual.
3. Capturar desktop inicial, meio e final da animação em 1024×768, 1280×832, 1440×900 e 1920×1080.
4. Capturar mobile em 360×740, 390×844, 402×874 e 430×932.
5. Verificar se a captura mobile atual está mostrando o loader em vez da hero; recapturar somente depois do loader real terminar.
6. Documentar os retângulos de logo, foto, navegação, CTA e copy.

**Acceptance:** baseline reproduzível, sem qualquer modificação de produção.

---

### Gate 1 — Curadoria dos assets e direction board

**Objective:** Escolher a fotografia correta antes de desenhar ou programar.

**Source folders:**
- `C:/Users/v27me/Downloads/Marthas Vintage - Martha photos/email-2026-08-30/`
- `C:/Users/v27me/Downloads/Marthas Vintage - Martha photos/latest-2026-09-09-to-11/`
- `C:/Users/v27me/Downloads/Marthas Vintage - Martha photos/drive-links/`

**Create:**
- `audit/hero-redirection/direction-board/hero-contact-sheet.jpg`
- `audit/hero-redirection/direction-board/hero-candidates.json`
- `audit/hero-redirection/direction-board/palette.json`

**Steps:**

1. Classificar os 67 arquivos por: Martha/pessoa, manequim/look, interior, detalhe, joia, tecido, arte/needlework.
2. Marcar resolução, orientação, espaço negativo e qualidade de luz.
3. Selecionar no máximo cinco candidatos que suportem crop desktop e mobile sem IA generativa.
4. Priorizar imagem que mostre o olhar da Martha, não apenas idade da peça.
5. Criar um direction board com:
   - 1 hero principal;
   - 2 imagens de apoio;
   - amostras de cor;
   - tipografia atual preservada e tipografia secundária possível;
   - lista “usar / evitar”.
6. Apresentar o board ao usuário antes de editar componentes.

**Gate de aprovação:** usuário escolhe/autoriza a imagem principal e confirma a densidade visual.

---

### Gate 2 — Dois estudos estáticos da mesma direção

**Objective:** Validar composição antes de investir em animação.

Não apresentar direções conceituais divergentes. Criar duas variações de composição dentro do mesmo conceito:

- **Estudo A:** uma fotografia real dominante;
- **Estudo B:** uma composição controlada de looks reais, sem aparência de scrapbook.

**Create:**
- `audit/hero-redirection/static-study/desktop-a.png`
- `audit/hero-redirection/static-study/desktop-b.png`
- `audit/hero-redirection/static-study/mobile-a.png`
- `audit/hero-redirection/static-study/mobile-b.png`

**Steps:**

1. Criar estudos em HTML/CSS descartáveis ou mockups, sem substituir ainda a hero de produção.
2. Testar logo coeso, navegação simples, headline curta e CTA.
3. Aplicar somente correção básica de exposição/crop nos originais.
4. Não usar cenários gerados, troca de fundo ou alteração de peças.
5. Avaliar cada estudo pelos critérios:
   - parece uma boutique vintage alternativa dos EUA?
   - ainda parece claramente Martha’s Vintage?
   - a fotografia fala antes da interface?
   - existe sofisticação sem parecer revista?
   - a cor parece viva sem ficar caótica?
6. Submeter ao usuário para escolher A ou B e pedir ajustes específicos.

**Gate de aprovação:** composição estática escolhida para desktop e mobile.

---

### Gate 3 — Implementar a hero estática escolhida

**Objective:** Substituir a composição visual sem introduzir a animação ainda.

**Likely files:**
- Modify: `src/components/desktop-home-hero.tsx`
- Modify: `src/app/page.tsx` (`HeroFrame` mobile apenas)
- Modify: `src/app/globals.css`
- Modify: `src/app/vintage-details.css`
- Create: `public/assets/site/hero-direction/` para derivados aprovados
- Create/Test: `scripts/qa/hero-direction-static.*`

**Steps:**

1. Copiar apenas os assets escolhidos para `public/assets/site/hero-direction/`.
2. Gerar derivados otimizados sem sobrescrever os originais.
3. Implementar desktop e mobile atrás dos breakpoints já existentes.
4. Manter a hero desktop em `>=1024px` e impedir vazamento no mobile/tablet.
5. Remover elementos editoriais somente dentro da hero.
6. Preservar anchors, IDs e acessibilidade.
7. Adicionar teste de visibilidade para garantir exatamente uma hero por viewport.
8. Testar ausência de overflow e colisões.
9. Capturar todos os viewports do Gate 0.

**Acceptance:** hero estática aprovada visualmente em desktop e mobile antes de animar.

---

### Gate 4 — Reintroduzir movimento com propósito

**Objective:** Adaptar a animação aprovada ao novo conceito.

**Likely files:**
- Modify: `src/components/desktop-home-hero.tsx`
- Possibly modify: `src/components/mobile-menu.tsx` somente se necessário para integração visual
- Modify: CSS da hero nos arquivos existentes
- Test: `scripts/qa/hero-direction-motion.*`

**Motion sequence:**

1. Estado inicial apresenta a fotografia/look como entrada.
2. Scroll amplia ou abre o palco fotográfico.
3. Logo se compacta para o cabeçalho persistente.
4. Navegação passa para o estado persistente usando os mesmos nós DOM.
5. Copy sai com movimento curto e discreto.
6. Nenhum ornamento voa pela tela apenas para parecer vintage.
7. Reduced motion recebe estado estático completo e utilizável.

**Verification:**

- capturar progresso 0%, 25%, 50%, 75% e 100%;
- verificar resize no meio da animação;
- verificar scroll down/up do menu persistente;
- provar identidade dos mesmos nós de logo/menu antes e depois do handoff;
- verificar navegação por teclado e `inert` quando recolhida;
- testar `prefers-reduced-motion`.

**Gate de aprovação:** usuário aprova a hero final em movimento.

---

### Gate 5 — Polimento responsivo e QA

**Objective:** Garantir que a direção se sustente fora do viewport principal.

**Viewports mínimos:**

- mobile: 360×740, 375×812, 390×844, 402×874, 430×932;
- tablet de segurança: 768×1024 e 820×1180, sem redesign não autorizado;
- desktop: 1024×768, 1280×720, 1280×832, 1366×768, 1440×900, 1920×1080;
- DPR 1 e 2 nos representantes principais.

**Checks:**

- `scrollWidth === clientWidth`;
- logo e copy sem clipping interno;
- crop preserva rosto/peça/gesto principal;
- CTA não colide com browser chrome;
- imagem otimizada não fica suave;
- nenhum filtro descaracteriza tecido ou cor;
- menu permanece utilizável após a hero;
- build, lint e testes passam;
- comparação visual lado a lado em cada breakpoint.

**Important:** não fazer commit, push ou deploy sem autorização explícita do usuário.

---

## 6. Progressão do restante do site depois da hero

A próxima seção só começa após a aprovação integral da hero.

### Fase 2 — Signature module: “Styled by Martha”

- provar como ela combina roupas, cintos, joias e bolsas;
- usar pares de look completo + detalhe;
- pequenas observações da Martha;
- nenhuma numeração de editorial.

### Fase 3 — “What Caught Her Eye”

- joias, bordados, botões, crochê, texturas e reparos;
- macrofotografia e notas curtas;
- revelar o critério de escolha.

### Fase 4 — “Found Together”

- relacionar roupa, joia, basket, textile, needlework e arte por cor/material;
- módulo decisivo para provar “Martha’s world” sem parecer catálogo.

### Fase 5 — Collection

- exploração leve e comercialmente clara;
- categorias discretas;
- evitar grid genérico como primeira experiência;
- transição da atmosfera para a descoberta de peças.

### Fase 6 — Beyond the Wardrobe

- interiores, plantas, arte, baskets, tecidos e needlework;
- mostrar como o olhar da Martha atravessa roupa e casa.

### Fase 7 — Visit / Contact / Footer

- convite autêntico para Bastrop;
- informações práticas sem linguagem corporativa;
- revisar CTA real quando contato/agendamento estiver definido.

Cada fase repete o mesmo ciclo: direção estática → aprovação → implementação → auditoria desktop/mobile → próxima fase.

---

## 7. Riscos e decisões abertas

1. **Identidade da pessoa nas fotos:** confirmar quais retratos são da Martha antes de usá-los como founder portrait.
2. **Copy:** confirmar quais frases do site atual já foram aprovadas pela cliente.
3. **Uso comercial das fotos:** confirmar se todas as pessoas fotografadas autorizaram publicação.
4. **Qualidade/orientação:** algumas fotos funcionam melhor como detalhe do que como hero full bleed.
5. **Imagem versus composição:** decidir no Gate 2 se uma única imagem comunica melhor que um conjunto de looks.
6. **Logo/borboleta:** o símbolo só permanece se não dominar o conteúdo.
7. **Árvore de trabalho suja:** não limpar, sobrescrever ou incluir assets não relacionados; mudanças devem ser seletivas.
8. **Mobile baseline:** a captura atual parece registrar o loader, não a hero; não usar essa imagem como referência final.
9. **Fonte:** manter as famílias atuais no primeiro protótipo; só introduzir nova fonte se a direção não puder ser resolvida por hierarquia e escala.

---

## 8. Definição de pronto da hero

A hero estará pronta somente quando:

- usar fotografia original aprovada;
- comunicar boutique vintage alternativa e curadoria pessoal em poucos segundos;
- não parecer capa de revista vintage;
- não depender de sépia, grunge, selo, capítulo ou ornamento histórico;
- preservar a identidade Martha’s Vintage;
- funcionar em desktop e mobile como composições próprias;
- manter ou superar a qualidade da animação atual;
- preservar autenticidade das imagens;
- passar build, lint, testes de interação e auditoria visual multiviewport;
- receber aprovação explícita do usuário antes de qualquer commit/push/deploy.
