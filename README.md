# People Brain

> O Brain lembra. As pessoas decidem.

Protótipo de um sistema de gestão de performance que **não mata o ciclo — mata o formulário**.
A tese é que avaliação de pessoas é um problema de *memória*, não de processo: o que quebra não é
o ritual, é o gestor tentando reconstruir seis meses de trabalho na véspera do fechamento.

O sistema observa o trabalho onde ele acontece, pergunta quando não sabe, e chega no fechamento
com o dossiê montado e a evidência linkada até a fonte. **A IA nunca pontua ninguém.** Ela lembra,
organiza e declara o que não sabe — o julgamento continua sendo humano.

## Documentos

| Doc | O que é |
|---|---|
| [PLANO.md](PLANO.md) | A tese: premissas, reframe, as quatro fases, métricas |
| [ARQUITETURA.md](ARQUITETURA.md) | Spec de build: tipos, telas, tools, skills, ordem de construção |
| [ROADMAP.md](ROADMAP.md) | Estado, registro de decisões e o log do AI Appendix |
| [TESTES-CHAT.md](TESTES-CHAT.md) | Casos adversariais para o chat antes da gravação |

## Telas

| Rota | O que faz |
|---|---|
| `/org` | Pessoas a que o observador tem acesso — a permissão desenhada |
| `/org/[id]` | Dossiê. Um componente, dois observadores |
| `/feedback` | Pendências de atenção da semana, com orçamento de pergunta |
| `/diretrizes` | O conteúdo fixo da empresa: régua, cultura, contexto, política |
| `/integrations` | De onde vem a evidência — e o que fica de fora de cada fonte |

Não há login. O seletor no rodapé da barra lateral troca **quem está olhando** —
gestora, colaboradora ou CHRO — sem sair da página. É assim que "sem arquivo secreto"
deixa de ser promessa: a mesma tela, com campos governados por permissão em código.

## Rodar

```bash
pnpm install
pnpm dev
```

O `prebuild` roda `data/validar.ts`, que falha o build em qualquer contradição referencial
entre pessoas, eventos, episódios, temas, lacunas e régua.

## Stack

Next.js 16 (App Router) · Tailwind 4 · shadcn/ui · TypeScript. Sem banco, sem auth, sem
persistência entre reloads — é um protótipo, e os não-objetivos estão declarados na
[ARQUITETURA §14](ARQUITETURA.md).

---

Feito com [Claude Code](https://claude.com/claude-code). O registro de onde a IA errou e do que
foi sobrescrito está no [ROADMAP §6](ROADMAP.md).
