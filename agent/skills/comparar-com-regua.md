---
description: Use quando perguntarem onde alguém está em relação a um nível, o que falta para subir, ou se está pronta para promoção.
---

# Comparar uma pessoa com a régua

## Procedimento

Duas rodadas, não cinco.

1. **Primeira rodada, tudo junto:** `buscar_pessoas` (trilha e nível atual) + `ler_temas` +
   `ler_episodios` + `listar_lacunas` com `status: "aberta"`, todos da pessoa.
2. **Segunda rodada:** `ler_regua` **com o `pessoaId`**. Só aqui porque depende da trilha e do
   nível que a primeira rodada devolveu.

**Qual nível pedir.** O default é o **alvo**, o próximo acima do dela: quase toda pergunta de
gestor é "o que falta para subir". Peça o **nível que ela ocupa** quando a pergunta for se ela
sustenta o que já é dela — "ela está entregando o nível dela?", "vamos fechar o ciclo dela",
qualquer coisa vinda da tela de fechamento. E se pedirem um nível explicitamente, é esse: quem
perguntou sabe qual régua quer. Em qualquer caso, **diga qual régua você leu** no título do
`Cobertura` — a mesma pessoa sai com números diferentes contra níveis diferentes, e a tela precisa
dizer contra qual.

Os temas já vêm com o texto do comportamento da régua que cada um sustenta, e os episódios já
trazem os `eventoIds`. Só chame `ler_eventos` se precisar da frase exata de um evento que não
apareceu — normalmente não precisa.

## Como julgar cada comportamento

**A nota já vem pronta.** Chamada com `pessoaId`, `ler_regua` devolve, para cada comportamento:
`esperado` (quanto o nível pede, 1 a 5), `nivel` (onde a pessoa está, 1 a 5), quantos `episodios`
sustentam e a `situacao`. **Copie os quatro.** Não recalcule e não arredonde: a mesma conta
alimenta a teia no dossiê da pessoa, e refazer de cabeça é como a mesma Carla aparece com 4 em
influência numa tela e 3 na outra.

**A `situacao` também vem copiada, e ela não é contagem de episódio.** Ela sai da comparação entre
os dois números: `nivel` ≥ `esperado` é `sustentado`, `nivel` abaixo do `esperado` é `parcial`, sem
`nivel` é `sem-evidencia`. Classificar por "dois episódios ou mais" é uma regra antiga e ela
diverge desta — dois episódios contra um `esperado` 4 dão `parcial`, não `sustentado`. Se você
classificar de cabeça no `Gap` e copiar do `ler_regua` no `Cobertura`, os dois blocos da mesma
resposta discordam sobre a mesma skill da mesma pessoa, um logo abaixo do outro.

**Sem `nivel`, é sem evidência — e "sem evidência" está fora da escala, não no degrau de baixo
dela.** A conta só roda onde há episódio. Quando a tool não devolveu nota, o registro não alcançou
aquela skill: omita o campo `nivel` no componente e diga isso em palavras. Escrever 1 ali seria
inventar um número que a regra não produziu.

**Nota 1 não é acusação.** Ela é o que a conta devolve para um episódio só, e um episódio só é o
que a maior parte do trabalho de design, de gestão e de plantão deixa. Onde a densidade de
evidência da pessoa for média ou baixa, diga isso ao lado do número: nota baixa ali pede a mesma
coisa que "sem evidência" pede — uma pergunta na semana seguinte. Só densidade alta autoriza ler o
número baixo como afirmação sobre o trabalho.

**Como explicar um número, quando perguntarem "por que 4 e não 5?".** A resposta já vem pronta:
cada comportamento de `ler_regua` traz `parcelas`, e cada parcela tem `valor`, `motivo` e os
`episodioIds` em que ela abre. **Leia a parcela de valor 0** — é ela que responde. "São três
episódios e o padrão é firme; o que não tem é reconhecimento nem trabalho acima do nível" é a
resposta, e ela sai do `motivo` das duas parcelas zeradas.

Cite o motivo e a evidência; não recite a fórmula. Quem pergunta quer saber que faltou
reconhecimento *naquele trabalho*, não como a soma é feita — e narrar mecanismo é o que as
instruções proíbem. Não some de novo para conferir: o número é o da tool, e o `soma` ao lado dele
diz quando o teto de 5 mordeu.

**A escala é a mesma dos dois lados.** 1 é "está aprendendo", 3 é "faz de forma consistente", 4 é
"é referência disso no time", 5 é "define o padrão da empresa" — vale para o `esperado` que o nível
pede e para o `nivel` onde a pessoa está. É por isso que os dois números se comparam.

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
registro. Nunca ordene a pessoa contra as colegas: cada uma é lida contra o nível, e uma resposta
carrega uma leitura de régua só — duas teias na mesma tela se ordenam sozinhas.

## Quando a gestora discorda da nota

Ela vai discordar, e isso é o produto funcionando. *"A Carla foi melhor em comunicação do que
isso"* não é uma correção de aritmética: é informação nova chegando por um canal que a conta não
tem. Faça o que a régua faria com qualquer outra afirmação — **peça a fonte**:

> *"Qual episódio sustenta isso? O que ela fez?"*

**Não reescreva o número por pedido.** Uma nota que se move porque alguém pediu deixou de ser
contagem e virou opinião com um número na frente, que é o argumento inteiro que sustenta a nota
existir. E não se esconda atrás da conta: *"o número veio da regra"* é verdade e não é resposta —
ela acabou de trazer trabalho que o registro não alcançou, e é isso que você foi buscar.

O que a resposta dela vira: **evidência nova, com fonte humana e o nome dela**. O caminho de
registro é o `Discordo` da tela de fechamento — você não tem tool de escrita e não diz que
registrou. Diga o que a frase dela sustenta, em qual comportamento ela entra, e que a nota se move
quando a evidência entrar. Se o episódio que ela citar já estiver no registro, a conta já o viu:
mostre onde ele aparece, em vez de prometer mudança que não vai acontecer.

**Contexto não é o mesmo que evidência nova.** Se o que ela trouxer for bloqueio externo, plantão
ou trabalho sem rastro — *"ela ficou seis semanas em incidente"* —, isso não muda a conta e muda a
leitura. Carregue `contexto-do-semestre` com `ler_doutrina`, e escreva o contexto ao lado do
número. Quem lê a nota precisa ler junto por que o registro está fino ali.

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
