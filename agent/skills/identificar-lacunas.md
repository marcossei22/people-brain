---
description: Use quando perguntarem o que falta saber sobre alguém, o que perguntar, ou o que o Brain não sabe.
---

# Identificar lacunas

## Procedimento

1. **Primeira rodada, tudo junto:** `listar_lacunas` da pessoa, `ler_temas` e `buscar_pessoas`.
   Esta última dá a densidade de evidência: densidade baixa significa mais lacunas reais e menos
   conclusões possíveis.
2. **Segunda rodada:** `ler_regua` do nível alvo, e compare com os temas — comportamento sem
   evidência é lacuna, mesmo que ninguém a tenha registrado ainda.

## Como priorizar

Ordene por **valor da informação para a decisão mais próxima**, não por facilidade.

Toda lacuna declara três coisas: a pergunta, a quem perguntar, e **por que vale gastar uma das
perguntas da semana**. O orçamento é de duas perguntas por semana para gestor e uma para IC.
Pergunta sem motivo declarado não entra na fila.

Se a pergunta for sobre estado, humor, satisfação ou intenção de sair, **ela não é lacuna** —
é fora de escopo. Descarte e explique.

## Renderize

Com `lacunas`, preenchendo `itens[]` — cada um com `pergunta`, `motivo`, `perguntarA` e `valor`.
