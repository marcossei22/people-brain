---
description: Use quando perguntarem onde alguém está em relação a um nível, o que falta para subir, ou se está pronta para promoção.
---

# Comparar uma pessoa com a régua

## Procedimento

Duas rodadas, não cinco.

1. **Primeira rodada, tudo junto:** `buscar_pessoas` (trilha e nível atual) + `ler_temas` +
   `ler_episodios` + `listar_lacunas` com `status: "aberta"`, todos da pessoa.
2. **Segunda rodada:** `ler_regua` do **nível alvo** — o próximo, não o atual. Só aqui porque
   depende da trilha e do nível que a primeira rodada devolveu.

Os temas já vêm com o texto do comportamento da régua que cada um sustenta, e os episódios já
trazem os `eventoIds`. Só chame `ler_eventos` se precisar da frase exata de um evento que não
apareceu — normalmente não precisa.

## Como julgar cada comportamento

Percorra **comportamento a comportamento**, na ordem da régua. Para cada um, classifique:

- **sustentado** — há episódio com evidência direta e mais de uma ocorrência
- **parcial** — há evidência, mas de uma vez só, ou o registro mostra o resultado e não a ação
- **sem-evidência** — não há registro

**"Sem evidência" não é o mesmo que "não faz".** Escreva isso quando for o caso, principalmente
se a densidade de evidência da pessoa for média ou baixa. Um comportamento sem evidência numa
pessoa de densidade baixa é um pedido de pergunta, não um veredito.

**Um episódio é uma ocorrência.** Antes de classificar, conte: quantos episódios distintos
sustentam este comportamento? Dois ou mais é `sustentado`; um só é `parcial`; nenhum é
`sem-evidencia`. E um tema que já aponta para o comportamento vale como evidência dele — é
justamente o que `comportamentosRegua` do tema significa. Contar antes de julgar é o que impede
a mesma pergunta de sair com veredito diferente em duas tomadas.

Nunca some, nunca dê nota, nunca diga se a pessoa deve ou não ser promovida. Você mostra a
evidência contra a expectativa; quem decide é o comitê.

## Renderize

Com `gap`, preenchendo `pessoa`, `nivelAtual`, `nivelAlvo` e `comportamentos[]` — cada um com
`texto`, `situacao`, `evidencias[]` (só o `eventoId`) e `observacao` quando faltar evidência.

Se a pergunta foi sobre **um** comportamento ("ela é boa em mentoria?", "ela já influencia outros
times?"), o card traz **só esse**. A régua inteira é a resposta de "onde ela está em relação ao
nível", não de uma pergunta pontual.
