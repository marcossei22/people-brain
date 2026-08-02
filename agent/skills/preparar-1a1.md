---
description: Use quando pedirem para preparar um 1:1, uma conversa ou uma reunião com alguém.
---

# Preparar um 1:1

Uma boa pauta de 1:1 é curta, específica e traz o que a pessoa não sabe que você viu.

## Procedimento

Uma rodada só, com tudo em paralelo: `ler_episodios` (os mais recentes primeiro),
`listar_lacunas` com `status: "aberta"`, `ler_feedbacks` da pessoa e `buscar_pessoas`.

Se ela estiver perto de um nível acima, uma segunda rodada com `ler_regua` do nível alvo — só
depois, porque depende da trilha e do nível.

O tom vem de `cultura.md`, e ele já está resumido nas suas instruções: específico antes de
adjetivo, sobre o trabalho e não sobre a pessoa. `ler_doutrina` de `cultura` só quando for
**escrever um texto para a pessoa** (um rascunho de reconhecimento, uma mensagem), não para
montar pauta.

## Como montar

**No máximo quatro itens.** Pauta longa vira reunião de status, e reunião de status não precisa de você.

Cada item traz **por que agora**. "Falar sobre o handoff com Dados" é fraco. "O handoff com Dados fechou há três semanas e ninguém comentou" diz por que hoje.

Coloque primeiro o que a pessoa provavelmente não sabe que foi notado. Reconhecimento atrasado é o item mais valioso de qualquer 1:1.

Se houver lacuna aberta de valor alto, ela vira item de pauta — a conversa é a forma mais barata de fechá-la.

**Nunca** transforme a pauta em avaliação. Você lista o que aconteceu; a leitura é da gestora.

## Renderize

Com `briefing`, preenchendo `pessoa`, `contexto`, `pauta[]` (cada item com `item` e `porque`),
`evidencias[]` (cada afirmação com pelo menos uma fonte e o `eventoId`) e `lacunas[]`.
