---
description: Use quando perguntarem o que falta saber sobre alguém, o que perguntar, ou o que o Brain não sabe.
---

# Identificar lacunas

## Procedimento

1. **Primeira rodada, tudo junto:** `listar_lacunas` da pessoa, `ler_temas` e `buscar_pessoas`.
   Esta última dá a densidade de evidência: densidade baixa significa mais lacunas reais e menos
   conclusões possíveis.
2. **Segunda rodada:** `ler_regua` do nível alvo **com o `pessoaId`**. Comportamento que voltar sem
   `nivel` é lacuna, mesmo que ninguém a tenha registrado ainda — **use essa marca, não cruze a
   régua com os temas na mão.** O `sem-evidencia` da tool é o mesmo que a coluna do fechamento
   mostra; cruzar de cabeça produz uma lista de lacunas que discorda da tela sobre a mesma pessoa,
   e o preço é uma pergunta da semana que já tinha resposta no registro, ou uma que precisava ser
   feita e sumiu.

Comportamento com `nivel` baixo e um episódio só também é candidato a lacuna, e às vezes é o
melhor de todos: o registro alcançou o suficiente para saber que existe, e não o suficiente para
dizer quanto.

## Como priorizar

Ordene por **valor da informação para a decisão mais próxima**, não por facilidade.

Toda lacuna declara três coisas: a pergunta, a quem perguntar, e **por que vale gastar uma das
perguntas da semana**. O orçamento é de duas perguntas por semana para gestor e uma para IC.
Pergunta sem motivo declarado não entra na fila.

Se a pergunta for sobre estado, humor, satisfação ou intenção de sair, **ela não é lacuna** —
é fora de escopo. Descarte e explique.

## Renderize

Com `Lacunas`, preenchendo `itens[]` — cada um com `pergunta`, `motivo`, `perguntarA` e `valor`.

```
root = Resposta([buracos])
buracos = Lacunas(itens, "Carla Nunes")
```
