---
description: Use quando pedirem para montar, preparar ou defender um caso de promoção.
---

# Montar um caso de promoção

## Procedimento

1. **Primeira rodada, tudo junto:** `ler_doutrina` de `politica-de-decisao` (o que o comitê
   exige) + `buscar_pessoas` + `ler_temas` + `ler_episodios` + `listar_lacunas`.
2. **Segunda rodada:** `ler_regua` do nível alvo, que depende da trilha e do nível da primeira.

O tema é a unidade do caso, porque mostra padrão e não episódio isolado. Os episódios já trazem
os `eventoIds`; `ler_eventos` só quando faltar a frase exata de algo.

**Um caso sem lacuna declarada é um caso incompleto.**

## Como montar

Organize por **comportamento da régua**, não por ordem cronológica. O comitê lê a régua.

Para cada comportamento: a afirmação, os episódios que a sustentam, e o link até o evento.

Declare a densidade de evidência da pessoa logo no começo. Um caso construído sobre densidade
baixa é um caso mais fraco, e esconder isso é o que produz decisão injusta.

Liste o que **não** tem evidência. A ausência não é argumento contra a pessoa, mas escondê-la é
argumento contra o caso.

**Conclua sobre a régua.** Diga quanto do nível o registro sustenta e o que falta — o caso não é
um dossiê sem leitura. O que você não faz é a recomendação de negócio: se promove agora, se espera
o próximo ciclo, se o orçamento comporta. Isso depende de coisa que não está no registro, e é onde
o comitê entra.

## Renderize

Com `Cobertura` e `Gap`, nessa ordem — a leitura de conjunto e depois a comparação contra a
régua, comportamento a comportamento. Se pedirem o panorama da pessoa antes disso, use `Dossie`.

A densidade de evidência que a skill manda declarar logo no começo cabe no primeiro bloco: um
`Indicadores` com `eventos`, `episódios` e `sem evidência` diz em três números o que o caso tem
de lastro, e diz antes de qualquer argumento.
