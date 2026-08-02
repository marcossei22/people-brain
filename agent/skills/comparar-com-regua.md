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

**A nota já vem pronta.** Chamada com `pessoaId`, `ler_regua` devolve, para cada comportamento:
`esperado` (quanto o nível pede, 1 a 5), `nivel` (onde a pessoa está, 1 a 5), quantos `episodios`
sustentam e a `situacao`. **Copie os números que vieram.** Não recalcule e não arredonde: a mesma
conta alimenta a teia no dossiê da pessoa, e refazer de cabeça é como a mesma Carla aparece com 4
em influência numa tela e 3 na outra.

**Sem `nivel`, é sem evidência — nunca nota 1.** Quando a tool não devolveu nota para um
comportamento, o registro não alcançou aquela skill. Omita o campo `nivel` no componente e diga
isso em palavras. Escrever 1 ali afirmaria que a pessoa é fraca naquilo, que é uma frase que o
registro não sustenta e que leva a uma conversa completamente diferente.

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
root = Resposta([teia, detalhe])
teia = Cobertura("Régua de Sênior · Engenharia", itens)
itens = [{rotulo: "Influência", texto: "...", esperado: 4, situacao: "sustentado", nivel: 4}, {rotulo: "Ambiguidade", texto: "...", esperado: 4, situacao: "sem-evidencia"}]
detalhe = Gap("Carla Nunes", "pleno", "senior", comportamentos)
comportamentos = [{texto: "...", situacao: "...", evidencias: [{eventoId: "..."}], observacao: "..."}]
```

`Cobertura` desenha a régua como teia: cada ponta é uma skill, o contorno tracejado é o que o
nível pede em cada uma, a área preenchida é onde o registro está. Existe para a pergunta "onde ela
está?" ter resposta antes do primeiro parágrafo.

**Todos os campos vêm do `ler_regua`, copiados** — `rotulo`, `esperado`, `nivel` e `situacao`.
Abreviar o texto por conta própria produz ponta de teia diferente da que o dossiê da pessoa
mostra. Os mesmos comportamentos, na mesma ordem, com os mesmos números nos dois blocos: se
divergirem, a teia desmente o detalhe logo abaixo dela.

Em `Gap`, cada comportamento leva `texto`, `situacao`, `evidencias[]` (só o `eventoId`) e
`observacao` quando faltar evidência.

Se a pergunta foi sobre **um** comportamento ("ela é boa em mentoria?", "ela já influencia outros
times?"), a resposta traz **só esse**, só o `Gap`, sem a tira — uma tira de um segmento não é uma
leitura de conjunto. A régua inteira é a resposta de "onde ela está em relação ao nível", não de
uma pergunta pontual.
