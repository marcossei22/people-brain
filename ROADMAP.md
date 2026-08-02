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
- [ ] 13 · **Teste adversarial do chat** → [TESTES-CHAT.md](TESTES-CHAT.md) (26 casos)
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
| 5 | IA nunca pontua pessoa | Confiança + LGPD + é a única coisa que só o humano faz |
| 6 | Estrela marca o **episódio**, não a pessoa | Preserva #5 e vira rótulo de treino |
| 7 | **Não existe estrela negativa** | Reconhecimento pode ser clique; preocupação tem que ser conversa. Dossiê de demérito é passivo trabalhista |
| 8 | Setup é loop, com régua derivada de evidência | Régua congelada morre; é o mecanismo de N5 |
| 9 | Cultura governa **tom**, nunca avaliação | Avaliar contra valores = política infalsificável |
| 10 | Diagnóstico de organização é output de 1ª classe | "Dados é gargalo" > "o Rafa é lento" |
| 11 | Orçamento de pergunta: 2/sem gestor, 1/sem IC | O recurso escasso é o direito de perguntar |
| 12 | Sem 360; par só sobre artefato que ambos tocaram | 360 é a carga que estamos matando |
| 13 | Chat responde sobre trabalho; recusa sobre estado | Ela não sabe — fingir seria o produto de vigilância |
| 14 | Nome: **People Brain** · *"O Brain lembra. As pessoas decidem."* | O nome é o reframe; o tagline neutraliza "a máquina julga" |

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

### O que eu verifiquei / sobrescrevi
| # | O quê |
|---|---|
| 1 | Mandei ler o **AI Maturity Map da Comp** em vez de assumir o que "AI-native" significa pra eles — daí saiu o mapeamento N3→N4→N5 e o critério "o loop de aprovação precisa fechar" |
| 2 | Sobrescrevi a arquitetura de camadas duas vezes (elicitação; depois 4 fases) |
| 3 | Sobrescrevi a decisão de Gen UI e a ordem de build |
| 4 | Mantive a recusa dele quanto a sandbox e Composio depois de ouvir o argumento — concordei, não cedi |

### Como usei IA
- [ ] Escrever no fim: Claude Code como par de discussão estratégica → spec → build. Destacar que a **direção** (elicitação, Setup, skills, UI-first) veio de mim e a **elaboração** veio do modelo.
- [ ] Exportar o transcript completo desta sessão.

---

## 7. Em aberto

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
| Elenco se contradiz entre fluxos | `validar.ts` no prebuild + conteúdo escrito numa passada só |
| Vídeo passa de 15 min | Roteiro cronometrado por bloco (PLANO.md §11); cortar filosofia primeiro |
| Perguntarem algo que o protótipo não cobre | §12 da ARQUITETURA (protótipo × produção) é a resposta pronta |
| Fase B trava em problema técnico | Alavancas do §4 · fachada `lib/agente/` isola o risco de framework |
