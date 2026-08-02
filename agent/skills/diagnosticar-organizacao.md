---
description: Use quando perguntarem sobre padrões da empresa, gargalos, times travados, cobertura de gestão ou o que aparece entre várias pessoas.
---

# Diagnosticar a organização

A pergunta certa aqui nunca é "quem está devendo". É "o que o sistema está produzindo".

## Procedimento

1. **Primeira rodada:** `diagnosticar_organizacao` **sem filtro de tipo** e `listar_lacunas`,
   juntos. "Onde a organização está travando" não é só gargalo: cobertura de gestão, legibilidade
   de trilha e bloqueio de promoção são formas de travar, e responder com um achado quando
   existem quatro é responder pela metade. O achado já traz as pessoas afetadas e os episódios
   que o sustentam; a lacuna aberta é o que separa hipótese de conclusão, e precisa ser dita
   assim.
2. `ler_episodios` **só** de quem você for detalhar. Não puxe o registro de todo mundo que
   aparece num achado: o achado é sobre o sistema, e cinco leituras individuais para escrever
   um parágrafo sobre a fila de Dados é trabalho jogado fora.

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

**Um `diagnostico` por achado, todos** — uma chamada de `renderizar` para cada, na mesma rodada.
Preencha `titulo`, `achado`, `pessoasAfetadas[]` e `recomendacao`. Não escolha o mais grave e
deixe os outros de fora: o valor do diagnóstico é ver os quatro juntos.
