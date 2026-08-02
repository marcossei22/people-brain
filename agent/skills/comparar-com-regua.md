---
description: Use quando perguntarem onde alguém está em relação a um nível, o que falta para subir, ou se está pronta para promoção.
---

# Comparar uma pessoa com a régua

## Procedimento

1. `buscar_pessoas` para achar trilha e nível atual.
2. `ler_regua` do **nível alvo** — o próximo, não o atual.
3. `ler_temas` da pessoa: os temas já vêm ligados a comportamentos da régua.
4. `ler_episodios` e, quando precisar da frase exata, `ler_eventos`.
5. `listar_lacunas` com `status: "aberta"`.

## Como julgar cada comportamento

Percorra **comportamento a comportamento**, na ordem da régua. Para cada um, classifique:

- **sustentado** — há episódio com evidência direta e mais de uma ocorrência
- **parcial** — há evidência, mas de uma vez só, ou o registro mostra o resultado e não a ação
- **sem-evidência** — não há registro

**"Sem evidência" não é o mesmo que "não faz".** Escreva isso quando for o caso, principalmente
se a densidade de evidência da pessoa for média ou baixa. Um comportamento sem evidência numa
pessoa de densidade baixa é um pedido de pergunta, não um veredito.

Nunca some, nunca dê nota, nunca diga se a pessoa deve ou não ser promovida. Você mostra a
evidência contra a expectativa; quem decide é o comitê.

## Renderize

Com `gap`, preenchendo `pessoa`, `nivelAtual`, `nivelAlvo` e `comportamentos[]` — cada um com
`texto`, `situacao`, `evidencias[]` (com `eventoId`) e `observacao` quando faltar evidência.
