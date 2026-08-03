# AI Appendix — People Brain

Material pedido pelo case: o log das conversas com IA, como ela foi usada, onde errou, e o que
foi sobrescrito por decisão humana.

## O que está aqui

- **`transcricoes/`** — as sete sessões de trabalho com o Claude Code (30/07 a 03/08), exportadas
  na íntegra do lado da conversa: tudo que o humano escreveu e tudo que o modelo respondeu, na
  ordem. Tool calls aparecem como `[tool]` com o input truncado; as saídas de tool (leituras de
  arquivo, resultados de build) foram omitidas por volume.

## Onde está o resto

- **Como a IA foi usada, decisão a decisão** — [`ROADMAP.md §5`](../ROADMAP.md), o registro de
  decisões. As marcadas com ↩︎ são reversões: pontos onde a direção proposta (por mim ou pelo
  modelo) foi revertida durante a discussão.
- **Onde a IA errou e como foi pego** — [`ROADMAP.md §6`](../ROADMAP.md) e
  [`TESTES-CHAT.md`](../TESTES-CHAT.md): o teste adversarial de 31 casos contra o agente real,
  com os bugs que as passadas encontraram (a tool que nunca renderizou, o agente que não sabia
  quem perguntava, o chat que rodava sempre como a mesma persona) e os consertos.
- **O que foi verificado e sobrescrito** — o exemplo maior está em `ROADMAP.md §5` (decisão #37):
  a doutrina escrita afirmava que a IA não pontuava, o código já pontuava, e a contradição só
  apareceu numa varredura pedida por decisão humana — 17 pontos corrigidos.

## Divisão de trabalho, em uma frase

A direção — o loop de elicitação, o Setup como fase, as skills como doutrina, UI antes de
conteúdo, a decisão de a IA pontuar — veio do humano; a elaboração, o volume de código e a
primeira versão de quase todo texto vieram do modelo, com as discordâncias registradas nas
transcrições e no log de decisões.
