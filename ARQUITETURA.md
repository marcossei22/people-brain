# People Brain — Arquitetura do Protótipo

> Companion do [PLANO.md](PLANO.md). Este documento é o spec de build: o que existe, com que
> tipos, quais telas, quais ferramentas, e em que ordem construir.

---

## 1. Princípios de arquitetura

Cinco regras que decidem todos os empates abaixo.

**1. É um protótipo descartável. Otimize para a gravação, não para produção.**
Nenhuma linha de código precisa sobreviver a esta semana. O que precisa sobreviver é a
compreensão do avaliador.

**2. Determinismo onde tem câmera; realismo onde tem improviso.**
Fluxos 1 e 3 são set-pieces: roteirizados, instantâneos, idênticos em toda tomada. O chat é o
único lugar com LLM em runtime — porque é o único lugar onde o avaliador vai digitar algo que
ninguém previu. Roteirizado não quer dizer imitar a superfície de outro produto: o Slack é fonte,
não tela (§8).

**3. A estrutura de dados é argumento.**
O arquivo de dados espelha o modelo de memória de 4 níveis do PLANO.md §3.2. Se alguém perguntar
"como isso funcionaria de verdade?", a resposta é abrir o arquivo.

**4. Permissão é código, nunca instrução de prompt.**
Regra de acesso escrita só no system prompt é contornável com uma pergunta esperta — e isso
seria uma falha catastrófica na frente da liderança. Toda restrição de acesso vive na
implementação da tool.

**5. Toda tela precisa carregar tese.**
Se uma tela não prova nada do PLANO.md, ela não entra. Cortar é mais barato que construir.

---

## 2. Stack

| Camada | Escolha | Nota |
|---|---|---|
| Framework | **Next.js (App Router)** | Deploy Vercel, um link, route handler esconde a chave |
| Hospedagem | **Vercel** | — |
| UI | **shadcn/ui + Tailwind** | Capricho concentrado nos fluxos 1 e 2 |
| Camada de agente | **Eve** *(fallback: AI SDK puro)* | Isolada atrás de `lib/agente/` — ver §2.1 |
| Componentes generativos | **Componentes registrados, seleção por tool** | §7 |
| Dados | **Módulos `.ts` tipados** | Não JSON — type-check pega inconsistência no build |
| Estado | **React Context em memória** | Sem persistência. Botão de reset. §10 |
| Modelo | Claude via `AI_PROVIDER` env | Trocável |

**Cortados, com motivo registrado:**

| Cortado | Motivo |
|---|---|
| Banco de dados | Não há escrita que precise sobreviver ao reload |
| Vector store / RAG | ~40k tokens de corpus. Retrieval aqui é teatro. |
| Sandbox (E2B / Daytona / Vercel) | **Sandbox resolve execução; o problema aqui é recuperação.** Nada é executado, nada é escrito, nada chega em runtime. Resolvido por tools sobre dados tipados (§6). |
| Composio / MCP real | O dado é falso de qualquer forma. Integração real com um workspace de teste é *menos* convincente que uma tela de integração bem-feita. Vira `/integrations` (§8.5). |
| Auth | Troca de persona é um seletor, não um login (§4) |

### 2.1 Isolamento da camada de agente

Eve é nova e o risco é destravar problema em vez de construir conteúdo. Mitigação estrutural:
**tudo que toca o modelo vive em `lib/agente/`** e expõe uma interface só.

```ts
// lib/agente/index.ts — a ÚNICA superfície que o resto do app conhece
export interface RespostaAgente {
  stream: ReadableStream
  toolCalls: ToolCall[]
}
export function responder(msgs: Mensagem[], viewer: Viewer): Promise<RespostaAgente>
```

**A decisão Eve × AI SDK fica para o passo 4**, quando a camada de agente for construída — e a
fachada é o que torna essa postergação barata: qualquer um dos dois entra por trás dela sem tocar
em nenhuma tela. Critério de escolha: o que responder com tool call primeiro, sem briga.

---

## 3. Estrutura de pastas

```
/app
  layout.tsx                 shell + sidebar + painel de chat + seletor de persona + reset
  page.tsx                   → redirect /org
  /org/page.tsx              pessoas a que o viewer tem acesso + diagnóstico de organização
  /org/[id]/page.tsx         dossiê (mesma tela pra gestor e pra própria pessoa)
  /feedback/page.tsx         FLUXO 1 — pendências de atenção do viewer
  /diretrizes/page.tsx       SETUP — os documentos fixos da empresa · só admin
  /diretrizes/regua/page.tsx SETUP — a régua, o único documento estruturado
  /integrations/page.tsx     SETUP — fontes conectadas
  /api/chat/route.ts         única rota com LLM

  (o chat NÃO é rota — é painel global, aberto por botão, histórico na sidebar)

/lib
  /agente
    index.ts                 fachada (§2.1)
    prompt.ts                system prompt + índice de skills
    tools.ts                 tools de ACESSO (§6.2)
    renderizar.ts            contrato de render + schemas zod (§7)
    permissoes.ts            regra de acesso — código, não prompt
  memoria.ts                 funções de consulta sobre os dados
  viewer.ts                  contexto de quem está olhando

/skills                      PROCEDIMENTO — perfil do Brain, NÃO doutrina da empresa (§6.3)
  preparar-1a1.md            (não aparece em /diretrizes — tela própria, mais adiante)
  montar-caso-de-promocao.md
  comparar-com-regua.md
  rascunhar-feedback.md
  identificar-lacunas.md
  diagnosticar-organizacao.md
  tom-e-linguagem.md         sempre carregada no system prompt

/doutrina                    PROSA — o conteúdo fixo da empresa, lido em /diretrizes
  cultura.md
  contexto-do-semestre.md
  politica-de-decisao.md

/data
  pessoas.ts
  eventos.ts                 ~150–200 eventos, 6 meses
  episodios.ts               ~35–45 episódios
  temas.ts                   ~15 temas
  lacunas.ts                 ~12 lacunas
  regua.ts                   Eng e Sales × 3 níveis
  cultura.ts                 doc de cultura e tom (usado só pra tom)
  achados-org.ts             diagnóstico de organização
  roteiros.ts                copy pré-escrita dos fluxos 1 e 3
  validar.ts                 script de integridade referencial (§5.2)

/components
  /shell                     Sidebar, SeletorPersona, BotaoReset, BotaoChat
  /chat                      PainelChat, HistoricoConversas, PassosDaTool
  /brain                     CardDossie, TimelineEpisodios, CardGap, ...
  /ui                        shadcn
```

---

## 4. Modelo do observador (viewer)

O protótipo precisa mostrar o mesmo produto de três ângulos. Não há login — há um seletor no
topo, sempre visível, que também serve de orientação pro avaliador.

```ts
type Papel = 'gestor' | 'colaborador' | 'chro'
interface Viewer { pessoaId: PessoaId; papel: Papel }
```

Três personas pré-configuradas no seletor:

| Ver como | Papel | Prova |
|---|---|---|
| **Marina Duarte** — Eng Manager | `gestor` | O loop de atenção e a estrela |
| **Carla Nunes** — Eng, caso de promoção | `colaborador` | "Sem arquivo secreto" |
| **Helena Prado** — CHRO | `chro` | Diagnóstico de organização |

> **Decisão de arquitetura que carrega tese:** `/org/[id]` é **um componente só**. A
> Carla vendo o próprio dossiê e a Marina vendo o dossiê da Carla renderizam a mesma tela, com
> campos gated por permissão. Isso não é economia de código — é o princípio "sem arquivo secreto"
> virando fato demonstrável. No vídeo: trocar a persona no seletor **sem sair da página**.

---

## 5. Modelo de dados

Espelha o PLANO.md §3.2: **evento → episódio → tema → lacuna**.

### 5.1 Tipos

```ts
type PessoaId = string; type EventoId = string
type EpisodioId = string; type LacunaId = string
type Trilha = 'eng' | 'sales'
type Nivel = 'pleno' | 'senior' | 'staff'

/** De onde veio a evidência. A variante 'humano' é o loop de elicitação
 *  aparecendo no sistema de tipos: evidência obtida perguntando é
 *  first-class e distinguível de evidência observada. */
type Fonte =
  | { tipo: 'slack';  canal: string; mensagemId: string }
  | { tipo: 'github'; repo: string; pr: number }
  | { tipo: 'doc';    titulo: string }
  | { tipo: 'crm';    negocio: string }
  | { tipo: 'humano'; respondidoPor: PessoaId; lacunaId: LacunaId }

interface Pessoa {
  id: PessoaId; nome: string; cargo: string
  trilha: Trilha; nivel: Nivel
  gestorId?: PessoaId; time: string; desde: string
  /** Exibida no dossiê por honestidade — trade-off #1 do PLANO.md
   *  virando informação visível em vez de viés escondido. */
  densidadeEvidencia: 'alta' | 'media' | 'baixa'
}

interface Evento {
  id: EventoId; pessoaId: PessoaId
  data: string            // ISO
  texto: string           // uma frase: o que aconteceu
  fonte: Fonte
  episodioId?: EpisodioId
}

interface Episodio {
  id: EpisodioId; pessoaId: PessoaId
  titulo: string; resumo: string
  inicio: string; fim: string
  eventoIds: EventoId[]
  colaboradores: PessoaId[]
  /** A estrela gruda AQUI, no episódio — nunca na pessoa.
   *  Não existe campo para estrela negativa. Por desenho. (PLANO.md §3.3) */
  estrela?: { por: PessoaId; em: string; nota?: string }
  nivelObservado?: Nivel   // "isso foi acima do nível dela"
}

interface Tema {
  id: string; pessoaId: PessoaId
  padrao: string                    // "assume coordenação cross-team que ninguém pediu"
  episodioIds: EpisodioId[]
  comportamentosRegua: string[]     // ids da régua — é o que liga tema a decisão
  confianca: 'alta' | 'media' | 'baixa'   // função da densidade de evidência
}

interface Lacuna {
  id: LacunaId; pessoaId: PessoaId
  pergunta: string
  perguntarA: PessoaId
  motivo: string                    // o "declara o porquê" do orçamento de pergunta
  valor: 'alta' | 'media' | 'baixa' // valor da informação — governa a fila
  status: 'aberta' | 'perguntada' | 'respondida' | 'descartada'
  resposta?: { texto: string; por: PessoaId; em: string }
}

interface ComportamentoRegua { id: string; texto: string; observavel: string }

interface NivelRegua {
  trilha: Trilha; nivel: Nivel
  comportamentos: ComportamentoRegua[]
  /** A régua viva: sugestão derivada da evidência real (PLANO.md §3.1) */
  derivado?: {
    sugestao: string
    baseadoEm: PessoaId[]
    status: 'proposto' | 'aceito'
  }
}

interface AchadoOrg {
  id: string
  tipo: 'gargalo' | 'bloqueio-promocao' | 'cobertura-gestor' | 'gap-skill'
  titulo: string
  evidencia: { pessoaIds: PessoaId[]; episodioIds: EpisodioId[] }
  recomendacao: string
}
```

### 5.2 Integridade referencial

O maior risco do protótipo não é técnico — é **o elenco se contradizer entre os fluxos**. Se a
Carla tem uma história no Slack e outra no dossiê, a liderança percebe na hora.

`data/validar.ts` roda no build e falha se:
- algum `eventoId` referenciado não existir
- algum `pessoaId` não existir
- um episódio referenciar evento de outra pessoa
- um tema apontar pra comportamento inexistente na régua
- uma lacuna `respondida` não tiver `resposta`
- houver evento fora da janela do semestre

```json
// package.json
"prebuild": "tsx data/validar.ts"
```

Custa 20 minutos e elimina a única classe de erro que estraga a gravação.

### 5.3 Elenco (esboço — detalhar no próximo passo)

| Pessoa | Papel na narrativa |
|---|---|
| **Marina Duarte** · Eng Manager | Observadora principal do fluxo 1 |
| **Carla Nunes** · Eng pleno→senior | Caso de promoção. Densidade **alta**. |
| **Rafael Lima** · Eng senior | Duas entregas perdidas, ambas travadas por Dados → vira o achado de organização |
| **Bruno Sato** · Eng pleno | 4 meses sem feedback. O esquecido. |
| **Letícia Alves** · AE senior (Sales) | Segunda trilha; densidade **média** — mostra o loop de perguntar trabalhando |
| **Diego Moura** · Design Lead | Densidade **baixa** — é a honestidade do trade-off #1 na tela |
| **Paulo Rocha** · Eng Manager | Cobertura de feedback ≈ zero → achado de organização sobre gestão |
| **Helena Prado** · CHRO | Observadora do fluxo 3 |

---

## 6. Memória, tools e skills

### 6.1 A distinção que organiza tudo

> **Tool é acesso. Skill é procedimento.**

Confundir os dois é o erro de arquitetura mais fácil de cometer aqui. `buscarEpisodios` busca
dado — determinístico, sem julgamento, é tool. `prepararReuniao` exige *raciocinar sobre* o dado:
implementá-la como função TypeScript significa escrever à mão a lógica de "o que faz uma boa pauta
de 1:1" — ou seja, codificar o julgamento que o modelo faz melhor. É o erro de "digitalizar o
formulário" acontecendo na camada de código: mais trabalho, resultado pior.

**E skill não é detalhe de implementação — é a fase de Setup em forma executável.** A doutrina de
gestão da empresa ("como se prepara um 1:1 aqui", "como se monta um caso de promoção aqui", "qual
é o nosso tom") vira markdown versionado que o agente lê e executa. O FDE não configura software:
ele **escreve as skills junto com o cliente**. E a régua viva (§8.5) fica mais forte — o sistema
propõe edição *no arquivo de skill* a partir da evidência observada. Doutrina que se reescreve a
partir do resultado é N5 com mecanismo, não retórica.

### 6.2 Por que não filesystem + bash

O argumento a favor é real: dropar markdown numa pasta e deixar o agente grepar não tem schema pra
manter, e funciona bem no Claude Code. Três razões pra não fazer isso **aqui**:

1. **Permissão vira instrução de prompt.** Com bash, `cat data/carla.md` funciona independente do
   que o system prompt diz. "Par não consulta par" deixa de ser garantia e vira sugestão — e um
   avaliador esperto quebra isso ao vivo. Contraria o princípio §1.4.
2. **Latência multiplicada na câmera.** bash → grep → read → talvez grepar de novo → responder.
   Várias idas ao modelo por resposta.
3. **A que decide: grep existe pra corpus grande demais pra enumerar. O nosso tem ~10 arquivos.**
   `listarSkills()` devolve nome + descrição de todos numa chamada. Quando o corpus é enumerável,
   enumeração ganha de busca.

**Mas a semântica do filesystem fica**, sem a VM: `listarSkills` + `lerSkill` sobre markdown
bundleado *é* o mecanismo de skills do Claude Code — índice de nomes e descrições, modelo escolhe,
modelo lê. Zero infra, zero boot, adicionar skill é adicionar arquivo.

### 6.3 O que vive onde

| | Natureza | Acesso | Por quê |
|---|---|---|---|
| **Skills** | procedimento | `.md` via `listarSkills` / `lerSkill` | Julgamento é do modelo |
| **Doutrina** — cultura, contexto do semestre | prosa | `.md` via `lerDoutrina` | Não tem estrutura a preservar |
| **Régua** | prosa estruturada | tool `lerRegua` | É referenciada por `Tema.comportamentosRegua` |
| **Memória** — eventos, episódios, temas, lacunas | dado com referências | tools de acesso | Ver abaixo |

A memória fica estruturada por dois motivos que não são preferência estética:
- O drill-down de uma afirmação até a mensagem original do Slack é um **join**, não um grep. Em
  markdown você acabaria escrevendo IDs no texto — um banco de dados com ergonomia pior.
- `/org/[id]` renderiza **sem passar pelo agente**. Os tipos precisam existir de qualquer
  forma.

### 6.4 As tools de acesso

Todas determinísticas, todas permissionadas (§6.5).

| Tool | Parâmetros |
|---|---|
| `listarSkills` | — |
| `lerSkill` | `{ nome }` |
| `lerDoutrina` | `{ nome }` |
| `buscarPessoas` | `{ time?, trilha?, nivel?, gestorId? }` |
| `lerEventos` | `{ pessoaId, periodo?, busca? }` |
| `lerEpisodios` | `{ pessoaId, periodo?, comEstrela? }` |
| `lerTemas` | `{ pessoaId }` |
| `listarLacunas` | `{ pessoaId?, status? }` |
| `lerRegua` | `{ trilha, nivel }` |
| `renderizar` | `{ tipo, payload }` — §7 |

### 6.5 As skills

Cada arquivo: quando usar, que tools chamar e em que ordem, como estruturar, e **com qual
componente renderizar**.

| Skill | Faz |
|---|---|
| `preparar-1a1.md` | Últimos episódios + lacunas abertas + gap de régua → pauta |
| `montar-caso-de-promocao.md` | Temas × comportamentos da régua, com evidência por comportamento |
| `comparar-com-regua.md` | Gap comportamento a comportamento, declarando o que não tem evidência |
| `rascunhar-feedback.md` | Episódio → rascunho específico, no tom da empresa, citando fonte |
| `identificar-lacunas.md` | O que falta pra sustentar uma decisão próxima |
| `diagnosticar-organizacao.md` | Agrega padrões entre pessoas — o "Dados é gargalo", não "o Rafa é lento" |
| `tom-e-linguagem.md` | Sempre no system prompt. Vem de `doutrina/cultura.md`. **Governa como se diz, nunca se a pessoa é boa** (PLANO.md §3.1) |

### 6.6 Permissão — em código

```ts
// lib/agente/permissoes.ts
export function podeConsultar(viewer: Viewer, alvo: PessoaId): Autorizacao {
  if (viewer.pessoaId === alvo) return { ok: true }
  if (viewer.papel === 'gestor' && ehReportDireto(viewer.pessoaId, alvo)) return { ok: true }
  if (viewer.papel === 'chro') return { ok: true, escopo: 'agregado' }
  return {
    ok: false,
    motivo: 'Pares não consultam o registro de pares. Só você e seu gestor veem o seu.'
  }
}
```

Toda tool chama isso antes de tocar em dado. Negação retorna objeto estruturado que o modelo
**explica** — ele não inventa a recusa, ele relata uma que já aconteceu.

### 6.7 As duas camadas de recusa

Distinção importante, e vale dizer em voz alta no vídeo:

| Camada | O quê | Onde é imposta |
|---|---|---|
| **Acesso** | "Par não consulta par" | `permissoes.ts` — **código** |
| **Escopo** | "Não respondo sobre estado emocional, intenção de sair, saúde" | System prompt **+ ausência de dado**: não existe campo de sentimento em lugar nenhum, então não há com o que responder |

Cinto e suspensório. A segunda é mais forte do que parece: **a recusa não é uma política, é uma
consequência do modelo de dados.**

---

## 7. A camada generativa

### 7.1 A skill governa o componente

Resolve a tensão "generativo mas determinístico" — e coloca o controle no lugar certo:

```
skill diz QUAL componente usar e qual payload preencher   ← doutrina do cliente
modelo chama renderizar(tipo, payload)                     ← preenche
zod valida contra o schema do componente                   ← falhou? cai pra prosa
biblioteca de componentes é FIXA                           ← nunca há layout gerado
```

Exemplo, no fim de `preparar-1a1.md`:

> *"Renderize com `briefing`, preenchendo `pauta[]`, `evidencias[]` (cada uma com `eventoId`) e
> `lacunas[]`."*

O modelo nunca escreve layout — ele escolhe entre componentes prontos e preenche um schema
validado. **E quem decide a forma da resposta é o arquivo de skill da empresa**, ou seja, a fase
de Setup passa a controlar até a UI. É generativo o bastante pra ser product-true (um sistema de
performance cuja única saída é prosa é um produto pior) e fixo o bastante pra não quebrar na
quinta tomada.

### 7.2 Tool call visível

Enquanto o agente trabalha, a UI mostra os passos em texto pequeno e monoespaçado:

```
› lendo skill · preparar-1a1
› consultando memória · lerEpisodios(carla, 90d)   ▸ 7 episódios
› consultando memória · listarLacunas(carla)       ▸ 2 abertas
```

Custa 15 minutos e é o momento em que a arquitetura fica visível na câmera — dá pra apontar e
dizer *"ele leu a doutrina da empresa antes de consultar a memória"*.

### 7.3 Componentes

Todos com **fonte clicável** — princípio §2.1 do PLANO.md ("nenhuma frase sem link pra fonte").

| `tipo` | Componente | Conteúdo |
|---|---|---|
| `dossie` | `<CardDossie>` | Trajetória, temas, episódios por impacto, densidade de evidência declarada |
| `timeline` | `<TimelineEpisodios>` | Linha do tempo; cada episódio expande até os eventos e suas fontes |
| `gap` | `<CardGap>` | Régua do nível alvo × evidência, comportamento a comportamento |
| `lacunas` | `<CardLacunas>` | O que o sistema sabe que não sabe, com motivo e a quem perguntar |
| `briefing` | `<CardBriefing>` | Pauta de 1:1 com evidência recente |
| `diagnostico` | `<CardDiagnostico>` | Achado de organização + as pessoas afetadas |
| `pessoas` | `<ListaPessoas>` | Lista simples |
| `recusa` | `<CardRecusa>` | Recusa com o motivo. Componente próprio — a recusa merece design. |
| *(nenhum)* | prosa | Fallback quando o zod falha ou a pergunta não pede estrutura |

---

## 8. Telas

> **Não imitamos o Slack.** O Slack é *fonte*: entra pelo grafo de conhecimento da empresa e
> aparece como integração em §8.5. Renderizar uma casca de Slack dentro do produto confundiria
> fonte com superfície e faria o protótipo parecer um bot de Slack em vez de um sistema de
> registro. Em produção o nudge chega no Slack (PLANO.md §3.3); no protótipo o mesmo loop
> acontece em `/feedback`, que é onde ele vive de qualquer forma quando a pessoa abre o produto.

### 8.0 Shell — sidebar, chat e persona

Sidebar fixa com: navegação (`/org` · `/feedback` · `/diretrizes` · `/integrations`), **histórico de
conversas**, botão `Nova conversa`, e no rodapé o **seletor de persona** + `Reset`.

O **chat não é rota**. É um painel que abre por botão e fica por cima de qualquer tela — porque a
pergunta ("onde a Carla está em relação à régua?") quase sempre nasce olhando outra coisa. Mandar
a pessoa pra outra página pra perguntar quebra o gesto. Cada conversa entra no histórico.

É a **única superfície com LLM** — FLUXO 2. Conversa nova abre com chips de pergunta sugerida,
que são também o fallback se a demo travar ao vivo:

- *"Prepara meu 1:1 com a Carla"*
- *"Onde a Carla está em relação à régua de Senior?"*
- *"Quem no meu time está sem feedback há mais tempo?"*
- *"O Rafa está infeliz?"* ← a recusa, como chip. Assumida, não escondida.

### 8.1 `/org` — a organização

Lista das pessoas a que o viewer tem acesso — e a lista **já é** a permissão do §6.6 na tela: a
Marina vê os reports dela, a Carla vê a si mesma, a Helena vê a organização em escopo agregado.
Clicar entra em `/org/[id]`.

Abaixo da lista, para `chro` e `admin`, o **diagnóstico de organização** — os `AchadoOrg`, com o
do Rafael/Dados em destaque. É output de primeira classe (decisão #10) e o lugar dele é aqui:
"Dados é gargalo de 6 pessoas" é afirmação sobre a organização, não sobre um ciclo.

### 8.2 `/org/[id]` — dossiê

Um componente, dois observadores (§4). Como colaborador, ganha três affordances:
`Adicionar contexto` · `Contestar item` · `Pedir feedback a um par sobre este episódio`.

O botão de estrela aparece **no episódio**, só pro gestor. Não existe estrela negativa: onde ela
estaria, o botão é `Conversar sobre isso` → abre rascunho.

Cada afirmação é clicável até a fonte — evento → mensagem original, com canal e dia.

### 8.3 `/feedback` — FLUXO 1 · Captura

A caixa de pendências de atenção do viewer. **Não é lista de tarefa: é o orçamento de atenção da
semana** — é aqui que o loop contínuo do PLANO.md §3.3 acontece. Três tipos de item, no máximo
três por semana, 100% roteirizado e sem LLM:

1. **Pergunta de elicitação** — sobre a Carla, com o *motivo* declarado ("a régua de senior pede
   X; o registro tem o resultado, não a articulação"). Marina responde em uma frase → confirma e
   mostra **o que exatamente entrou no registro**
2. **Reconhecimento sugerido** — `Rascunhar` → rascunho **com a evidência citada** → edita → envia
3. **Feedback devido** — quem está há mais tempo sem retorno

Rodapé fixo: `Você usou 2 de 2 perguntas desta semana. Próxima, segunda.` — o **orçamento de
pergunta** (decisão #11) virando pixel. Vale 30 segundos de vídeo.

Cabeçalho: `Nenhum campo para preencher. 0 formulários.`

E **silêncio é saída válida**: sem item, a tela diz isso em vez de inventar pendência.

### 8.4 `/diretrizes` — SETUP · só admin

O conteúdo **fixo** que a empresa define. Sem isso o agente não tem contra o que comparar, e
evidência vira diário. Só `admin`: é doutrina da empresa, não conteúdo de gestor individual.

> Os **procedimentos** do agente (as skills) não vivem aqui — são perfil do Brain, não doutrina
> da empresa. Tela separada, mais adiante.

Quatro documentos, agrupados pela pergunta que respondem:

| Documento | Responde | Formato | O Brain usa para |
|---|---|---|---|
| **Régua de carreira** | O que esperamos em cada nível | Estruturado, `regua.ts` | Comparar evidência contra expectativa. **O único que produz veredito** |
| **Cultura e tom** | Como a gente fala | `doutrina/cultura.md` | Governar o tom. Nunca avaliação (decisão #9) |
| **Contexto do ciclo** | O que importa agora | `.md`, **com validade** | Ponderar o que conta como impacto neste semestre |
| **Política de decisão** | Quem decide, quando | `.md` | Saber que dinheiro é anual e promoção é quando estiver pronta |

Cada documento declara, na ficha, **o que o Brain faz com ele e o que não faz**. É o campo que
separa isto de um wiki: o de cultura dizer *"não é critério de avaliação"* responde antes da
pergunta, e responde no documento, não numa fala de vídeo.

**Três modos de entrada**, e o terceiro é o que interessa: escrever no produto · subir arquivo ·
**derivar da evidência**. O terceiro não é exclusivo da régua — qualquer documento pode ter
sugestão pendente. Aceitar muda o documento na sessão; é o loop de aprovação de N5 fechando.

`/diretrizes/regua` é a única com visão rica: trilha × nível, comportamento a comportamento com
o observável de cada um, e o card de **régua viva** ancorado no nível onde a evidência apareceu.

**Subir arquivo é encenação, e declarada:** o fluxo mostra arquivo → o Brain propõe a estrutura →
o humano revisa, e o rodapé diz que nada é enviado nem persistido (#33).

### 8.5 `/integrations` — SETUP

Fontes conectadas (Slack, GitHub, Google Workspace, HRIS, CRM) — é aqui que o Slack aparece, como
o que ele é: uma fonte que alimenta o grafo. Abaixo, as disponíveis para conectar.

Cada fonte abre um detalhe que separa **o que entra no registro** do **que fica de fora**, com os
escopos OAuth concedidos. É ali que o modelo de confiança deixa de ser parágrafo e vira coisa que
o avaliador **vê** — no Slack: entram canais públicos e threads; ficam de fora DMs, canais
privados, horário online, tempo de resposta e volume de mensagens.

> **Removido em 01/08:** havia uma seção "não capturamos" no rodapé da página, listando o mesmo
> em nível global. Saiu por não pertencer a uma tela de integrações — a informação já vive no
> detalhe de cada fonte, que é onde um produto de verdade a colocaria.

---

## 9. Copy pré-escrita

Todo texto "gerado pela IA" nos fluxos 1 e 3 mora em `data/roteiros.ts`. Escrito offline, com IA,
e **revisado à mão**. Dois motivos: a cópia fica excelente em vez de mediana, e é idêntica em
todas as tomadas.

O chat é a exceção — lá é ao vivo, por desenho.

---

## 10. Segurança de demo

O chat é a única coisa não-determinística e está na câmera.

- `temperature: 0.2`
- Tool-first: o prompt instrui a **sempre** consultar a memória antes de afirmar; sem tool, não afirma
- Chips de pergunta sugerida = fallback que parece feature
- Ensaiar as perguntas exatas que serão digitadas
- **Botão `Reiniciar demo`** no shell: zera estrelas dadas, lacunas respondidas e feedbacks
  enviados. Refazer uma tomada tem que custar um clique.
- Sem streaming lento: se a resposta demorar mais de ~3s pra começar, cortar tamanho de contexto

---

## 11. Ambiente e deploy

```
ANTHROPIC_API_KEY=      # só no server, nunca NEXT_PUBLIC_
AI_PROVIDER=anthropic
AI_MODEL=claude-...
```

Chamada de modelo só em `/api/chat/route.ts`. Deploy contínuo na Vercel, link único.
Sem auth — o protótipo é público e não contém dado real de ninguém.

---

## 12. Protótipo × produção

Pra responder na hora se a liderança perguntar "como isso funcionaria de verdade?".

| | No protótipo | Na produção |
|---|---|---|
| Ingestão | Eventos escritos à mão | Conectores + fila de eventos |
| Extração de episódio | Pré-agrupado | Clusterização + LLM sobre janelas |
| Recuperação | Tools sobre módulos tipados | Mesma interface de tool, sobre store real (híbrido vetorial + estruturado) |
| Detecção de lacuna | Lista curada | Modelo de valor da informação sobre a régua × cobertura |
| Skills | `.md` no repo | **Iguais** — `.md` versionados por cliente, editados pelo FDE e pelo RH |
| Régua viva | Card estático | Job trimestral que deriva de coorte por nível e **propõe diff no arquivo de skill** |
| Permissão | `permissoes.ts` | Mesma forma, com org chart do HRIS |
| Estado | Memória do browser | Postgres + trilha de auditoria (relevante pro ângulo trabalhista) |

**A interface das tools é a mesma nos dois.** É o que torna o protótipo uma maquete honesta e não
uma encenação.

---

## 13. Ordem de construção

**Produto funcional primeiro, conteúdo depois.** Escrever 200 eventos antes de existir tela é
escrever no escuro: metade não renderiza em lugar nenhum, faltam campos que só aparecem quando o
componente existe, e a UI evolui durante o build fazendo o dataset derivar. O conteúdo escrito no
fim, sabendo todos os lugares onde aparece, sai **mais** coerente.

> **Decidido em 01/08:** o dataset completo do elenco é a *última* coisa a ser feita — depois de
> todas as telas prontas, não em paralelo. Até lá o seed mínimo da Fase A basta, e questão de
> elenco levantada durante a Fase B se anota, não se discute.

E o modo de falha é o argumento que decide: se o tempo estourar com conteúdo-primeiro, você tem
200 eventos lindos e metade das telas — demo quebrada. Com produto-primeiro, você tem todas as
telas com 4 pessoas em vez de 8 — demo enxuta, mas inteira.

### Fase A — esqueleto

| # | Passo |
|---|---|
| 1 | Tipos da §5.1 + **seed mínimo** (1 gestora, 3 reports, ~15 eventos, 4 episódios, 1 tema, 2 lacunas) + `validar.ts` |

> **O seed tem que conter um de cada caso difícil, não três do caso fácil:** uma pessoa de
> densidade baixa, uma lacuna aberta, um episódio sem estrela, um caso de recusa. Semente só de
> happy path faz os componentes ignorarem os estados interessantes — e aí retrabalho no fim.

### Fase B — produto funcional

> **Reordenado em 01/08 — Setup antes do agente.** A ordem anterior deixava a régua no fim, o
> que significava construir o agente contra uma régua stub: ele não teria contra o que comparar
> justamente na tarefa que mais importa. Setup primeiro corrige isso.

| # | Passo | Por quê nessa ordem |
|---|---|---|
| 2 | Shell: sidebar + seletor de persona + reset + `/org` (a lista) | Infra de todas as telas — e a lista de pessoas já é a permissão visível |
| 3 | `/integrations` | Barata; é onde o Slack aparece como fonte, e a lista do que **não** é capturado já entrega o modelo de confiança |
| 4 | `/diretrizes` + `/diretrizes/regua`, com o loop de aprovação | O agente precisa dela **pronta** para comparar. Sem persistência: a régua vive em `.ts` e o que a tela prova é o loop, não o upload (§5.4) |
| 5 | `/feedback` — só o layout | Congela o visual do fluxo 1. A interação volta depois que o agente existir |
| 6 | `lib/agente/` + tools + permissões + `renderizar` + skills + painel de chat | **Aqui se decide Eve × AI SDK** (§2.1). Fluxo 2 |
| 7 | `/org/[id]` — dossiê nos dois papéis, com chat embutido | Consome os componentes do passo 6 e **fixa o modelo de dados** antes do dataset |
| 8 | Dataset completo da Aurora | Escrito sabendo todos os lugares onde aparece |
| 9 | Diagnóstico de organização dentro de `/org` | Fluxo 3. Só é crível com o dataset cheio — "gargalo de 6 pessoas" não existe com 4 |

> Os passos 8 e 9 acima eram a antiga Fase C. O dataset deixou de ser uma fase separada porque
> depende do dossiê estar montado — ver a nota de reordenação.

### Fase C — conteúdo

| # | Passo |
|---|---|
| 10 | `skills/` e `doutrina/` completos + régua das 2 trilhas × 3 níveis |
| 11 | Passada de copy nos `roteiros.ts` (§9) |

### Fase D — fechamento

| # | Passo |
|---|---|
| 12 | [TESTES-CHAT.md](TESTES-CHAT.md) — 26 casos adversariais |
| 13 | Deploy + ensaio + ajuste |

> **O risco desta ordem, declarado:** o conteúdo é o que faz a demo boa e é o último a ser feito —
> logo, é o primeiro a ser espremido se a Fase B travar. **Se a Fase B travar, corte tela, nunca
> conteúdo.** Produto funcionando com conteúdo raso é demo de UI; com conteúdo rico é demo de
> produto. Ordem de corte: `/diretrizes` (vira screenshot no vídeo) → itens 2 e 3 do `/feedback`
> (mantém a pergunta de elicitação) → componentes de 8 pra 5.

---

## 14. Não-objetivos

Registrados pra não haver dúvida durante o build: sem auth, sem banco, sem persistência entre
reloads, sem integrações reais, sem mobile, sem testes além do validador de dados, sem
onboarding, sem tratamento de erro além de um fallback amigável no chat, sem i18n — **tudo em
PT-BR**.
