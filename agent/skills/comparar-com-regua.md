---
description: Use quando perguntarem onde alguém está em relação a um nível, o que falta para subir, ou se está pronta para promoção.
---

# Comparar uma pessoa com a régua

## Procedimento

Duas rodadas, não cinco.

1. **Primeira rodada, tudo junto:** `buscar_pessoas` (trilha e nível atual) + `ler_temas` +
   `ler_episodios` + `listar_lacunas` com `status: "aberta"`, todos da pessoa.
2. **Segunda rodada:** `ler_regua` do **nível alvo** — o próximo, não o atual —, **com o
   `pessoaId`**. Só aqui porque depende da trilha e do nível que a primeira rodada devolveu.

Os temas já vêm com o texto do comportamento da régua que cada um sustenta, e os episódios já
trazem os `eventoIds`. Só chame `ler_eventos` se precisar da frase exata de um evento que não
apareceu — normalmente não precisa.

## Como julgar cada comportamento

**A contagem já vem pronta.** Chamada com `pessoaId`, `ler_regua` devolve, para cada
comportamento, quantos `episodios` distintos o sustentam e a `situacao` que isso produz — dois ou
mais é `sustentado`, um só é `parcial`, nenhum é `sem-evidencia`. **Copie a `situacao` que veio.**
Não reconte: a mesma contagem alimenta a régua no dossiê da pessoa, e recontar de cabeça é como a
mesma Carla aparece com 4 de 5 sustentados numa tela e 1 de 5 na outra.

Percorra **comportamento a comportamento**, na ordem da régua, e para cada um escreva as
evidências (só o `eventoId`) e a observação.

**Feche com a leitura do conjunto.** Depois de percorrer a régua, diga onde a pessoa está: quantos
comportamentos o registro sustenta, quais faltam, e o que isso quer dizer sobre o nível. "Quatro de
cinco sustentados; o que falta é evidência de ambiguidade" é a resposta. Devolver a pergunta para a
gestora depois de ter lido a régua inteira não é cautela, é não responder.

**"Sem evidência" não é o mesmo que "não faz".** Escreva isso quando for o caso, principalmente
se a densidade de evidência da pessoa for média ou baixa. Um comportamento sem evidência numa
pessoa de densidade baixa é primeiro um pedido de pergunta — a leitura sai, com a ressalva de que
ela está sendo feita sobre pouco registro.

Quando a `situacao` for `parcial` ou `sustentado` mas o registro mostrar só o **resultado** e não
a ação — "a fila dedicada foi negociada" sem nada sobre quem articulou —, isso vai na
`observacao`, não na classificação. A contagem diz quanto o registro cobre; a ressalva diz o que
ele ainda não prova.

**A leitura é sua; a decisão é do comitê.** Diga onde a pessoa está contra a régua — é isso que
foi perguntado e é isso que você faz melhor que qualquer humano com doze reports. O que continua
não sendo seu é a decisão que vem depois: promover, ajustar comp, esperar mais um ciclo. Isso
depende de orçamento, de timing e de calibração entre times, que são coisas que não estão no
registro. Nunca ordene a pessoa contra as colegas: cada uma é lida contra o nível.

## Renderize

Dois blocos, nesta ordem: `Cobertura` e depois `Gap`.

```
root = Resposta([tira, detalhe])
tira = Cobertura("Régua de Sênior · Engenharia", itens)
itens = [{texto: "...", situacao: "sustentado"}, ...]
detalhe = Gap("Carla Nunes", "pleno", "senior", comportamentos)
comportamentos = [{texto: "...", situacao: "...", evidencias: [{eventoId: "..."}], observacao: "..."}]
```

`Cobertura` é a mesma lista de comportamentos sem a evidência: existe para a pergunta "onde ela
está?" ter resposta antes do primeiro parágrafo. Os mesmos comportamentos, na mesma ordem, com a
mesma `situacao` nos dois blocos — se divergirem, a tira desmente o detalhe logo abaixo dela.

Em `Gap`, cada comportamento leva `texto`, `situacao`, `evidencias[]` (só o `eventoId`) e
`observacao` quando faltar evidência.

Se a pergunta foi sobre **um** comportamento ("ela é boa em mentoria?", "ela já influencia outros
times?"), a resposta traz **só esse**, só o `Gap`, sem a tira — uma tira de um segmento não é uma
leitura de conjunto. A régua inteira é a resposta de "onde ela está em relação ao nível", não de
uma pergunta pontual.
