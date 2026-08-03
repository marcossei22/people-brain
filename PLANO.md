# People Brain
## Case Comp — Forward Deployment · Rethinking Performance Management

> **O Brain lembra. As pessoas decidem.**

Documento de estratégia. Tudo aqui é aposta declarada, não menu de opções.

---

## 0. Premissas declaradas

Declaradas em 40 segundos no início do vídeo. O case pede premissas crispas — crispas ganham de hedge.

**A empresa** (chamo de "Aurora" para não abstrair):
- ~700 pessoas, B2B SaaS, HQ São Paulo, times em MX/CO/AR/CL.
- Span médio de 12 → **~58 gestores**. Isso é anormalmente largo e é parte do problema, não pano de fundo.
- Mix: ~40% Eng/Produto, ~35% GTM, ~25% G&A/Ops.
- Slack é onde o trabalho acontece de verdade. Google Workspace para docs. HRIS = cadastro, org chart, férias — zero dado de performance útil.
- 2 ciclos/ano: autoavaliação + avaliação do gestor + calibração.

**Custo do status quo** (minha estimativa, declarada como estimativa):

| Item | Conta | Horas/ano |
|---|---|---|
| Gestores preenchendo formulário | 58 × 12 reports × 45min × 2 | ~1.050 h |
| Gestores em calibração e prep | 58 × 5h × 2 | ~580 h |
| Colaboradores em autoavaliação | 700 × 2h × 2 | ~2.800 h |
| RH operando o ciclo | 3 pessoas × 6 semanas × 2 | ~1.400 h |
| **Total** | | **~5.800 h/ano ≈ 2,9 FTE** |

E o custo que ninguém mede: **latência média entre um fato relevante acontecer e alguém falar sobre ele ≈ 90–120 dias.** É esse número que mata, não as horas.

**Contexto local** (relevante, e ignorado por quem copia produto americano):
- **LGPD**: tratar dado pessoal de colaborador exige base legal, finalidade específica e transparência. Ler Slack para avaliar gente **sem** a pessoa ver o que foi lido não é dilema ético — é problema jurídico.
- **Contencioso trabalhista**: no Brasil, histórico de performance documentado e rastreável a evidência tem valor concreto em demissão contestada e em due diligence. É uma cunha que Workday e Lattice não vendem aqui.

---

## 1. O reframe

O case avisa: *"seu reframe importa mais que o polimento da solução"*. Então, direto.

### A resposta óbvia (e errada)

*"Ciclo semestral é lento. Logo: acabe com o ciclo, faça feedback contínuo."*

Já foi testado. Adobe, GE, Deloitte e Accenture mataram o rating anual entre 2012 e 2016; a maioria voltou atrás ou parou num híbrido. O motivo é sempre o mesmo: **tiraram a função forçante e não puseram nada no lugar.** Feedback contínuo sem estrutura = feedback nenhum, mais ansiedade sobre promoção, e um comitê que agora decide sem dado.

Se eu entregar isso, a liderança da Comp pergunta em 30 segundos *"e como você decide promoção em novembro?"* — e eu não tenho resposta. Descartado.

### O reframe

> **A Aurora não tem problema de processo. Tem problema de memória.**
> O ciclo existe porque a organização esquece.

O formulário de avaliação não é instrumento de avaliação. É uma **prótese de memória**. Você pede a um gestor com 12 reports que reconstrua de cabeça 6 meses de trabalho de cada pessoa. Ele não consegue. Daí saem três coisas, nessa ordem:

1. **Viés de recência** — ele lembra das últimas 3 semanas e escreve sobre isso.
2. **Generificação** — sem fato específico, sobra competência genérica ("boa comunicação", "precisa ser mais estratégico"). É literalmente o que o colaborador chama de "desconectado do trabalho real".
3. **Procrastinação racional** — a tarefa é cara (reconstruir memória) e de retorno percebido baixo. Adiar é a resposta economicamente correta. **Os gestores não são preguiçosos; o sistema está pedindo algo caro demais.**

E tudo o que vem depois — calibração, promoção, mérito, PDI, PIP — é construído em cima desse artefato de baixíssima fidelidade. Decisões caras tomadas com dado reconstruído de memória.

A parte que quase ninguém vê: **a evidência existe.** A thread onde alguém destravou o deal, o PR que salvou a release, o doc que mudou o roadmap, o incidente mal conduzido. Tudo isso é gerado todo dia — e jogado fora. Seis meses depois um humano tenta reconstruir de memória o que o sistema já tinha registrado e descartado.

### O segundo reframe: o ciclo empacota três loops incompatíveis

É o que responde à pergunta central deles ("ciclos deveriam existir?").

| Loop | Pergunta que responde | Cadência ótima | Hoje na Aurora |
|---|---|---|---|
| **Coaching** | "Como melhoro no trabalho que faço agora?" | Dias | 2×/ano, escrito por quem julga |
| **Alinhamento** | "O que é 'ótimo' no meu papel, agora?" | Quando o trabalho muda | Implícito nas competências do form |
| **Julgamento** | "Quanto vale? Está pronta pra mais?" | 1–2×/ano | Reconstruído de memória em 1 semana |

Fundir os três num ritual só produz duas patologias ao mesmo tempo:
- **Coaching** fica preso ao calendário → chega tarde, o momento passou.
- **Julgamento** fica preso à memória → fica injusto, ruidoso e político.

Mais a patologia clássica: **ninguém é honesto com quem decide seu salário.** Coach e juiz sendo a mesma pessoa, no mesmo formulário, no mesmo mês, o colaborador otimiza para parecer bem — não para aprender. O sistema mata a própria matéria-prima.

### A aposta

> ## Não mate o ciclo. Mate o formulário.
>
> Separe os três loops. Coaching vira contínuo e disparado por evento. Alinhamento vira régua viva. Julgamento continua periódico — mas deixa de ser evento de **coleta** e vira momento de **leitura** de um registro que se construiu sozinho o ano inteiro.

O ciclo sobrevive como **decisão**, não como digitação. Encolhe de 6 semanas para 2 horas.

Defensável dos dois lados: quem quer matar o ciclo ganha (o ritual que dói morre); quem pergunta "e a promoção em novembro?" ganha (existe, é mais justa e é auditável).

### E um terceiro desmembramento, de graça

> **Dinheiro é anual porque orçamento é anual. Promoção não precisa ser.**

Mérito tem restrição orçamentária real — cabe num momento periódico. Prontidão para promoção é um estado observável, e o sistema sabe em fevereiro. O único motivo pra Carla esperar até novembro era o formulário ser caro. O formulário morreu. **Separar o momento do dinheiro do momento do crescimento** só é possível quando a memória existe.

---

## 2. Filosofia de gestão

Seis princípios. Cada um tem consequência de produto — se não tem, é slide.

**1. Evidência acima de impressão.**
Toda afirmação sobre performance precisa ser rastreável a um artefato observável.
→ Nenhuma frase na UI aparece sem link clicável pra fonte. Sem evidência, não entra no registro.

**2. Feedback é bem perecível.**
A meia-vida útil se mede em dias.
→ A métrica-mãe do sistema é **latência**, não volume nem adoção.

**3. Separe o treinador do juiz.**
Loop contínuo = desenvolvimento, disparado por evento. Loop periódico = julgamento, com consequência de nível e mérito.
→ Duas cadências, **uma leitura só**. O que separa os dois loops não é visibilidade — não existe arquivo secreto, e a nota contra a régua está no dossiê da pessoa desde o primeiro dia. É o que cada loop **produz**: o contínuo produz conversa e reconhecimento; o periódico produz decisão. O que nunca atravessa de um para o outro é o **teor da correção** — o registro guarda que a conversa existiu, com data e episódio, nunca o que foi dito nela. O reconhecimento atravessa, e de propósito: ele é evidência, e evidência é o que a régua pesa (§2.5). Um sistema em que marcar o momento não move a leitura é um sistema dizendo ao gestor que reconhecer não conta.

**4. Sem arquivo secreto. O colaborador é o primeiro leitor do próprio registro.**
Tudo que a IA captura sobre a pessoa é visível pra ela, no mesmo instante, com a fonte. Ela anota, contextualiza, contesta.
→ É a espinha moral **e** o maior driver de qualidade de dado: ela corrige o que a IA errou. Nenhum sistema de vigilância consegue isso.

**5. A IA pontua comportamento contra a régua. O humano decide o que fazer com a nota.**
Avaliar trabalho observável contra um nível escrito é o trabalho da IA, e ela faz isso melhor que um gestor com doze reports reconstruindo seis meses de cabeça: comportamento a comportamento, com a fonte de cada afirmação. Recusar essa leitura seria devolver o problema para quem o produto veio resolver.
→ A nota é de 1 a 5, é de um comportamento da régua, e é **contagem com regra publicada — não opinião com um número na frente**: quantos episódios distintos sustentam, quão firme é o padrão, se alguém reconheceu, se o trabalho foi acima do cargo. Por isso ela é clicável até a fonte como qualquer outra afirmação. Um gestor pode discordar da regra; ele não pode dizer que não sabe de onde o 4 veio — o que é mais do que se consegue dizer do parágrafo que ele escreveria de memória.
→ **"Sem evidência" não é o degrau de baixo da escala — está fora dela.** A conta só roda onde há episódio; sem episódio nenhum ela não devolve número, e a tela escreve "sem evidência". Isso é um estado do registro, não uma afirmação sobre a pessoa, e a saída dele é uma pergunta na semana seguinte.
→ **E o degrau de baixo, quando existe, também é contagem.** Nota 1 é um episódio. Nota 2 são dois, ou um com padrão firme. Não é veredito de fraqueza — é o quanto o registro alcançou, e é exatamente o que Design, People e Finance tendem a produzir (§7.1). Por isso a régua nunca aparece sem a **densidade de evidência** ao lado: com densidade baixa, nota baixa pede a mesma coisa que "sem evidência" pede. **O que autoriza ler o número como afirmação sobre o trabalho é densidade alta** — registro que alcançou e mesmo assim não encontrou o comportamento. O sistema que confunde as duas leituras é o sistema de vigilância que eu me recusei a construir.
→ **E o contexto entra na leitura, nunca na conta.** Bloqueio externo, plantão, trabalho sem rastro: o `contexto-do-semestre` diz o que não conta contra a pessoa, e nada disso é parcela. Uma parcela de contexto seria um humano movendo o número à mão, que é a opinião com número na frente que a contagem existe para não ser. O contexto chega por três caminhos, todos ao redor do número e nenhum dentro dele: o diagnóstico de organização, que roda **antes** do individual no fechamento; a leitura escrita ao lado da nota, com fonte; e o `Discordo` do gestor, que vira evidência nova — e evidência é o único caminho pelo qual a conta se move.

As linhas vermelhas são outras quatro, e essas são de arquitetura, não disclaimer de compliance:
- **Não pontua a pessoa.** O número é do comportamento. Não existe nota geral, média das outras, nem campo no modelo de dados onde uma coisa dessas caberia — e é aí que esse "não" se sustenta, não numa instrução de prompt.
- **Não ordena pessoas.** Cada uma é lida contra o nível, nunca contra as colegas. Sem rating relativo, sem curva, sem leaderboard.
- **Não mede cultura.** Valores governam como se diz, nunca se a pessoa é boa (§ abaixo).
- **Não decide.** Promover, ajustar comp, desligar: dependem de orçamento, timing e calibração entre times — coisas que não estão no registro.

**6. Performance é propriedade do sistema, não só da pessoa.**
Contexto importa: projeto ruim, expectativa mal definida, dependência travada, troca de gestor.
→ O fechamento produz **diagnóstico de organização**, não só 700 vereditos. (§3.4)
→ E a **ordem** virou parte do princípio no dia em que a leitura virou número: o diagnóstico de organização é lido **antes** das leituras individuais do time, nunca depois. O Rafael, travado duas vezes pela fila de Dados, aparece com evidência fina em entrega — a conta não sabe de bloqueio externo, e não deve saber (§2.5). Quem lê a nota dele precisa já ter lido que a fila trava seis pessoas em três squads. Diagnóstico depois do veredito é errata.

**Sobre o gestor:** o modelo o trata como **editor e treinador**, não autor e escriba. Hoje pedimos que ele seja historiador (lembrar), redator (escrever), avaliador (pesar o trabalho contra a régua) e juiz (decidir). Ele é ruim nos três primeiros, e não por caráter: ninguém com doze reports lembra, escreve e pesa seis meses de doze pessoas numa semana. Só o quarto é intransferível — decidir nível, promoção e mérito depende de orçamento, timing e calibração, que não estão no registro. Tire os três primeiros dele.

---

## 3. O sistema — People Brain

Quatro fases. **Três são contínuas. Só uma tem data no calendário.**

```
┌── 1. SETUP ──────────────────────── contínuo ──┐
│  A régua. O que é "bom" aqui, por cargo e      │
│  senioridade, em termos observáveis.           │
│  Escrita por humanos → recalibrada por         │
│  evidência a cada trimestre.                   │
└────────────────────────┬───────────────────────┘
                         │ define o que importa
┌── 2. CAPTURA ──────────▼─────────── contínuo ──┐
│  OBSERVAR  rastro: Slack, Docs, git, CRM, HRIS │
│  PERGUNTAR  o que não está em lugar nenhum     │
│  → registro por pessoa: evento · episódio ·    │
│    tema · lacuna                               │
└────────────────────────┬───────────────────────┘
                         │ alimenta
┌── 3. AVALIAÇÃO ────────▼─────────── contínuo ──┐
│  ESTRELA  gestor marca o momento (não a pessoa)│
│  CHAT     pergunta qualquer coisa, qualquer dia│
│  NUDGE    3 sugestões/semana, no Slack         │
└────────────────────────┬───────────────────────┘
                         │ é lido por
┌── 4. FECHAMENTO ───────▼────────── periódico ──┐
│  Comitê LÊ dossiê pronto e decide.             │
│  + DIAGNÓSTICO DE ORGANIZAÇÃO                  │
│  Horas, não semanas. Ninguém escreve nada.     │
└────────────────────────┬───────────────────────┘
                         └──► volta pro Setup: a régua aprende
```

---

### 3.1 Setup — escrever a régua

Meu desenho original era todo centrado em evidência: capturar o que aconteceu. Mas **evidência sem régua é diário.** Não dá pra dizer que a Carla está acima do nível dela sem uma definição do nível dela. A régua não é o contexto do julgamento — ela **é** o julgamento: é contra ela que a IA pontua cada comportamento, e é dela que sai o número que o gestor confirma ou contesta. Sem régua escrita, sobra um diário bem organizado.

E aqui mora uma coisa maior do que parece:

> Metade do problema de "avaliação injusta" não é medição ruim. **É que a régua nunca foi escrita.** Cada gestor tem a régua dele, na cabeça dele. A dor da calibração não vem de dado ruim — vem de bar não-publicado.

Uma empresa de 700 pessoas tipicamente tem: um career ladder que é um Doc de dois anos atrás que ninguém lê, valores na parede, e zero definição operacional de "bom" por cargo por senioridade.

**O que entra no Setup:**
- Ladder por trilha e senioridade, em termos **comportamentais e observáveis**
- Definição de entregável por função — o que essa função produz
- Contexto de negócio: metas do semestre, prioridades, o que está em jogo
- Doc de cultura e tom de voz

**O corte que evita a armadilha:**

| Artefato | Serve para | Nunca serve para |
|---|---|---|
| Doc de cultura / tom | decidir **como** se diz | decidir **se** a pessoa é boa |
| Régua comportamental | avaliar | ditar linguagem |

Julgar gente contra valores é como se fabrica avaliação política e infalsificável ("não é culture fit"). A linha é: *o doc de cultura decide como dizer, nunca decide quem é bom.*

**A virada AI-native: a régua não é escrita e congelada — é derivada e mantida viva.**

Depois de um trimestre de captura, o sistema sabe o que os seniors da Aurora **de fato fazem**. Então ele volta:

> *"Sua régua diz que Senior 'demonstra liderança técnica'. Olhando as 14 pessoas em Senior, aqui isso significa na prática: lidera migrações cross-team, é a pessoa consultada em arquitetura de pagamentos, revisa ~40% dos PRs do domínio. Quer atualizar a régua?"*

O ladder deixa de ser documento e vira **modelo vivo calibrado contra a realidade**. Impossível sem a camada de captura, e é exatamente o loop fechado que a Comp exige acima de N4: o sistema melhora observando resultado. **Por isso Setup não é onboarding — é o quarto loop.**

**Risco honesto:** garbage in. Régua ruim vira injustiça aplicada com consistência perfeita a 700 pessoas — em certo sentido pior que régua vaga aplicada de forma inconsistente. Mitigação: no Setup o FDE **desafia** o ladder existente em vez de digitalizá-lo; e a derivação por evidência corrige a deriva depois. Isso também responde "por que precisa de forward deployment": não é implantação, é co-desenho da régua.

---

### 3.2 Captura — observar e perguntar

Duas capacidades, e a segunda é a que quase todo mundo esquece.

#### Observar

Ingestão contínua de Slack (canais de trabalho), Google Docs, git, Jira/Linear, CRM, HRIS. Não é log de atividade — é linha do tempo curada de **momentos de contribuição**.

Regra de extração: só entra o que tem **artefato** e **consequência**. Um PR mergeado sozinho não é evidência. Um PR que fechou um incidente P1 é.

**Backfill no dia 1:** o sistema lê os últimos 6–12 meses de histórico na instalação. O registro não nasce vazio — nasce cobrindo dois trimestres. Isso mata a primeira objeção de qualquer CHRO ("e eu espero seis meses pra isso servir?").

**O que explicitamente não é capturado:** DMs, canais privados não-autorizados, sentimento, tom, horas online, tempo de resposta, volume de mensagens. Não é limitação técnica — é a definição do produto. Vigilância de atividade destrói o ativo (confiança) que torna o dado bom, e mede esforço em vez de contribuição.

#### Perguntar — o loop de elicitação

Aqui está o furo do desenho ingênuo: **assumir que a evidência está toda no rastro digital.** Não está. Eng e Sales deixam rastro rico; Design, People, Finance e gestores deixam pouco. Sem tratar isso, **legibilidade digital vira proxy de performance** — um jeito silencioso de punir quem trabalha fora do Slack.

Então o sistema sabe o que **não** sabe, e vai buscar:

> **People Brain** · para o gestor da Carla
> *"A Carla coordenou 4 pessoas de 2 times na migração de billing — 9 dias, zero incidente. Isso foi iniciativa dela ou você atribuiu?"*
> *Pergunto porque ela tem uma decisão de promoção em 6 semanas e o registro dela está fino no lado de liderança técnica.*

**O colapso elegante — e é o melhor momento do vídeo:**

> **A pergunta que fecha a lacuna é o mesmo evento que dispara a atenção do gestor.**

Um mecanismo, dois produtos: preenche o registro **e** faz o gestor notar a Carla nesta semana. Não são dois sistemas competindo pela atenção do gestor — o que importa porque atenção de gestor é o recurso que estoura primeiro.

E repara na dependência: essa pergunta só é barata **porque a observação passiva já rodou**. Sem ela, elicitação vira pesquisa ("conta como foi o trimestre do time" → morre em duas semanas). Com ela, vira confirmação de 20 segundos de uma hipótese específica. **Observar não é pré-requisito de perguntar — é o que torna perguntar barato o suficiente pra existir.**

#### O orçamento de pergunta

Se só uma regra deste documento sobreviver ao protótipo, que seja esta:

> **O recurso mais escasso do sistema não é compute. É o direito de perguntar.**

Cada pergunta é saque numa conta finita de paciência humana. 700 pessoas × 3 perguntas/semana = produto morto em um mês.

| Regra | Detalhe |
|---|---|
| **Teto fixo** | 2 perguntas/semana para gestor, 1 para IC. Não é configuração, é lei. |
| **Valor da informação** | Só gasta pergunta se a resposta muda algo: uma decisão próxima, uma lacuna num registro que será lido, uma anomalia que ela não interpreta sozinha. Se não muda nada, não pergunta. |
| **Sobre trabalho, nunca sobre pessoa** | *"O que foi mais difícil na migração?"* sim. *"Como a Carla está indo?"* não — isso é o formulário voltando pela janela, em parcelas. |
| **Reciprocidade** | Toda pergunta devolve algo na hora. Gestor → recebe o rascunho pronto. Colaborador → o registro dele melhora e ele vê. Extração assimétrica morre, sempre. |
| **Declara o porquê** | Aumenta taxa de resposta e é o que torna a pergunta legítima. |
| **20 segundos, no Slack, uma frase, áudio se quiser** | No instante em que virar micro-formulário, a tese do case cai. |
| **Silêncio é saída válida** | Semana sem lacuna relevante é semana sem pergunta. |

**Quem é perguntado, em ordem de prioridade:**
1. **O próprio colaborador**, sempre que for a fonte mais barata. É o mais legítimo (dono do próprio registro), o mais preciso, e coerente com "sem arquivo secreto". Perguntar *sobre* alguém antes de perguntar *a* alguém é um cheiro ruim.
2. **O gestor**, quando o que falta é atribuição, contexto ou intenção.
3. **Pares — só sobre artefato específico que os dois tocaram, no calor da colaboração.** Nunca sobre a pessoa. Essa é a fronteira que separa isso de 360 disfarçado (§6).

#### O modelo de memória

O problema difícil da captura não é capturar — é **comprimir**. Seis meses de uma pessoa são milhares de eventos: não cabem em contexto e não *devem* caber. Quatro níveis:

| Nível | O quê | Pra que serve |
|---|---|---|
| **Evento** | atômico, datado, com fonte | citação — nunca apagado |
| **Episódio** | cluster com narrativa ("a migração de billing: 9 dias, 4 pessoas") | é a unidade de feedback e de estrela |
| **Tema** | padrão recorrente entre episódios ("assume coordenação cross-team que ninguém pediu") | **é o que sustenta promoção** |
| **Lacuna** | o que o sistema sabe que não sabe | **é a fila do verbo perguntar** |

Duas coisas caem de graça dessa estrutura:

- **A fila de elicitação não é módulo separado — é um tipo de objeto da própria memória.** O loop de perguntar sai do modelo de dados em vez de ser parafusado por cima.
- **Tema é a resposta pra "por que não basta buscar no Slack?"** Busca dá evento. Decisão precisa de tema. E tema só existe pra quem estava olhando continuamente — que é literalmente o moat.

---

### 3.3 Avaliação — a estrela e o chat

A avaliação deixa de ser um evento e vira um estado consultável. Três superfícies.

#### A estrela — a unidade mais barata de julgamento humano

Regra que sustenta tudo:

> **Você marca um momento, não uma pessoa.**

A estrela gruda no **episódio** ("essa migração foi acima do nível dela"), nunca na Carla como escalar. E ela não escapa da régua — ela **entra** na conta: "houve reconhecimento" é uma das parcelas da nota daquele comportamento (§2.5). Se marcar um momento não mexesse na leitura, o produto estaria dizendo ao gestor que reconhecer não muda nada. Ela vale muito mais que um "like":

- **Custo:** 1 segundo, contra 4 minutos de um feedback escrito. Você coleta ~50× mais sinal.
- **É rótulo de treino.** Cada estrela é um gestor ensinando o sistema o que é "bom" *aqui*. 500 estrelas × 58 gestores = o sistema aprende a régua real da empresa — que volta pro Setup e atualiza o ladder (§3.1). **É o loop fechado que a Comp exige acima de N4, com mecanismo concreto.**
- **Destrava a calibração.** Hoje são três horas de gestores discutindo de memória. Com 500 episódios marcados e com evidência, vira comparação de artefato, não de opinião.

**Duas guardas obrigatórias:**

**1. Estrela não é ranking — e agora ela vale ponto, então a guarda precisa ser mais dura que "não some estrelas".** Ela vale **+1 num teto de 5**, num comportamento, e **só onde já existe episódio**: estrela não cria evidência, ela pesa evidência que já está no registro. Distribuir estrela para inflar dá +1 em todo mundo, o que não move ninguém em relação a ninguém — a nota é contra a régua, nunca contra as colegas. E o gesto é público na direção certa: o reconhecimento inteiro fica no episódio, com autor e data, visível para a pessoa e para o RH; **taxa de estrela por gestor é sinal de qualidade do ciclo** (§ jornada A4), do mesmo jeito que taxa de discordância. O que continua não existindo é a **soma**: ninguém conta estrelas por pessoa, não existe total, não existe leaderboard. Gaming aqui não é impossível — é visível, é barato de auditar, e não produz o número que se ganharia gameando.

**2. Não existe estrela negativa, e a nota não é uma.**

> **Reconhecimento pode ser um clique. Preocupação tem que ser uma conversa.**

Marcação de "isso foi mal" cria dossiê de deméritos: é gelado, é chilling, e no Brasil é passivo trabalhista puro. Quando o gestor quer sinalizar problema, o sistema **não oferece marcação** — oferece o rascunho da conversa.

A objeção óbvia à doutrina nova mora aqui: *"a IA registra que a pessoa está em 1 contra um esperado 4 — isso não é o dossiê de deméritos que vocês recusaram?"* Não, e a diferença é de mecanismo, não de tom. **Nenhuma parcela da nota subtrai.** Não existe um campo onde alguém escreva "isso foi mal": a conta só soma evidência, e um número baixo é a ausência dela, não um demérito registrado por alguém. Ele não tem autor humano, ele **se move sozinho para cima** quando o episódio seguinte entra, e a pessoa o vê no mesmo instante que o gestor, com o direito de contestar e de adicionar o que o sistema não podia saber. O que é passivo trabalhista é o registro que só desce e só por decisão de alguém, sem regra publicada e sem contraditório. Este é o oposto disso — é o registro declarando o que ainda não viu.

#### O chat — o que faz o produto ser aberto toda semana

Se o valor só aparecesse no fechamento, o sistema seria obrigação o ano inteiro e recompensa uma vez. Com recall, ele responde coisa útil todo dia:

- Gestor: *"prepara meu 1:1 com a Carla"* · *"quem no meu time está travado há mais de duas semanas?"*
- Colaborador: *"o que eu entreguei esse trimestre que sustenta meu caso de promoção?"* · *"onde eu estou em relação a Senior?"*
- RH/liderança: *"quais skills faltam em Dados?"* · *"quantas pessoas estão prontas pra promoção e não têm vaga?"*

**O registro se paga continuamente, e o momento de decisão vira subproduto de graça.** É a resposta pro problema de adoção — ninguém abre ferramenta de performance por vontade própria; todo mundo abre uma coisa que responde "o que meu time entregou no Q2" em cinco segundos.

**Modelo de permissão:**

| Quem | Pode perguntar sobre |
|---|---|
| Você | você, qualquer coisa |
| Seu gestor | você |
| Skip-level / RH | padrão e agregado; deep-dive individual só com motivo declarado |
| Pares | **ninguém.** Ponto. |

**E a regra que vale mais que qualquer slide de privacidade — a mesma do verbo perguntar:**

> **A IA responde sobre trabalho, nunca sobre estado das pessoas.**

*"O que o Rafa entregou e o que travou ele?"* → responde.
*"O Rafa está infeliz?"* / *"ele vai pedir demissão?"* → **recusa** — porque ela não sabe, e fingir que sabe é exatamente o produto de vigilância que eu me recusei a construir.

Mostrar a IA **recusando** ao vivo no protótipo vale mais que dez minutos falando de confiança.

#### O nudge — em quem prestar atenção esta semana

Segunda de manhã, no Slack. Máximo 3 itens. É onde as perguntas de elicitação e as sugestões de reconhecimento chegam. **Silêncio é saída válida** — produto que precisa notificar toda semana vira ruído e morre em 60 dias.

Nunca sugere "dar feedback negativo" como primeira ação — sugere **observar e perguntar**. A IA não sabe se o Rafa é o problema ou a vítima.

---

### 3.4 Fechamento — ler, decidir, e diagnosticar a organização

Uma ou duas vezes por ano ainda existe um momento formal. **Ninguém escreve nada.**

**Para o gestor e o comitê:** tela de leitura. Para cada pessoa, dossiê montado — trajetória, episódios ordenados por impacto, temas, feedbacks do período, gap explícito contra o próximo nível, densidade de evidência declarada. **Cada afirmação é clicável até a fonte** (evento → mensagem original no Slack). O trabalho humano é: ler, discordar onde discorda, adicionar o que a IA não podia saber, decidir.

**E o output que ninguém mais tem — o diagnóstico de organização:**

> **Dado de performance, agregado, diagnostica a organização — não as pessoas.**

O exemplo que vai no protótipo: o Rafa perdeu duas entregas, nas duas travado pelo time de Dados. Avaliação individual conclui *"o Rafa é lento"*. Agregando 700 registros, o sistema conclui *"o time de Dados é gargalo de 6 pessoas em 3 squads"*. **Só uma dessas duas é verdadeira e acionável.**

Outros outputs que caem do mesmo registro:
- 3 gestores com cobertura de feedback ≈ zero → problema de gestão, não de gente
- Pagamentos tem 4 pessoas prontas pra promoção e 1 vaga → bloqueio estrutural = fila de risco de saída
- Nenhum sênior em data engineering e 3 iniciativas dependem disso → gap de skill real, não declarado

É aqui que o princípio §2.6 vira produto. E é o argumento de expansão pra Comp: o mesmo registro que avalia pessoas diagnostica a empresa.

---

### 3.5 Isso não reintroduziu o ciclo?

A liderança da Comp vai perguntar. A formulação exata importa:

> **Não são 4 fases de um ciclo. São três processos contínuos e uma leitura periódica.**
> Setup, captura e avaliação estão sempre rodando. Só o fechamento tem data — e nele ninguém escreve, só lê.

Frase do vídeo: *"parece um ciclo, mas só a última caixa tem data no calendário."*

---

### 3.6 Por que a IA é estrutural, não uma feature em cima

O teste é simples: **remova a IA e o produto continua existindo?**

- *"IA que escreve sua avaliação"* → remove a IA, o produto ainda existe (pior). **É feature.**
- *"Registro contínuo de evidência de 700 pessoas em ~40 mil mensagens/semana, que sabe o que não sabe e vai buscar"* → remove a IA e o produto **é impossível**. Nenhum humano faz sensemaking contínuo nessa escala. A IA não acelera o trabalho — ela é a única razão pela qual esse trabalho pode existir.

**No vocabulário do Maturity Map da Comp:**

| Nível | Onde aparece aqui |
|---|---|
| **N3** — SO contextualizado | Captura sintetiza Slack + Docs + git + CRM + HRIS num registro único |
| **N4** — inteligência de decisão | O sistema **sabe o que não sabe** e vai atrás; propõe ação com base em como os bons gestores da Aurora decidem, não em heurística genérica de RH |
| **N5** — inteligência adaptativa | O loop **fecha** em três pontos: (a) distância de edição entre o rascunho da IA e o que o gestor enviou; (b) as estrelas como rótulo do que é "bom" aqui; (c) a régua recalibrada por evidência a cada trimestre |

Eles dizem que aprovação humana sozinha não sinaliza N4 — **o loop de aprovação precisa fechar**. Fecha nos três pontos acima. E seguindo o conselho deles (*"projete para o nível-alvo desde o dia 1, de trás pra frente"*), o modelo de memória de §3.2 é arquitetado para N5 mesmo com o V1 entregando N3–N4.

**Consequência de negócio:** em 12 meses o People Brain da Aurora não é o de outro cliente. Ler é commodity; ter aprendido a régua de uma empresa específica não é.

---

## 4. Que decisões o sistema melhora

Feature sem decisão associada é feature morta.

| Quem | Decisão | Hoje | Com People Brain |
|---|---|---|---|
| **Gestor** | Em quem invisto atenção esta semana | Quem grita mais alto | Fila priorizada por evidência de mudança |
| **Gestor** | O que exatamente eu digo | Memória das últimas 3 semanas | Rascunho com fatos citados |
| **Colaborador** | Estou no caminho? O que falta pro próximo nível? | Adivinha até novembro | Registro próprio + gap explícito contra a régua |
| **Comitê** | Essa promoção se sustenta? | Narrativa do gestor + política | Dossiê auditável até a mensagem original |
| **CHRO** | Onde está o risco de saída, agora | Descobre na carta de demissão | Sinal contínuo, semanas antes |
| **CHRO** | Que skills faltam pra estratégia do ano | Pesquisa declarada | Gap observado no trabalho real |
| **CEO** | Quais gestores desenvolvem gente | Não sabe | Cobertura e latência de feedback por gestor |
| **CEO** | Onde a organização trava | Anedota | Diagnóstico agregado (§3.4) |

A mais alavancada é a primeira. Um gestor com 12 reports e 40h/semana toma **uma** decisão de altíssimo impacto por semana: onde colocar atenção. Hoje ela é aleatória. É o menor delta de esforço com o maior efeito organizacional.

---

## 5. O protótipo — 3 fluxos

Regra do case: 2–3 fluxos profundos > 10 rasos. Cada fluxo existe pra **provar uma tese**, não pra mostrar tela.

| Fase | No protótipo | Prova |
|---|---|---|
| **1. Setup** | Não é fluxo — é **artefato**. Uma tela do ladder vivo + a sugestão *"sua régua diz X, a realidade diz Y"*. ~60s de vídeo. | A régua existe e aprende |
| **2. Captura** | **Fluxo 1** — em `/feedback`: a pergunta que fecha lacuna **e** dispara a atenção do gestor → `Ver evidência` → `Rascunhar` → edita → envia. **Cronometrado ao vivo: 4 min** vs. 45 min/pessoa do formulário. Mostrar também `Depois` e o silêncio. | O loop contínuo é barato |
| **3. Avaliação** | **Fluxo 2** — o chat, **dos dois lados**. Gestor pergunta sobre a Carla e dá a estrela num episódio. Depois, a Carla no mesmo produto: vê o próprio registro, adiciona contexto que a IA não podia saber, contesta um item. E o momento em que **a IA recusa** responder sobre estado emocional. | O modelo de confiança funciona |
| **4. Fechamento** | **Fluxo 3** — em `/org`: dossiê com drill-down até a mensagem original no Slack **+ o diagnóstico de organização** ("Dados é gargalo de 6 pessoas"). | O ciclo não morre, encolhe |

O fluxo 2 resolvendo os dois lados na mesma superfície prova de uma vez: propriedade do colaborador, modelo de permissão e a recusa.

**Decisões de produto que ficam visíveis no protótipo:**
- Em produção o nudge chega onde a pessoa já está — **Slack**. Mas o Slack é *canal e fonte*, não
  o produto: **o protótipo não imita a interface do Slack**, e o mesmo loop roda em `/feedback`. O
  app web é pra **ler e decidir**, não pra produzir.
- O colaborador **não tem** trabalho de performance pra fazer. Não existe formulário em lugar nenhum.
- O número de 1 a 5 na tela é sempre de um **comportamento da régua**, e ele abre na contagem e na
  evidência que o produziram. Não existe tela com uma nota da pessoa — nem geral, nem média das
  outras, nem posição numa lista. É a distinção inteira, e ela dá pra apontar na tela.

---

## 6. O que eu escolhi NÃO construir

Onde se ganha ou se perde a entrevista. Cada "não" é aposta.

| Não construo | Por quê |
|---|---|
| **A pessoa como escalar — rating geral, nota única, posição em lista** | A IA pontua comportamento contra a régua, e cada nota abre na contagem que a produziu. Um número que resume a pessoa não abre em nada: é média de coisas que não se somam, e a primeira pergunta que ele leva — *"de onde veio o 3,4?"* — não tem resposta. Sob LGPD o argumento é o inverso do que se costuma dizer: nota calculada com regra publicada e fonte clicável é **mais** auditável que um parágrafo escrito de memória; o que é indefensável é o escalar opaco. Não existe campo pra ele no modelo de dados, que é o único lugar onde esse tipo de "não" se sustenta. |
| **Estrela negativa / marcação de demérito** | Reconhecimento pode ser um clique; preocupação tem que ser conversa. Dossiê de deméritos é chilling e é passivo trabalhista. |
| **Análise de sentimento, tom, horas online, tempo de resposta** | Vigilância. Destrói o ativo (confiança) que torna o dado bom. E mede esforço, não contribuição. |
| **Chat respondendo sobre estado emocional / risco de saída individual** | A IA não sabe. Fingir que sabe é o produto que eu recusei. |
| **360 tradicional (todos avaliam todos)** | É exatamente a carga de formulário que estou matando. Troco por pergunta única, sobre artefato específico, no momento da colaboração real. |
| **Módulo de OKR / gestão de metas** | Meta mora onde o trabalho mora. Recriar isso é construir um Asana pior e virar mais uma aba. Eu leio, não possuo. |
| **Motor de cálculo de mérito** | V1 alimenta a decisão de comp, não a executa. Restrição orçamentária e política ainda não é problema de produto. Fase 2 — e é a fase que interessa comercialmente à Comp. |
| **Substituir o HRIS** | Integro. Registro de vínculo empregatício é commodity de baixa margem e alto custo de migração. |
| **Feed social de kudos** | Concurso de popularidade, não sinal de performance. Evidência > aplauso. |
| **App mobile, pesquisa de engajamento, 9-box como workflow** | 9-box é **output** de um registro bom, não coisa que alguém preenche. O resto é dispersão. |
| **Onboarding self-service / PLG** | O produto exige co-desenho da régua e do "o que conta como evidência" por função. Isso é trabalho de FDE — e é justamente o moat. Não tento forçar PLG. |

---

## 7. Trade-offs assumidos

Honestidade aqui vale mais que solução perfeita.

**1. Densidade de evidência é desigual — e enviesa. A nota piorou esse risco, e eu não vou fingir que não.**
Eng e Sales deixam rastro rico; Design, People e Finance quase nada. Risco: legibilidade digital vira proxy de performance. E duas das quatro parcelas da nota — episódios distintos, firmeza do padrão — são densidade de evidência com outro nome. **Quem deixa pouco rastro não recebe mais um registro incompleto: recebe 1 ou 2 contra um esperado 4.** Um número é mais fácil de ler mal que um espaço em branco, e o Diego, que é Design Lead, é o caso do protótipo.
→ O loop de perguntar (§3.2) continua sendo a mitigação principal, e a nota **aumenta** o valor dela: onde o rastro é fino, o sistema pergunta em vez de adivinhar, e cada resposta é um episódio que move a conta. Mais: captura manual em 1 clique (`/brain` numa thread) e densidade **exibida ao lado da régua**, nunca numa aba separada.
→ E a regra de leitura que a escala obriga (§2.5): **nota baixa em densidade baixa é afirmação sobre o registro, não sobre a pessoa** — a saída dela é a mesma de "sem evidência", que é a pergunta da semana seguinte. Só densidade alta autoriza ler o número baixo como afirmação sobre o trabalho. Não é ressalva de rodapé: é o que a IA escreve ao lado do número, e é o que a tela do ciclo mostra ao RH como sinal de qualidade ("quem está sendo avaliado com pouco lastro").
→ Duas coisas que a escala **não** permite mais dizer da forma antiga: comparar trilhas de densidade diferente continua proibido, mas agora a proibição precisa ser de produto e não de etiqueta — a régua é por trilha e por nível, e não existe tela que ponha duas trilhas na mesma teia. E "onde o rastro é fino, sai sem evidência" virou "onde o rastro é fino, sai nota baixa **com a densidade colada nela**".
→ **A parte honesta:** no V1 este produto é melhor pra Eng e GTM que pra G&A, e a nota torna isso mais visível, não menos. Eu digo isso no vídeo.

**2. Régua ruim aplicada com consistência perfeita.**
O Setup pode sistematizar um padrão ruim em 700 pessoas. → FDE desafia o ladder em vez de digitalizar; derivação por evidência corrige com o tempo. Mas é risco real, não hipotético.

**3. Fadiga.**
Mais toques = mais chance de virar ruído. → Teto rígido, silêncio permitido, e contra-métrica de taxa de dispensa. Acima de 50%, o modelo de detecção está errado, não o usuário.

**4. Latência vs. acurácia.**
Feedback rápido sobre evidência incompleta pode estar errado. → A IA **propõe**, não afirma: o veredito por comportamento chega com a evidência à vista, pro gestor pegar o erro antes de enviar. E o sistema não escolhe entre perguntar e julgar — faz os dois, e é a mesma função que separa um caso do outro: onde há episódio, sai nota contra a régua; onde não há, sai "sem evidência" e a lacuna vira pergunta na semana seguinte. Inventar nota baixa no lugar de perguntar seria trocar acurácia por velocidade exatamente onde dói.

**5. O tempo do gestor não fica de graça.**
Não elimino o custo — troco 15h concentradas numa semana por ~20min/semana distribuídos (~17h/ano vs. ~28h/ano), com valor muito maior. Alguns gestores **preferem** o lote. Aposto contra eles: o lote é exatamente o que produz feedback genérico.

**6. O risco que pode derrubar tudo: coragem, não capacidade.**
Se o gestor não dá feedback porque **não quer o conflito**, IA nenhuma resolve. Ela ataca "não tenho tempo" e "não lembro dos fatos" — não a terceira barreira.
→ Mitigação de operating model, não de produto: ação default é observação e reconhecimento (baixo custo social), e a **cobertura de feedback do gestor fica visível pro gestor dele**. Deixa de ser tarefa invisível.

**7. "Feedback rascunhado por IA é autêntico?"**
A IA não dá opinião — dá a memória, a evidência, a leitura contra a régua e a primeira frase, cada afirmação com a fonte pendurada. O que continua humano é a **decisão**: nível, promoção, mérito. E o benchmark honesto não é o feedback ideal: é o parágrafo genérico escrito às 23h do dia do prazo, sem uma fonte, terminando numa nota que o próprio autor não sabe justificar. A nota da IA, essa, abre na contagem. Contra esse benchmark, ganho fácil — e ganho justamente na parte que parecia indefensável.

---

## 8. Como eu saberia que está funcionando

Nada de "% de formulários preenchidos" — essa é a métrica do sistema que estou matando.

**North star:**
> **Latência de feedback** — mediana de dias entre um momento de contribuição relevante e um feedback humano sobre ele. Baseline ~90–120 dias → **meta < 7 dias em 6 meses.**

**Leading:**

| Métrica | Baseline | Meta 6m |
|---|---|---|
| Densidade de evidência (afirmações com fonte citada na decisão) | ~0% | > 80% |
| Cobertura: % do time com ≥1 feedback específico no trimestre | ~50% | > 90% |
| Horas de gestor no fechamento | ~14h/ciclo | < 3h/ciclo |
| Taxa de resposta às perguntas de elicitação | — | > 70% |
| Taxa de dispensa dos nudges *(contra-controle)* | — | < 40% |
| Cobertura da régua: % de cargos com definição observável | ~20% | 100% |

**Lagging:**

| Métrica | Meta |
|---|---|
| **Taxa de surpresa** — % que diz "meu fechamento não teve nenhuma surpresa" | > 85% |
| Divergência entre decisão final e o previsto pelo registro contínuo | queda trimestre a trimestre |
| Tempo do sinal "em risco" até a primeira intervenção | < 14 dias |
| Turnover regretido de alto desempenho (12m) | queda vs. baseline |

**Contra-métrica que pode matar o projeto — e eu meço de propósito:**
> **Índice de confiança/vigilância.** Duas perguntas trimestrais: *"eu confio no que o Brain registra sobre mim"* e *"eu me sinto vigiado"*. Se a segunda subir, o sistema está falhando mesmo que todo o resto melhore.

**Critérios de kill:**
- 8 semanas de piloto sem a latência mediana cair abaixo de 14 dias → o problema é capacidade de gestão, não ferramenta. Pivota pra habilitação de gestor.
- Percepção de vigilância acima do baseline → desliga a ingestão e reconstrói com escopo menor.

---

## 9. Operating model — como isso é implantado

O case é pra **Forward Deployment**. A implantação é parte da resposta, não anexo. E repara: a fase 1 do produto **é** o trabalho do FDE.

**Semanas 0–2 · Setup (o trabalho de FDE)**
Conectar Slack, Google, HRIS, git, CRM — e backfill de 12 meses. Em paralelo, o que não é técnico: sentar com 6–8 gestores e escrever a régua por trilha, **desafiando** o ladder existente. Definir o que conta como evidência em cada função. Medir baseline de latência com o ciclo antigo.

**Semanas 3–6 · Modo sombra, transparente**
O registro se constrói; ninguém decide nada com ele. Mas **o colaborador vê o dele desde o dia 1**. Objetivo desta fase é colher correção. Métrica: quantas pessoas anotaram ou contestaram o próprio registro. Muitas correções = ótimo sinal.

**Semanas 7–12 · Piloto em 2 orgs (~120 pessoas)**
Uma de Engenharia (evidência densa), uma de GTM (média). Liga elicitação, nudge, estrela e chat. **O resto da empresa segue no processo antigo — é o grupo de controle.**

**Mês 4 · A prova**
O piloto roda o fechamento lendo o registro; o controle preenche formulário. Compara: horas gastas, taxa de surpresa, densidade de evidência, e quanto a calibração mudou de posição. **Essa comparação é o material de venda pros outros 580.**

**Mês 6+ · Aposentar o formulário.** E primeira recalibração da régua por evidência.

---

## 10. Por que vale a pena

**Para a Aurora:**
- ~5.800 h/ano recuperadas (≈ R$ 1,5–2M em custo de tempo de gestão).
- Mas o retorno real não é economia de tempo — é **latência de correção**. Numa empresa de 700 pessoas crescendo, a diferença entre corrigir uma trajetória em 7 dias ou em 120, repetida centenas de vezes por ano, é a diferença entre uma organização que aprende e uma que só cresce.
- A régua escrita, sozinha, já resolve metade da dor de calibração — antes de qualquer IA rodar.
- E o ativo lateral: histórico documentado e rastreável, com valor concreto em contencioso trabalhista e due diligence.

**Para a Comp:**
- **Não é ferramenta de performance. É a memória da organização.** Avaliação é uma query contra ela. Promoção é outra. Comp é outra. Sucessão é outra. Recrutamento é outra (calibrar a barra com dado de quem deu certo dentro). L&D é outra (gap de skill observado, não declarado). **TAM maior e narrativa mais defensável do que "mais um módulo de performance".**
- **Performance é a nascente.** Comp, promoção, sucessão e workforce planning são todos *downstream* de "quem fez o quê e com que impacto". Quem for dono da camada de evidência é dono das decisões. Pra uma empresa chamada **Comp**, isso não é adjacente — é a montante do produto principal.
- **O registro é ativo composto.** Formulário é commodity, qualquer um copia em 3 meses. Memória organizacional de 18 meses + a régua aprendida de uma empresa específica não se copiam, e o custo de troca sobe todo mês. É o equivalente em RH de um data moat.
- **Timing e geografia.** Workday, Lattice e Culture Amp são *form-first* colando IA por cima — a arquitetura deles impede que a IA seja estrutural, porque o dado deles nasce no formulário. A janela pra nascer AI-native é agora, e o ângulo LATAM (LGPD, CLT, português/espanhol, cultura de gestão local) é defensável contra produto americano traduzido.

---

## 11. Roteiro do vídeo (8–15 min)

| Bloco | Tempo | Conteúdo |
|---|---|---|
| 1. Premissas | 0:40 | As 5 premissas, rápido. Sinaliza rigor. |
| 2. **O reframe** | 2:30 | Problema de memória, não de processo. Os 3 loops fundidos. **Não mate o ciclo, mate o formulário.** |
| 3. Filosofia | 1:30 | Os princípios, cada um com sua consequência de produto. |
| 4. Setup | 1:00 | A régua viva. "Metade da injustiça é bar não-publicado." |
| 5. Fluxo 1 — Captura | 2:30 | A pergunta que fecha lacuna **e** vira atenção. Cronometrado. |
| 6. Fluxo 2 — Avaliação | 2:30 | Chat dos dois lados, a estrela, e a IA recusando. |
| 7. Fluxo 3 — Fechamento | 2:00 | `/org`: dossiê + drill-down + diagnóstico de organização. |
| 8. IA estrutural | 1:00 | Teste do "remova a IA". N3→N4→N5 e os 3 pontos onde o loop fecha. |
| 9. Não-construí + trade-offs | 1:30 | Os 3 "nãos" mais fortes e os 2 trade-offs mais duros. |
| 10. Métricas + por que importa | 1:00 | Latência como north star, a contra-métrica de vigilância, e o argumento pra Comp. |
| **Total** | **~16 min** | *cortar 1–2 min no bloco 3 e no 9 na edição* |

**Regra de execução: abrir com o reframe, não com o protótipo.** Eles disseram explicitamente que é ali que se diferencia.

---

## 12. Próximos passos

1. **Conteúdo da Aurora** — 8–10 personas com histórias coerentes que atravessam os 3 fluxos (Carla/promoção, Rafa/travado por Dados, Bruno/esquecido, um gestor com cobertura zero). O mesmo dado tem que sustentar os três fluxos, senão o protótipo se contradiz em cena.
2. **Régua** — escrever o ladder de 2 trilhas (Eng e Sales) em 3 níveis. É o que dá credibilidade ao Setup e ao dossiê.
3. **Protótipo** — Next.js estático, dados mockados, sem backend (link único, sem dependência de workspace real). O Slack aparece como **integração e fonte** em `/integrations`, nunca como interface imitada.
4. **Gravação.**

**AI Appendix — não deixar pro fim.** O case pede log completo da conversa, onde a IA errou e onde eu sobrescrevi. Anotar em tempo real. Já tem material: a arquitetura inicial de 3 camadas errou ao assumir que a evidência está toda no rastro digital e ao promover "atenção" a camada primitiva — o loop de elicitação e a fase de Setup vieram de correção humana, não da IA.
