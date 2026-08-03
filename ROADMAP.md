# People Brain — Roadmap

> Doc de acompanhamento. [PLANO.md](PLANO.md) = tese. [ARQUITETURA.md](ARQUITETURA.md) = spec de build.
> Este aqui = **estado, decisões e o caminho até a submissão.**
> A sequência detalhada de build vive em ARQUITETURA.md §13 — não duplicar aqui.

**Kickoff:** 30/07/2026 (qui) · **Entrega combinada com a Comp: segunda, 03/08/2026.**

---

## 1. Status

| Frente | Estado |
|---|---|
| Tese e narrativa | ✅ fechada — PLANO.md |
| Arquitetura | ✅ fechada — ARQUITETURA.md |
| Build | ✅ Fase B completa — passos 2 a 9 |
| Conteúdo (dataset, skills, régua) | ✅ 12 pessoas · 76 eventos · 20 episódios · 7 skills |
| Vídeo | ⬜ não iniciado |
| AI Appendix | 🟡 log correndo — §6 |
| Alinhamento de data com a Comp | ✅ feito — entrega segunda 03/08 |

---

## 2. O que a Comp recebe

- [ ] **Vídeo** 8–15 min (link Loom ou similar)
- [ ] **Protótipo navegável** (link Vercel)
- [ ] **AI Appendix** — transcript completo + como usei IA + onde ela errou + o que eu sobrescrevi
- [ ] **E-mail** de submissão para os dois contatos da Comp

---

## 3. Fases

> **A folga vai para profundidade do escopo existente, nunca para escopo novo.** O case pune
> amplitude ("2–3 fluxos profundos ganham de 10 rasos") e lista "features sem dizer para quem"
> entre os erros comuns. Onde a folga rende, em ordem: **1.** dataset mais rico · **2.** skills que
> leiam como doutrina real de gestão · **3.** ensaio de vídeo descartado · **4.** teste adversarial
> do chat.

### D0 · qui 30/07 — esqueleto
- [x] Alinhamento de data com a Comp
- [x] Repo + Next.js 16 + Tailwind 4 + shadcn (base radix, 15 componentes)
- [ ] Deploy vazio na Vercel (garante que o link existe cedo) — **pendente: precisa da conta do Marcos**
- [x] **Passo 1** — tipos §5.1 + seed mínimo + `validar.ts` no `prebuild`

### D1 · sex 31/07 — produto funcional — ARQUITETURA.md §13 Fase B
> **Ordem revista em 01/08 — Setup antes do agente.** Ver decisão #32.

- [x] 2 · Shell (sidebar + seletor de persona + reset) + `/org` — a lista
- [x] 3 · `/integrations` — mock completo
- [x] 4 · `/diretrizes` (admin) ponta a ponta, com o loop de aprovação
- [x] 5 · `/feedback` — só o layout
- [x] 6 · `lib/agente/` + tools + permissões + `renderizar` + skills + painel de chat — **fluxo 2**
  - [x] **Eve escolhido** — decisão #34
- [x] 7 · `/org/[id]` nos dois papéis, com chat embutido
- [x] 8 · Dataset completo da Aurora
- [x] 9 · Diagnóstico org dentro de `/org` — **fluxo 3**

### D2 · sáb 01/08 — conteúdo + primeira tomada
- [ ] 9 · Dataset completo da Aurora — **não cortar**
- [ ] 10 · `skills/` + `doutrina/` + régua das 2 trilhas
- [ ] 11 · Passada de copy nos roteiros
- [ ] 12 · Deploy final
- [x] 13 · **Teste adversarial do chat** → [TESTES-CHAT.md](TESTES-CHAT.md) (26 casos) — rodado
      em 02/08. Primeira passada: 13 ✅ · 10 ⚠️ · 3 ❌. Depois dos consertos: 25 ✅ · 1 ⚠️ · 0 ❌
- [ ] 14 · Roteirizar o vídeo a partir de PLANO.md §11
- [ ] 15 · **Tomada de ensaio, para descartar**

### D3 · dom 02/08 — assistir, ajustar, gravar
- [ ] 16 · Assistir o ensaio e anotar o que não ficou claro
- [ ] 17 · Ajustes de copy e de tela apontados pelo ensaio
- [ ] 18 · **Gravação final**
- [ ] 19 · Edição leve
- [ ] 20 · Fechar AI Appendix a partir do §6 daqui + exportar transcript

### D4 · seg 03/08 — entrega
- [ ] 21 · Revisão final dos links (protótipo público? vídeo acessível?)
- [ ] 22 · Enviar

---

## 4. Alavancas de corte

Plano de contingência, caso a Fase B trave em algum problema técnico. Em ordem — cortar de cima
pra baixo dói menos.

1. **`/diretrizes`** vira screenshot no vídeo
2. **Itens 2 e 3 do `/feedback`** — mantém a pergunta de elicitação e o orçamento
3. **Componentes de render: 8 → 5**
4. **Elenco: 8 → 6 pessoas**

**Nunca cortar:** dataset da Aurora, o loop de elicitação com orçamento de pergunta declarado, o
momento de recusa da IA, o diagnóstico de organização, e a **tomada de ensaio descartada**. São os
cinco que carregam tese ou clareza.

---

## 5. Registro de decisões

Fechadas. Não relitigar sem motivo novo. **↩︎ = reversão durante a discussão** (material do AI Appendix).

### Produto e tese
| # | Decisão | Por quê |
|---|---|---|
| 1 | **Não matar o ciclo — matar o formulário** | "Acabe com ciclos" já falhou (Adobe/GE/Deloitte) e não responde "como decido promoção em novembro?" |
| 2 | Separar coaching / alinhamento / julgamento | Cadências ótimas opostas fundidas num ritual só |
| 3 | Dinheiro é anual; promoção é quando estiver pronta | Orçamento é restrição real; prontidão não |
| 4 | Sem arquivo secreto | Espinha moral **e** maior driver de qualidade de dado |
| 5 | IA **pontua comportamento contra a régua**; não pontua a pessoa, não ordena, não mede cultura, não decide | Ler trabalho observável contra um nível escrito é o que ela faz melhor que o gestor, e a nota é contagem com regra publicada — auditável, ao contrário do parágrafo de memória. Escalar de pessoa, rating relativo e leitura de valores é que fabricam avaliação infalsificável. Ver #37 |
| 6 | Estrela marca o **episódio**, não a pessoa | Marcar momento é rótulo de treino — e entra na conta da régua como parcela ("houve reconhecimento"), em vez de driblá-la. O que #5 proíbe é número que resuma a pessoa, e episódio marcado não produz isso |
| 7 | **Não existe estrela negativa** | Reconhecimento pode ser clique; preocupação tem que ser conversa. Dossiê de demérito é passivo trabalhista |
| 8 | Setup é loop, com régua derivada de evidência | Régua congelada morre; é o mecanismo de N5 |
| 9 | Cultura governa **tom**, nunca avaliação | Avaliar contra valores = política infalsificável |
| 10 | Diagnóstico de organização é output de 1ª classe | "Dados é gargalo" > "o Rafa é lento" |
| 11 | Orçamento de pergunta: 2/sem gestor, 1/sem IC | O recurso escasso é o direito de perguntar |
| 12 | Sem 360; par só sobre artefato que ambos tocaram | 360 é a carga que estamos matando |
| 13 | Chat responde sobre trabalho; recusa sobre estado | Ela não sabe — fingir seria o produto de vigilância |
| 14 | Nome: **People Brain** · *"O Brain lembra. As pessoas decidem."* | O nome é o reframe. Depois da #37 o tagline fica **mais** literal, não menos: o Brain lembra e pontua comportamento contra a régua; nível, promoção e mérito continuam sendo decisão de gente. Ele já não serve para neutralizar "a máquina julga" — a máquina julga comportamento, por decisão declarada, e o tagline diz onde ela para |
| 37 | ↩︎ **A IA pontua comportamento contra a régua** (02/08) | Reversão da linha vermelha "a IA nunca pontua". Registro completo em §5.1 |

### Arquitetura
| # | Decisão | Por quê |
|---|---|---|
| 15 | Next.js + Vercel; sem banco, sem auth, sem persistência | Protótipo descartável |
| 16 | **Sem sandbox** | Sandbox resolve execução; o problema aqui é recuperação |
| 17 | **Sem Composio/MCP real** → tela fake de integração | Dado é falso de qualquer jeito; mock rico > pipe real com 3 mensagens |
| 18 | ↩︎ **Gen UI sim**, com componentes registrados | Beleza com tese ganha de tese sozinha. Meu "não" original era fraco |
| 19 | ↩︎ **Tool é acesso; skill é procedimento** | `prepararReuniao` como função = codificar julgamento à mão |
| 20 | A skill governa qual componente renderiza | Setup do cliente controla até a forma da resposta |
| 21 | Permissão em **código**, não prompt | Regra só no prompt é contornável ao vivo |
| 22 | Um componente só pro dossiê, dois observadores | "Sem arquivo secreto" vira fato demonstrável |
| 23 | Dados em `.ts` tipado + validador no prebuild | Contradição no elenco é o único erro fatal da gravação |
| 24 | Eve atrás de fachada, timebox 45 min | Framework novo em prazo curto = unknown unknowns |
| 25 | ↩︎ **UI primeiro, conteúdo depois** | Modo de falha gracioso vs. demo quebrada |
| 26 | ↩︎ **Sem mock de Slack. Morre o `/slack`** | Slack é *fonte*, não superfície: entra pelo grafo de conhecimento e aparece em `/integrations`. Imitar a casca de outro produto faz o Brain parecer um bot de Slack |
| 27 | O fluxo 1 muda de casa: vai para **`/feedback`** | O mecanismo é o que importa — elicitação com motivo, orçamento de pergunta, rascunho com evidência. A superfície era acidente |
| 28 | O diagnóstico de organização vai para **`/org`** | Afirmação sobre a organização mora na tela da organização, não no fim de um ciclo. Reforça a decisão #10 |
| 29 | **Chat é painel, não rota** | A pergunta nasce olhando outra tela. Histórico na sidebar |
| 30 | **`/diretrizes` é só admin** | É doutrina da empresa, não conteúdo de gestor individual |
| 31 | **Dataset do elenco é a última etapa** | Decidido em 01/08. Conteúdo antes das telas é escrever no escuro — mesmo argumento da #25, aplicado ao cronograma |
| 32 | **Setup antes do agente**: integrações → régua → feedback → agente → dossiê → dataset → diagnóstico | A ordem anterior construía o agente contra uma régua stub, justamente na tarefa que mais importa. E o dossiê vem antes do dataset porque é a tela com mais campos: é ela que revela o que falta no modelo |
| 34 | **Eve, não AI SDK** | Skill como markdown carregado sob demanda e tool como função tipada são o modelo nativo do framework — as decisões #19 e #20 viraram estrutura de pastas. E o `AuthFn` do canal resolve o viewer antes do modelo entrar no turno, o que mantém a #21 sem gambiarra |
| 35 | **`clientContext` do Eve é proibido para identidade** | Ele injeta mensagem de usuário no prompt. Viewer vai por header → `AuthFn` → `ctx.session.auth` |
| 36 | **O dossiê não é pré-renderizado** | Com SSG, o HTML inicial entregava o registro de todo mundo antes da permissão rodar. Num protótipo cuja tese é "permissão é código", view-source derrubaria a demonstração |
| 33 | **A régua não tem upload de verdade** | Sem persistência (#15), arquivo que some no reload é armadilha na gravação. O que a tela prova é o **loop de aprovação** da régua viva — que é o mecanismo de N5, e vale mais que um seletor de arquivo |

### 5.1 A decisão #37, por extenso — 02/08/2026

A maior reversão de doutrina do projeto, e a única que atravessou os cinco documentos.

**O que mudou.** A IA **pontua comportamento contra a régua**, de 1 a 5, com a evidência anexada
e clicável até a fonte. Antes a doutrina dizia que ela nunca pontuava.

**O raciocínio do dono do produto, nas palavras dele:**

> *"Essa ideia da IA não dar nota é fraca, eu não gosto dela, a pessoa quer agilidade, se uma
> pessoa tem evidências claras de uma skill, a IA deveria pontuar a skill daquela pessoa."*

**A alternativa recusada.** A IA preencher apenas o estado da evidência — sustentado / parcial /
sem evidência — e o humano pôr o veredito. Ele foi advertido de que isso colidia com a linha
vermelha declarada e reafirmou a decisão. Não relitigar.

**O limite que permanece, e que não foi afrouxado em lugar nenhum:** a **pessoa como escalar não
existe**. Sem nota da pessoa, sem rating geral, sem ranking, sem curva, sem leaderboard, e sem
campo no modelo de dados onde qualquer uma dessas coisas caberia. A IA continua sem recomendar
desligamento e sem responder sobre estado das pessoas. Nível, promoção e mérito continuam sendo
decisão humana.

**O argumento que sustenta a doutrina nova** já estava escrito no código, em `lib/metricas.ts`:
a nota **não é opinião com um número na frente, é contagem com regra publicada** — episódios
distintos, firmeza do padrão, reconhecimento, trabalho acima do cargo. Por isso ela é clicável
até a fonte. Um gestor pode discordar da regra; não pode dizer que não sabe de onde o 4 veio.
E a mesma função guarda a distinção que impede a doutrina nova de virar vigilância: **zero
episódio devolve `undefined`, não 1.** Nota 1 afirma que a pessoa é fraca naquilo; "sem
evidência" afirma que o registro não alcançou.

**O que mudou em cada documento:**

| Documento | Onde | O que passou a dizer |
|---|---|---|
| `PLANO.md` | §2, princípio 5 | Deixou de ser "a IA lê skill" e virou "a IA **pontua** comportamento contra a régua", com a regra de contagem e a distinção nota-baixa × sem-evidência declaradas. As linhas vermelhas viraram quatro — entrou "não pontua a pessoa" |
| `PLANO.md` | §2, sobre o gestor | O papel de juiz virou dois: avaliar contra a régua (transferível) e decidir (não) |
| `PLANO.md` | §3.1 | A régua deixou de ser contexto do julgamento e virou o julgamento: é contra ela que a IA pontua |
| `PLANO.md` | §3.3, a estrela | Caiu "não máquina pontuando gente". A estrela é **parcela** da nota, não desvio dela |
| `PLANO.md` | §5, decisões visíveis | "Nenhum número de 1 a 5 pela IA" virou "o número é do comportamento, e abre na evidência" |
| `PLANO.md` | §6, não-construídos | "Score/rating de pessoa gerado por IA" virou "a pessoa como escalar". O argumento de LGPD foi invertido: nota com regra publicada é mais auditável que parágrafo de memória |
| `PLANO.md` | §7, trade-offs 4 e 7 | Perguntar e julgar deixaram de ser excludentes; o benchmark das 23h passou a argumentar **a favor** da nota |
| `JORNADAS.md` | §0, regra 4 | **Decisão explícita:** não existe nota em rascunho. A pontuação da IA é visível para a pessoa desde sempre — nota que só aparece no fechamento é arquivo secreto com data marcada |
| `JORNADAS.md` | G5 | A segunda escala (Referência/Consistente/Parcial/Sem evidência) foi **eliminada**. Ficou a que o código calcula: `nivel` × `esperado` de 1 a 5, com a palavra derivada dos dois |
| `JORNADAS.md` | C2 | "Aqui ela vê evidência, não nota" virou "ela vê a mesma nota que a gestora vê" |
| `ARQUITETURA.md` | §5.1 | `ComportamentoRegua` ganhou `rotulo` e `esperado: 1..5` com a escala publicada — sem isso o spec descrevia um sistema que não pontua |
| `ARQUITETURA.md` | §6.4 e §6.5 | `lerRegua` documentada com `pessoaId` e como a tool que emite o veredito; `comparar-com-regua` como skill de veredito, não de estado de evidência |
| `ARQUITETURA.md` | §7.4 | Passou a ser o lugar do argumento: nota é contagem com regra publicada, e `undefined` ≠ 1 |
| `doutrina/politica-de-decisao.md` | "O que o comitê não faz" | "Não atribui nota" virou "**não atribui nota à pessoa**", com o escopo fechado dentro da própria frase. É lido pelo agente em runtime, e a ambiguidade fazia ele concluir que nota não existe neste produto |
| `agent/instructions.md` e `agent/skills/comparar-com-regua.md` | — | Já estavam do lado novo antes desta passada: o modelo pontua, copia os números da tool sem recalcular, e omite o campo em vez de escrever 1 |

### 5.2 A segunda passada — o que duas críticas acharam na reescrita (02/08)

Duas revisões independentes: uma perguntando **o que se perdeu**, outra simulando **se o agente
obedeceria em execução**. A segunda achou mais, e achou pior — a doutrina tinha sido reescrita e a
camada que roda na câmera, não.

**O erro de método, e é o mesmo dos dois lados.** Reescrever os princípios que falam de nota, e não
os que a nota mudou por tabela. "Separe o treinador do juiz" não menciona nota em lugar nenhum e
ficou falso assim mesmo, porque a estrela — gesto do loop de coaching — virou parcela do veredito.
O mesmo com o trade-off 1: ele foi escrito para um mundo onde rastro fino produzia silêncio, e
agora produz um 1.

| Documento | O que passou a dizer |
|---|---|
| `agent/instructions.md` · identidade | "Memória e organização… o julgamento é humano, sempre" virou "memória e **leitura de trabalho**… a leitura é sua; o que é humano é a **decisão**". A frase antiga estava no lugar de maior saliência do prompt e era a linha de recuo pronta para o modelo hedgear sob pressão |
| `agent/instructions.md` · escalar | Entrou a proibição que não existia em runtime: **não existe número que resuma uma pessoa**, e média das notas da régua não cria esse dado. A frase morava só em `politica-de-decisao.md`, que ninguém carrega para responder um pedido de nota |
| `agent/instructions.md` · ranking | A oferta "as duas leituras lado a lado" virou **uma leitura por resposta**. Ela foi escrita quando lado a lado era prosa; com número, doze teias na mesma tela se ordenam sozinhas — o ranking entrando pela porta que a recusa abriu |
| `agent/instructions.md` · densidade e contexto | Nota baixa é primeiro afirmação sobre o **registro**; contexto do semestre entra na leitura, nunca na conta |
| `agent/skills/comparar-com-regua.md` | Quatro consertos: o nível deixou de ser fixo no alvo (o fechamento pede o ocupado); a `situacao` é copiada e **não** é contagem de episódio; a regra das quatro parcelas e a escala entraram por escrito, para "por que 4 e não 5?" ter resposta; e entrou a seção da **discordância** — pedir o episódio, não reescrever o número |
| `agent/skills/montar-caso-de-promocao.md` e `identificar-lacunas.md` | `ler_regua` **com `pessoaId`**. Sem ele a tool devolve a régua crua, e as duas skills mandavam o modelo derivar de cabeça o que a tool calcula — o caso de promoção e a teia da mesma Carla sairiam com números diferentes |
| `PLANO.md` · §2 princípio 3 | "Duas superfícies, duas regras de visibilidade" virou "**duas cadências, uma leitura só**". O que separa os loops não é visibilidade — é o que cada um produz. O que nunca atravessa é o teor da correção; o reconhecimento atravessa de propósito |
| `PLANO.md` · §2 princípio 6 | Entrou a **ordem**: o diagnóstico de organização é lido antes das leituras individuais. Diagnóstico depois do veredito é errata |
| `PLANO.md` · §2.5 | "Zero episódio não é nota 1" virou "**sem evidência está fora da escala**", e entrou o que faltava: o degrau de baixo também é contagem, e o que autoriza lê-lo como afirmação sobre o trabalho é densidade alta |
| `PLANO.md` · §3.3 guarda 1 | A estrela vale ponto, então a guarda ficou mais dura que "não some estrelas": +1 num teto de 5, só onde já há episódio, visível com autor e data, e taxa por gestor é sinal de qualidade do ciclo |
| `PLANO.md` · §3.3 guarda 2 | Entrou a resposta à objeção do dossiê de deméritos: **nenhuma parcela subtrai**. A nota não tem autor humano, só sobe, e a pessoa a vê no mesmo instante |
| `PLANO.md` · §7 trade-off 1 | Reencostado: rastro fino não produz mais registro incompleto, produz 1 ou 2 contra um esperado 4. A mitigação virou regra de leitura com densidade colada no número |
| `JORNADAS.md` · §0 regra 4 | A janela do fechamento ficou escrita: o que o gestor vê antes dela é **o que ele mesmo está escrevendo**. Rascunho escondido é leitura que ela não vê; decisão em curso é outra coisa |
| `JORNADAS.md` · G3 | O botão de reconhecer **declara que vale +1**. Gesto que altera avaliação sem avisar quem clica é armadilha |
| `JORNADAS.md` · G5 | As parcelas passaram a dizer em que cada uma abre, inclusive as duas que param num objeto do Brain antes do artefato. E `Discordo` inverteu a ordem: a evidência move a nota, não o clique |
| `doutrina/contexto-do-semestre.md` | Ganhou a seção "onde o contexto entra, já que ele não entra na conta" — é lido em runtime e era o único documento que prometia contexto sem dizer por onde |
| `doutrina/politica-de-decisao.md` | O comitê lê nota e densidade juntas. Nota sem densidade é número sem denominador |
| `TESTES-CHAT.md` | Casos 8 e 10 voltaram para ↻, e entrou o bloco **F** com os cinco casos que a nota abriu e ninguém rodou |

---

## 6. Log do AI Appendix

O case pede **onde a IA errou** e **o que você verificou/sobrescreveu**. Anotar em tempo real —
reconstruir de memória no fim é como preencher formulário semestral, e a ironia seria péssima.

### Onde o Claude errou ou me levou pro lado errado

| # | O erro | Como eu percebi | Correção |
|---|---|---|---|
| 1 | Arquitetura inicial assumiu que **toda evidência está no rastro digital** | Eu tinha visto na prática que falta contexto que não vive em app nenhum | Nasceu o loop de elicitação — a IA pergunta pra fechar lacunas |
| 2 | Promoveu "atenção" a camada primitiva | Atenção é aplicação de lembrar + perguntar, não primitiva | Rearquitetura em verbos, depois em 4 fases |
| 3 | **Faltou a fase de Setup inteira** — sem régua, evidência é diário | Eu apontei que a IA precisa saber o que a empresa espera pra avaliar | Setup virou a fase 1, e virou loop |
| 4 | Traduziu minha palavra **"skills"** para "arquivos de dados" | Percebi ao revisar a arquitetura: `prepararReuniao` estava como tool | Skills viraram markdown executável = Setup em forma executável |
| 5 | Argumentou contra Gen UI usando *"eles não avaliam polimento visual"* | Isso é piso, não teto — e o critério 3 avalia se dá pra entender pelo protótipo | Reverteu; entrou Gen UI com componentes registrados |
| 6 | Propôs **conteúdo antes de UI** | Escrever 200 eventos sem tela = escrever no escuro, e o dataset deriva | Reverteu para UI-first |
| 7 | Invocou uma skill chamada `estrategista-de-caso` que era de análise **jurídica** | Óbvio no output | Descartada sem uso |
| 8 | **A camada generativa inteira estava morta e ninguém tinha notado.** `renderizar` recebia `payload` como string JSON, o zod recusava, e o fallback para prosa era tão gracioso que a tela parecia funcionar | Só apareceu rodando os 26 casos de [TESTES-CHAT.md](TESTES-CHAT.md) e lendo os eventos de tool: **14 chamadas, 14 falhas**. Em quatro respostas o Brain chegou a escrever "a renderização falhou" para o usuário | `validar` aceita string; a tool descreve o formato de cada componente; e o fallback manda responder sem mencionar o erro. **Lição: modo de falha gracioso demais esconde a falha** |
| 9 | **O agente não sabia quem estava perguntando.** A permissão em código funcionava perfeitamente, e o modelo nunca foi informado da identidade que as tools já usavam | Como Carla, "o que a Marina escreveu sobre mim?" devolvia *"qual é o seu nome?"* — a pergunta que o produto inteiro existe para não precisar fazer | `agent/instructions/observador.ts`, instrução dinâmica resolvida no `session.started`. A decisão #35 tinha barrado o `clientContext` e ninguém perguntou por onde a identidade *deveria* chegar |
| 10 | **O seletor de persona não chegava ao chat.** `useEveAgent({headers: () => …})` lê `headers` uma vez, na criação do store, e a closure congelava o viewer do primeiro render | Interceptando o `fetch` no navegador: com o seletor em Carla, o request saía com `helena`. O chat inteiro respondia como CHRO, com acesso às 12 pessoas | Painel remonta com `key={viewer.pessoaId}`. É o que a doc do eve manda fazer, e estava na doc |
| 11 | **A linha vermelha mais citada do projeto já tinha sido cruzada pelo próprio código, e a doutrina não notou.** PLANO.md §5 afirmava "em nenhuma tela existe um número de 1 a 5 atribuído a uma pessoa pela IA" enquanto `lib/metricas.ts pontuar()` devolvia exatamente isso, alimentando a teia do dossiê e o `Gap` do chat. A doutrina escrita ficou três dias atrás do produto construído, e nenhuma das duas passadas de revisão pegou | Só apareceu quando **eu** decidi que a IA deveria pontuar e mandei varrer o repo atrás das colisões — a varredura achou a contradição em 17 pontos, incluindo uma frase dita como fato demonstrável na câmera | Reversão #37, em §5.1. **Lição: o argumento que faltava para a doutrina nova estava escrito no comentário da função que a violava** — "nota é contagem com regra publicada, não opinião com um número na frente". O código tinha razão antes do documento |
| 12 | Um documento lido em runtime ficou **ambíguo sem mudar uma palavra.** `doutrina/politica-de-decisao.md` dizia "Não atribui nota. Não ordena pessoas em curva. Não discute potencial" — um tricolon sob o cabeçalho "O que o comitê não faz". Sob a doutrina antiga, a leitura estreita (o comitê) e a leitura global (o produto) davam no mesmo. Depois da #37, divergiram | Levantado na varredura, não na execução: `montar-caso-de-promocao.md` manda ler esse documento na primeira rodada, e o modelo poderia concluir no meio de um caso de promoção que nota não existe neste produto — e recusar, na câmera | Escopo fechado dentro da própria frase, sem depender do cabeçalho. **Lição: frase que só é correta por causa do título da seção é frase que quebra quando a doutrina em volta muda** |
| 13 | **A reescrita da #37 consertou os documentos que falavam de nota e deixou intactos os que a nota tinha mudado por tabela.** "Separe o treinador do juiz" não cita nota em lugar nenhum e virou falso mesmo assim: a estrela é gesto do loop de coaching e virou parcela do veredito, então coaching passou a entrar em calibração por aritmética — exatamente o que a consequência de produto do princípio proibia. O mesmo com o trade-off 1 (rastro fino deixou de produzir silêncio e passou a produzir 1) e com a guarda "estrela não é ranking", que virou a melhor objeção disponível ao parágrafo três linhas acima dela | Duas críticas independentes, uma perguntando o que se perdeu e outra simulando o agente em execução. Nenhuma das duas era sobre os documentos que a passada anterior tinha aberto | §5.2. **Lição: o alvo de uma reescrita de doutrina não é onde a palavra aparece, é onde a decisão bate** |
| 14 | **A camada operacional foi declarada "já do lado novo" e não foi lida.** A linha registrada na tabela da #37 diz que `agent/instructions.md` e `comparar-com-regua.md` já estavam corretos. Estavam pela metade: o prompt abria com *"Memória e organização… o julgamento é humano, sempre"* como **identidade**, quarenta linhas antes de *"você avalia skill contra a régua"* — a versão antiga no lugar de maior saliência, e a frase pronta para o modelo recuar diante de um gestor que discorda. E não existia, em nenhum texto lido em runtime, a proibição do escalar de pessoa: com quatro números de 1 a 5 na mesa, a média não é dado inventado, é aritmética | Simulação dos pedidos que a gestora faz na câmera — "avalie com nota", "por que 4 e não 5", "ajuste isso", "dá uma nota geral" | §5.2. **Lição: "esse arquivo já está certo" é uma afirmação sobre memória, e memória é o que este produto existe para não usar** |

### O que eu verifiquei / sobrescrevi
| # | O quê |
|---|---|
| 1 | Mandei ler o **AI Maturity Map da Comp** em vez de assumir o que "AI-native" significa pra eles — daí saiu o mapeamento N3→N4→N5 e o critério "o loop de aprovação precisa fechar" |
| 2 | Sobrescrevi a arquitetura de camadas duas vezes (elicitação; depois 4 fases) |
| 3 | Sobrescrevi a decisão de Gen UI e a ordem de build |
| 4 | Mantive a recusa dele quanto a sandbox e Composio depois de ouvir o argumento — concordei, não cedi |
| 5 | Mandei **rodar** os 26 casos adversariais em vez de aceitar "o chat está funcionando". Três bugs que a leitura de código não pegou (#8, #9, #10 acima) só apareceram na execução — dois deles quebravam a tese exatamente na parte que está na câmera |
| 6 | **Sobrescrevi a linha vermelha "a IA nunca pontua uma pessoa", que era minha e estava em cinco documentos.** O modelo tinha construído a doutrina inteira em cima dela e argumentou pela alternativa (IA preenche o estado da evidência, humano põe o veredito). Recusei: se há evidência clara de uma skill, a IA deveria pontuar aquela skill — a pessoa quer agilidade. Ouvi o argumento contra, mantive a decisão, e mandei reescrever a doutrina em vez de deixar produto e documento discordando. Decisão #37 |
| 7 | Mandei **varrer o repo contra a decisão nova** antes de escrever qualquer linha, em vez de editar os lugares que eu lembrava. Os dois piores achados não eram os que eu tinha em mente: uma frase de doutrina lida pelo agente **em runtime** (#12 acima) e uma segunda escala de avaliação em `JORNADAS.md` que nunca existiu no código |

### Como usei IA
- [ ] Escrever no fim: Claude Code como par de discussão estratégica → spec → build. Destacar que a **direção** (elicitação, Setup, skills, UI-first) veio de mim e a **elaboração** veio do modelo.
- [ ] Exportar o transcript completo desta sessão.

---

## 7. Em aberto

### Pendências de código que a #37 deixou — nenhuma é de doutrina, todas são de uma linha

A passada de §5.2 corrigiu só `.md`. Estas quatro estão em código e são o que sobra da decisão #37.
Em ordem de risco na gravação:

- [ ] **`lib/agente/biblioteca.ts:41` — a regra de contagem está reimplementada em prosa.** A
      descrição do enum `situacao` diz *"sustentado = dois ou mais episódios; parcial = um só;
      sem-evidencia = nenhum"*, e essa string vai para o modelo dentro do `MANUAL` da tool
      `renderizar`. `situacaoDe` calcula outra coisa: `nivel >= esperado`. Carla em influência
      (esperado 4) com dois episódios sai `parcial` pela tool e `sustentado` pela prosa — a teia e o
      `Gap` da mesma resposta discordando sobre a mesma skill. É o bug do §7.4 voltando pela porta
      da biblioteca. `comparar-com-regua.md` já manda copiar a `situacao` da tool e explicita a
      regra certa, mas isso é remendo: **a descrição do enum deveria dizer o que a função faz**, ou
      não dizer nada
- [ ] **`app/org/[id]/dossie.tsx:235` — a última frase da doutrina antiga ainda em produto.** O
      cabeçalho da seção diz *"Nada aqui mede desempenho — mede o quanto o registro alcançou"*, e a
      `Cobertura` é desenhada na linha 251, dentro dela. Está no fluxo 3, que é gravado. O que a
      frase precisa dizer está em ARQUITETURA §8.2
- [x] ~~**`agent/tools/ler_regua.ts` — a tool não devolve as parcelas.**~~ Feito com G5.
      `pontuar()` devolve `parcelas` (as quatro, inclusive as de valor 0 — são elas que respondem
      "por que 4 e não 5"), `episodioIds` e `soma`; `comportamentosCobertos` e a tool carregam tudo
      adiante, e `comparar-com-regua.md` deixou de mandar o modelo reconstruir a conta a partir de
      `ler_temas` e `ler_episodios`. Cada parcela abre na evidência que a produziu, como JORNADAS
      G5 promete — na tool e na tela de fechamento
- [ ] **`ler_doutrina` não lê a régua, e a escala só existe em comentário.** O que 1, 3, 4 e 5
      significam está em `data/regua.ts` e em JORNADAS.md, nenhum dos dois legível em runtime. Está
      escrito na skill agora, o que resolve para `comparar-com-regua` e não para as outras

### O resto

- [ ] **Eve ou AI SDK** — decidir ao chegar no passo 4. A fachada `lib/agente/` torna a troca barata
- [x] ~~Idioma do vídeo~~ — **PT-BR**
- [x] ~~Data de entrega~~ — segunda 03/08
- [x] ~~Diego Moura no elenco~~ — entra. Ver §8

---

## 8. Elenco — quem é quem

| Pessoa | Papel na narrativa |
|---|---|
| **Marina Duarte** · Eng Manager | Observadora do fluxo 1. Gestora de Carla, Rafael e Bruno |
| **Carla Nunes** · Eng, pleno→senior | Caso de promoção. Densidade **alta** |
| **Rafael Lima** · Eng senior | Duas entregas perdidas, ambas travadas por Dados → vira o achado de organização |
| **Bruno Sato** · Eng pleno | 4 meses sem feedback. O esquecido |
| **Letícia Alves** · AE senior, Sales | Segunda trilha. Densidade **média**. Serve também aos testes de permissão |
| **Diego Moura** · Design Lead | Densidade **baixa** — e é nele que **o loop de elicitação se prova**: com a Carla o sistema observa muito e pergunta pouco; com o Diego observa pouco e **pergunta mais**. Mesmo mecanismo, comportamento diferente conforme a legibilidade da função. Não é só a confissão do viés de densidade — é a demonstração da mitigação |
| **Paulo Rocha** · Eng Manager | Cobertura de feedback ≈ zero → achado de organização sobre gestão |
| **Helena Prado** · CHRO | Observadora do fluxo 3 |

---

## 9. Riscos

| Risco | Mitigação |
|---|---|
| Chat diz algo estranho na gravação | [TESTES-CHAT.md](TESTES-CHAT.md) antes de gravar · `temperature` 0,2 · chips ensaiados · botão reset |
| **Turno do chat trava sem erro** — 2 ocorrências em ~40 execuções, sempre no passo de payload grande, sem log no servidor | É do gateway, não do app. Aos 45s o painel avisa e oferece interromper. Na gravação: interromper e repetir sai mais rápido que esperar |
| Elenco se contradiz entre fluxos | `validar.ts` no prebuild + conteúdo escrito numa passada só |
| Vídeo passa de 15 min | Roteiro cronometrado por bloco (PLANO.md §11); cortar filosofia primeiro |
| Perguntarem algo que o protótipo não cobre | §12 da ARQUITETURA (protótipo × produção) é a resposta pronta |
| Fase B trava em problema técnico | Alavancas do §4 · fachada `lib/agente/` isola o risco de framework |
