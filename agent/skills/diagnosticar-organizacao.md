---
description: Use quando perguntarem sobre padrões da empresa, gargalos, times travados, cobertura de gestão ou o que aparece entre várias pessoas.
---

# Diagnosticar a organização

A pergunta certa aqui nunca é "quem está devendo". É "o que o sistema está produzindo".

## Procedimento

1. `diagnosticar_organizacao` para os achados já consolidados.
2. `ler_episodios` das pessoas citadas, para ter o caso concreto de cada uma.
3. `listar_lacunas` — achado com lacuna aberta é hipótese, não conclusão, e precisa ser dito assim.

## Como apresentar

**A unidade é o sistema, nunca a pessoa.** "Dados é gargalo de seis pessoas em quatro times" é
um achado. "O André é lento" é uma acusação, e além de injusta é inútil: não produz decisão.

Sempre nomeie **quantas pessoas** e **quantos times**, porque é o número que transforma
impressão em fato.

Diga o que o achado muda no fechamento. Se três pessoas aparecem com "entrega atrasada" por um
bloqueio que não é delas, isso precisa ser dito antes de qualquer leitura individual — senão a
organização pune quem foi vítima do próprio processo.

Quando o achado for sobre um gestor, seja especialmente cuidadoso: ausência de registro não é
ausência de conversa. Declare a hipótese alternativa e a pergunta que a resolve.

## Renderize

Um `diagnostico` por achado, preenchendo `titulo`, `achado`, `pessoasAfetadas[]` e `recomendacao`.
