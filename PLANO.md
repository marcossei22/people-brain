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
Loop contínuo = desenvolvimento (privado, do colaborador, sem consequência de mérito). Loop periódico = julgamento (calibrado, transparente, com consequência).
→ Duas superfícies, duas regras de visibilidade. Feedback de coaching **não** entra automaticamente em calibração.

**4. Sem arquivo secreto. O colaborador é o primeiro leitor do próprio registro.**
Tudo que a IA captura sobre a pessoa é visível pra ela, no mesmo instante, com a fonte. Ela anota, contextualiza, contesta.
→ É a espinha moral **e** o maior driver de qualidade de dado: ela corrige o que a IA errou. Nenhum sistema de vigilância consegue isso.

**5. A IA comprime evidência. O humano decide.**
A IA nunca pontua uma pessoa, nunca gera rating, nunca recomenda demissão. Ela lembra, organiza, cita, pergunta e rascunha.
→ Linha vermelha de arquitetura, não disclaimer de compliance.

**6. Performance é propriedade do sistema, não só da pessoa.**
Contexto importa: projeto ruim, expectativa mal definida, dependência travada, troca de gestor.
→ O fechamento produz **diagnóstico de organização**, não só 700 vereditos. (§3.4)

**Sobre o gestor:** o modelo o trata como **editor e treinador**, não autor e escriba. Hoje pedimos que ele seja historiador (lembrar), redator (escrever) e juiz (decidir). Ele é ruim nos dois primeiros, e o terceiro é o único que só ele pode fazer. Tire os dois primeiros dele.

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

Meu desenho original era todo centrado em evidência: capturar o que aconteceu. Mas **evidência sem régua é diário.** Não dá pra dizer que a Carla está acima do nível dela sem uma definição do nível dela. A IA comprime seis meses de trabalho; ela não julga sem saber o que a empresa espera.

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

A estrela gruda no **episódio** ("essa migração foi acima do nível dela"), nunca na Carla como escalar. Isso não viola a linha vermelha de §2.5 — é humano marcando evento, não máquina pontuando gente. E ela vale muito mais que um "like":

- **Custo:** 1 segundo, contra 4 minutos de um feedback escrito. Você coleta ~50× mais sinal.
- **É rótulo de treino.** Cada estrela é um gestor ensinando o sistema o que é "bom" *aqui*. 500 estrelas × 58 gestores = o sistema aprende a régua real da empresa — que volta pro Setup e atualiza o ladder (§3.1). **É o loop fechado que a Comp exige acima de N4, com mecanismo concreto.**
- **Destrava a calibração.** Hoje são três horas de gestores discutindo de memória. Com 500 episódios marcados e com evidência, vira comparação de artefato, não de opinião.

**Duas guardas obrigatórias:**

**1. Estrela não é ranking.** Se "quem tem mais estrelas" virar critério, você reconstruiu métrica de popularidade com passos extras e os gestores gameiam em 60 dias. É input de evidência, nunca placar. O colaborador vê as dele; leaderboard não existe.

**2. Não existe estrela negativa.**

> **Reconhecimento pode ser um clique. Preocupação tem que ser uma conversa.**

Marcação de "isso foi mal" cria dossiê de deméritos: é gelado, é chilling, e no Brasil é passivo trabalhista puro. Quando o gestor quer sinalizar problema, o sistema **não oferece marcação** — oferece o rascunho da conversa. A assimetria é proposital e é coerente com separar treinador de juiz.

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
- Em nenhuma tela existe um número de 1 a 5 atribuído a uma pessoa pela IA.

---

## 6. O que eu escolhi NÃO construir

Onde se ganha ou se perde a entrevista. Cada "não" é aposta.

| Não construo | Por quê |
|---|---|
| **Score / rating de pessoa gerado por IA** | Mata a confiança no dia 1, é indefensável sob LGPD, e transfere pra máquina a única coisa que só o humano faz. Se eu construir isso, o resto do sistema é rejeitado por tabela. |
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

**1. Densidade de evidência é desigual — e enviesa.**
Eng e Sales deixam rastro rico; Design, People e Finance quase nada. Risco: legibilidade digital vira proxy de performance.
→ O loop de perguntar (§3.2) é a mitigação principal — onde o rastro é fino, o sistema *pergunta* em vez de adivinhar. Mais: captura manual em 1 clique (`/brain` numa thread), densidade **exibida** no dossiê ("17 evidências" vs. "3"), e nunca comparar trilhas de densidade diferente.
→ **A parte honesta:** no V1 este produto é melhor pra Eng e GTM que pra G&A. Eu digo isso no vídeo.

**2. Régua ruim aplicada com consistência perfeita.**
O Setup pode sistematizar um padrão ruim em 700 pessoas. → FDE desafia o ladder em vez de digitalizar; derivação por evidência corrige com o tempo. Mas é risco real, não hipotético.

**3. Fadiga.**
Mais toques = mais chance de virar ruído. → Teto rígido, silêncio permitido, e contra-métrica de taxa de dispensa. Acima de 50%, o modelo de detecção está errado, não o usuário.

**4. Latência vs. acurácia.**
Feedback rápido sobre evidência incompleta pode estar errado. → A IA **propõe**, não afirma; o rascunho carrega a evidência à vista pro gestor pegar o erro antes de enviar; e a ação default é *perguntar*, não *julgar*.

**5. O tempo do gestor não fica de graça.**
Não elimino o custo — troco 15h concentradas numa semana por ~20min/semana distribuídos (~17h/ano vs. ~28h/ano), com valor muito maior. Alguns gestores **preferem** o lote. Aposto contra eles: o lote é exatamente o que produz feedback genérico.

**6. O risco que pode derrubar tudo: coragem, não capacidade.**
Se o gestor não dá feedback porque **não quer o conflito**, IA nenhuma resolve. Ela ataca "não tenho tempo" e "não lembro dos fatos" — não a terceira barreira.
→ Mitigação de operating model, não de produto: ação default é observação e reconhecimento (baixo custo social), e a **cobertura de feedback do gestor fica visível pro gestor dele**. Deixa de ser tarefa invisível.

**7. "Feedback rascunhado por IA é autêntico?"**
A IA não dá a opinião — dá a memória, a evidência e a primeira frase. O julgamento é humano. E o benchmark honesto não é o feedback ideal: é o parágrafo genérico escrito às 23h do dia do prazo. Contra esse, ganho fácil.

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
