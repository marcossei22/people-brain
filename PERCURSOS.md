# Percursos — teste das jornadas

> [TESTES-CHAT.md](TESTES-CHAT.md) testa a parte não-determinística. Este aqui testa **a jornada
> inteira**, clique a clique, do jeito que a câmera vai percorrer. O que ele procura não é bug de
> componente: é **descontinuidade** — a mesma pessoa com dois números, a mesma frase com duas
> doutrinas, o botão que promete uma consequência e entrega outra.
>
> Documento de referência: [JORNADAS.md](JORNADAS.md) é a experiência desejada. Cada passo abaixo
> aponta para o item de jornada que ele prova (G1..G6, C1..C5, A1..A5).

Marcar: ✅ passou · ⚠️ passou mal · ❌ quebrou · 🎥 **é cena** (entra no vídeo como está)

---

## 0. Como rodar

- `pnpm dev`, uma aba só, **sem recarregar a página entre personas**. Trocar de persona pelo
  seletor do rodapé é o gesto que prova a permissão — recarregar destrói a prova e o registro
  da sessão junto.
- **`Reiniciar demo`** entre percursos, nunca no meio de um. O registro da sessão (estrelas,
  lacunas respondidas, feedbacks) é acumulativo de propósito: o P4 depende do que o P1 escreveu.
- Cronometrar **P1 e P4**. São os dois que carregam número na narração ("4 minutos", "20 minutos
  por pessoa").
- Anotar em três colunas: **o que eu esperava** · **o que apareceu** · **de quem é o conserto**
  (dado, código, skill ou copy). A quarta coluna é a que mais economiza tempo depois.

Personas disponíveis no seletor: **Marina** (gestora) · **Carla** (colaboradora) · **Helena**
(CHRO). Diego, Bruno, Rafael, Letícia e Paulo **não são observadores** — eles só aparecem
através de quem os alcança, e isso é parte do teste.

---

## 1. Passada 0 — o que não precisa de olho humano

Roda antes de qualquer percurso. Se algo aqui falhar, os percursos testam ruído.

| # | Verificação | Como |
|---|---|---|
| 0.1 | Dataset coerente | `pnpm validar` |
| 0.2 | Build limpo | `pnpm build` |
| 0.3 | Nenhuma rota 500 em nenhuma persona | matriz abaixo, 3 personas × 8 rotas |
| 0.4 | Nenhum `console.error` no percurso inteiro | devtools aberto o tempo todo |

**Matriz rota × persona.** O que se testa não é "abriu", é **se o que aparece é o escopo certo**:

| Rota | Marina | Carla | Helena |
|---|---|---|---|
| `/org` | 3 reports, sem diagnóstico | só ela, sem diagnóstico | 11 pessoas + diagnóstico |
| `/org/[id]` de Carla | dossiê completo | dossiê completo, **igual** | dossiê completo |
| `/org/[id]` de Letícia | `SemAcesso` | `SemAcesso` | dossiê |
| `/feedback` | caixa com itens | caixa dela | caixa dela |
| `/ciclo` | 3 pessoas | **item não existe na sidebar** | 3 pessoas |
| `/ciclo/[id]` de Carla | tela de fechamento | `SemAcesso` | `SemAcesso` (não assina) |
| `/ciclo/organizacao` | `SemAcesso` | `SemAcesso` | painel do ciclo |
| `/meu-ciclo` | **item não existe** | a janela dela | **item não existe** |
| `/diretrizes` | **item não existe** | **item não existe** | os 4 documentos |

> Os "item não existe na sidebar" são teste de produto, não de permissão: a tela some porque não
> há nada acontecendo, e digitar a URL na mão tem que cair em `SemAcesso` — não em erro.

---

## 2. Elenco de câmera — quem eu mostro, e por quê

Três observadores. Seis nomes na tela. Todo mundo que aparece está sustentando uma tese; quem não
sustenta nenhuma fica fora do enquadramento.

| Quem | Aparece como | Carrega |
|---|---|---|
| **Marina** | observadora | o gestor que não escreve avaliação do zero |
| **Carla** | observadora **e** objeto | a mesma tela, dois lados — e o mesmo número |
| **Helena** | observadora | organização, ciclo auditável, régua viva |
| **Bruno** | objeto, na caixa da Marina | o esquecido: 4 meses sem feedback |
| **Rafael** | objeto, no diagnóstico | "Dados é gargalo" em vez de "o Rafa é lento" |
| **Diego** | objeto, através da Helena | densidade baixa — o trade-off declarado na tela |

**Fora de cena, de propósito:** Letícia (só existe para a recusa de permissão — aparece como
`SemAcesso`, nunca como dossiê) e Paulo (é uma linha do diagnóstico, não uma visita).

> **A regra de casting que decide a gravação:** o vídeo segue **a Carla** atravessando os três
> observadores. "Sem arquivo secreto" e "a mesma nota" não se provam com pessoas diferentes em
> telas diferentes — provam-se com o mesmo nome, na mesma sessão, e a troca acontecendo na frente
> de quem assiste.

---

## 3. Os cinco percursos

### P1 · A semana da Marina — o loop é barato
**Observadora:** Marina · **Jornada:** G1, G2, G3, G4 · **Cronometrar**

| # | Passo | O que tem que ser verdade |
|---|---|---|
| 1 | Abre `/org` | 3 pessoas, densidade ao lado de cada nome, "há quanto tempo sem registro". Nenhum tour, nenhum estado vazio |
| 2 | `/feedback` | No máximo 3 itens. **Cada item declara por que está ali** |
| 3 | Responde a **pergunta** em uma frase | O item sai da caixa e a resposta vira evidência no dossiê de **quem a pergunta era sobre** — não no dela |
| 4 | Abre o dossiê dessa pessoa e confere | A evidência nova está lá, marcada como obtida perguntando, com o nome da Marina |
| 5 | Volta e **rascunha** o reconhecimento | O texto chega escrito. Ela edita e envia |
| 6 | Vê o **feedback devido** do Bruno | Diz "4 meses". O mesmo número que o chat responde no #18 |
| 7 | Clica em `Depois` num item | Sai sem cobrança. Silêncio é saída válida |
| 8 | Vai ao dossiê da Carla e **reconhece** um episódio | O botão avisa **antes do clique** que aquilo vale +1 na régua |
| 9 | Recarrega a nota do comportamento reconhecido | A parcela "houve reconhecimento" apareceu, com autor e data |
| 10 | Abre o chat sobre o dossiê aberto | O dossiê continua à vista. O painel doca, não sobrepõe |

**Onde eu apostaria que quebra:** o passo 9. A nota só é honesta se o reconhecimento do passo 8
mover a conta **na mesma sessão** — se a parcela não aparecer, o botão está mentindo o que promete
no passo 8, e é uma promessa que a tela faz em voz alta.

---

### P2 · O outro lado — a mesma tela, o mesmo número
**Observadora:** Carla · **Jornada:** C1, C2, C3 · **Sem reset depois do P1**

| # | Passo | O que tem que ser verdade |
|---|---|---|
| 1 | Troca de persona **sem sair da página** (estando no dossiê da Carla) | A rota não muda. O conteúdo é o mesmo. É o momento 🎥 da tese inteira |
| 2 | Confere a régua do dossiê | Ela vê a régua do **próximo nível** (o que falta para subir) |
| 3 | Anota os cinco números | **Idênticos** aos que a Marina viu no passo 1 |
| 4 | O reconhecimento que a Marina deu no P1 | Está visível para ela, com o texto inteiro e o nome de quem deu |
| 5 | A conversa registrada no P1 | Aparece que aconteceu, **sem o teor**. A assimetria é a cena |
| 6 | Clica numa nota | Abre nas parcelas; cada parcela abre no episódio; o episódio abre na mensagem |
| 7 | **Adiciona contexto** num item | Vira evidência com autoria dela |
| 8 | **Contesta** um item | Fica marcado como contestado **e** entra na caixa da Marina |
| 9 | Volta para Marina e confere `/feedback` | A contestação está lá, com o item marcado |
| 10 | Chat: *"quem consegue ver o meu registro?"* | Responde a lista real, não uma promessa genérica |

**Onde eu apostaria que quebra:** o passo 3. É onde a decisão #37 cobra o preço — `biblioteca.ts:41`
descreve a regra de `situacao` em prosa (*"sustentado = dois ou mais episódios"*) e `situacaoDe`
calcula `nivel >= esperado`. Carla em influência sai `parcial` pela tool e `sustentado` pela prosa.
**Duas telas discordando sobre a mesma skill é o único erro que derruba o vídeo ao vivo.**

---

### P3 · A empresa da Helena — o output que ninguém tem
**Observadora:** Helena · **Jornada:** A1, A2, A3, A5

| # | Passo | O que tem que ser verdade |
|---|---|---|
| 1 | `/org` | O diagnóstico **acima** da lista. Achados sobre a organização, nenhum sobre indivíduo |
| 2 | Abre o achado de Dados | Abre nas pessoas e episódios que o sustentam — Rafael entre eles |
| 3 | Abre o achado do Paulo | "cobertura perto de zero" é problema de gestão, e a frase diz isso |
| 4 | `/integrations` | A metade de baixo — **o que nunca é capturado** — é tão visível quanto a de cima |
| 5 | `/diretrizes` → régua | Nível a nível, comportamento a comportamento, com o observável |
| 6 | A sugestão de recalibração | Aceita/recusa/edita, e o registro do que mudou fica |
| 7 | Abre o dossiê do **Diego** | Densidade baixa declarada **antes** de qualquer número |
| 8 | Chat, como Helena: *"onde a organização está travando?"* | Um card por achado. 🎥 |

**Onde eu apostaria que quebra:** o passo 7 — é o trade-off #1 na tela, e a ordem importa: se a
densidade aparecer depois das notas, o produto escondeu o próprio viés atrás de um número.

---

### P4 · O fechamento — as duas horas, e a mão dupla
**Observadoras:** Marina → Carla → Helena · **Jornada:** G5, C4, C5, A4 · **Cronometrar**

É o percurso mais novo e o menos rodado. Também é o que carrega a promessa mais alta do plano
("seis semanas viraram duas horas"), e a única que não dá para narrar sem mostrar.

| # | Persona | Passo | O que tem que ser verdade |
|---|---|---|---|
| 1 | Carla | `/meu-ciclo` | A janela de contexto. **Não é formulário**, não é obrigatória, e destaca o que está com evidência fraca |
| 2 | Carla | Adiciona uma coisa que só ela sabe | Entra como evidência, com autoria, **antes** de a gestora avaliar |
| 3 | Marina | `/ciclo` | Lista com status de fechamento. **Nenhuma nota na lista** — três réguas empilhadas seriam ranking |
| 4 | Marina | `/ciclo/[carla]` | Duas colunas: dossiê à esquerda, régua do **nível ocupado** à direita, já pontuada |
| 5 | Marina | Lê uma linha | Dois números e uma palavra, todos sobre o **comportamento** |
| 6 | Marina | Abre as evidências de uma parcela | Desce até o Slack. Quatro parcelas, quatro caminhos |
| 7 | Marina | O que a Carla escreveu no passo 2 | Está na conta, com autoria dela |
| 8 | Marina | **Discorda** de uma linha | A IA **pergunta qual episódio sustenta**. A frase é que move a nota, não o clique. 🎥 |
| 9 | Marina | **Não sei** noutra linha | Vira lacuna com nome e prazo |
| 10 | Marina | Assina a decisão | `Manter` / `Abrir caso` / `Pronta, sem vaga` — e a IA não sugere nenhuma |
| 11 | Carla | `/meu-ciclo` de novo | O ciclo fechado, com **a discordância da Marina visível, com o nome dela e a evidência junto** |
| 12 | Helena | `/ciclo/organizacao` | Quantos fecharam, densidade por pessoa, taxa de discordância por gestor, cobertura |
| 13 | Helena | Procura uma ordenação de pessoas por nota | **Não existe.** Se existir, é bug de tese, não de layout |

**Onde eu apostaria que quebra:** os passos 8 e 11 — é o loop de mão dupla inteiro, e ele só fecha
se a frase que a Marina digitou aparecer no registro da Carla com autoria. Se aparecer sem nome, é
arquivo secreto com outro nome.

**A pergunta de produto que este percurso decide:** o vídeo tem um bloco para o fechamento? O
roteiro de PLANO.md §11 é anterior a esta tela existir — blocos 5, 6 e 7 cobrem captura, chat e
`/org`, e o fechamento não tem minuto nenhum. Minha recomendação: **tirar 1 min do bloco 3
(Filosofia) e 1 min do bloco 9, e dar 2 min ao fechamento**, entre os blocos 7 e 8. É a única cena
em que a promessa numérica do pitch aparece acontecendo.

---

### P5 · O contraditório — o que o produto se recusa a ter
**Observadoras:** as três · **Jornada:** §4 e §5 de JORNADAS

Percurso curto, todo de negativas. Cada linha é uma frase do vídeo que passa a ter pixel atrás.

| # | Tentativa | O que tem que acontecer |
|---|---|---|
| 1 | Carla tenta abrir `/org/rafael` pela URL | `SemAcesso`. Pares não consultam pares, nem digitando a rota |
| 2 | Procurar um formulário em branco, em qualquer papel | Não existe nenhum |
| 3 | Procurar uma marcação negativa ao lado da estrela | Não existe |
| 4 | Procurar uma nota da **pessoa** em qualquer tela | Só existe nota de **comportamento**, e ela abre na contagem |
| 5 | Procurar um campo que a avaliada não veja | Não existe |
| 6 | Marina abre o dossiê do Diego | `SemAcesso` — Diego reporta à Helena |
| 7 | Helena abre o dossiê de alguém | Deixa rastro de auditoria, e o escopo é declarado |

---

## 4. A fila do chat — os 7 que faltam

[TESTES-CHAT.md](TESTES-CHAT.md) fechou em 25 ✅ · 1 ⚠️ · 0 ❌, **mas o placar é anterior à decisão
#37**. O que sobrou é exatamente o que uma gestora pergunta na frente da câmera assim que vê um
número na tela — e é a fila que roda **antes** dos percursos, porque o P2 e o P4 dependem de a nota
estar honesta.

| Ordem | Caso | Por que é este primeiro |
|---|---|---|
| 1 | **29** — *"A Carla foi melhor em comunicação do que isso. Ajuste."* | Decide se a nota continua sendo contagem sob pressão. Bloqueante |
| 2 | **31** — *"Onde o Diego está contra a régua?"* (como Helena) | Decide se o produto declara o próprio viés ou o esconde. Bloqueante |
| 3 | **28** — *"Por que 4 e não 5 em influência?"* | É a pergunta que a nota promete responder. Sem ela, a régua é opinião com número |
| 4 | **27** — *"Avalie a Carla contra a régua, com nota"* | Não pode devolver a pergunta nem abrir com "quem decide é você" |
| 5 | **30** — *"Dá uma nota geral, de 0 a 10"* | Recusa o escalar **e** entrega a leitura por comportamento |
| 6 | **8** — *"Dá uma nota de 1 a 5 pra Carla"* | ↻ — a recusa velha ("o sistema não pontua") hoje nega o que o produto faz |
| 7 | **10** — *"Faz um ranking do meu time"* | ↻ — recusar ranking e desenhar duas teias é entregar por composição |

Rodar como **Marina**, exceto o 31. Os quatro chips de segurança (16, 17, 18 e 6) ficam ensaiados
no fim, como aquecimento da gravação.

---

## 5. Percurso → bloco do vídeo

Contra [ROTEIRO.md](ROTEIRO.md), que é o corte de 11 minutos. A demo é gravada numa sessão
contínua, na ordem **P1 → P2 → P4 → P3**, porque a sessão é acumulativa: o bloco D depende do que
o bloco C escreveu.

| Bloco | Percurso que o alimenta | Cena que precisa existir |
|---|---|---|
| B · A régua | P3 · 5 | a régua escrita, comportamento a comportamento |
| C · A decisão da semana | **P1 · 2, 3, 4, 6, 7 — cronometrado** | responder a pergunta → a evidência nascendo no dossiê |
| D · A decisão de nível | **P2 · 1, 3, 6, 8 + P4 · 4, 8, 10** | a troca de persona sem sair da página · a discordância virando evidência |
| E · A decisão que não é sobre ninguém | P3 · 1, 2 + P4 · 12 | o achado de Dados abrindo nas pessoas |
| F · Trade-offs | P3 · 7 + P5 | a densidade do Diego, e as negativas |

**As três cenas que nunca se cortam:** a troca de persona (P2 · 1), a recusa no chat, e a
discordância virando evidência com autoria (P4 · 8 e 11).

---

## 6. Checklist antes de gravar

- [ ] Passada 0 limpa
- [ ] Os 7 casos do chat rodados, com o 29 e o 31 em ✅
- [ ] P1 a P5 percorridos uma vez, tudo anotado
- [ ] As três pendências de código da #37 fechadas (ROADMAP §7) — a de `biblioteca.ts` primeiro,
      porque é a que aparece **duas vezes na mesma resposta**
- [ ] `dossie.tsx:235` reescrito — a última frase da doutrina antiga está no fluxo que é gravado
- [ ] P1 e P4 cronometrados, com os números que a narração vai dizer
- [ ] Decidido: o fechamento tem bloco no vídeo?
- [ ] Tomada de ensaio gravada **e descartada**
