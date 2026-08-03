import { defineTool } from 'eve/tools'
import { z } from 'zod'
import { regua } from '../../data/regua'
import { podeConsultar } from '../../lib/agente/permissoes'
import { comportamentosCobertos } from '../../lib/metricas'
import { sugestoesDe } from '../../lib/regua-viva'
import { estreladosDe, lastrosDe } from '../../lib/sessao'
import { nomeDe, registroDaSessao, viewerDaSessao } from '../lib/viewer-da-sessao'

export default defineTool({
  description: [
    'Lê a régua de carreira da empresa para uma trilha e nível: os comportamentos esperados e o que conta como observável em cada um. Sem isso não há contra o que comparar evidência.',
    'Com `pessoaId`, cada comportamento vem com `nivel` (onde a pessoa está, 1 a 5), `esperado` (o que o nível pede), `episodios` (quantos episódios distintos do registro sustentam) e `situacao` já calculada. USE essa `situacao` — não reconte de cabeça. A mesma contagem alimenta a régua no dossiê da pessoa, e recontar é como a mesma régua sai com dois resultados na mesma tela.',
    'Cada comportamento traz também `parcelas`: as quatro parcelas que produziram o número, cada uma com `valor`, `motivo` e os `episodioIds` em que ela abre. É com elas que se responde "por que 4 e não 5" — a parcela de valor 0 vem junto justamente porque é ela que responde. Cite o motivo e a evidência, nunca a fórmula: quem lê quer saber que faltou reconhecimento naquele trabalho, não como a soma é feita.',
    'Nível ausente quer dizer SEM EVIDÊNCIA, e isso está fora da escala — não é o degrau 1. Omita o número em vez de escrever 1.',
    'Qual nível pedir: para "o que falta para subir", peça o nível seguinte. Para "ela sustenta o que já é dela?" — a pergunta do fechamento de ciclo —, peça o nível que ela ocupa.',
  ].join('\n'),
  inputSchema: z.object({
    trilha: z.enum(['eng', 'sales', 'design']),
    nivel: z.enum(['pleno', 'senior', 'staff']),
    pessoaId: z
      .string()
      .optional()
      .describe('Quando informado, a régua vem pesada contra o registro dessa pessoa.'),
  }),
  async execute({ trilha, nivel, pessoaId }, ctx) {
    const r = regua.find((x) => x.trilha === trilha && x.nivel === nivel)
    if (!r) return { encontrada: false, motivo: `A Aurora não definiu régua para ${trilha}/${nivel}.` }

    /* A régua viva vem CALCULADA do registro, e não do dado: ela deixou de ser
     * um campo escrito em `data/regua.ts`. Lê a sessão pela mesma porta que a
     * régua pesada logo abaixo, senão o chat responderia "há uma sugestão para
     * Comunicação" sobre uma linha que a gestora acabou de lastrear na tela ao
     * lado. */
    const registro = registroDaSessao(ctx)

    const base = {
      encontrada: true as const,
      trilha: r.trilha,
      nivel: r.nivel,
      sugestoesPendentes: sugestoesDe(trilha, nivel, registro),
    }

    if (!pessoaId) return { ...base, comportamentos: r.comportamentos }

    // A régua é doutrina pública, mas o quanto o registro de alguém a sustenta
    // é o registro dessa pessoa. A permissão vale para a versão pesada.
    const auth = podeConsultar(viewerDaSessao(ctx), pessoaId)
    if (!auth.ok) return { negado: true, motivo: auth.motivo }

    /* Os episódios reconhecidos NESTA sessão entram na conta, como entram na
     * teia do dossiê: `pontuar()` soma a parcela "houve reconhecimento", e sem
     * o quarto argumento a mesma régua da mesma pessoa saía 4 aqui e 5 na tela
     * atrás do painel, com a estrela visível na hora.
     *
     * Os lastros são o mesmo problema pelo outro gesto: quando a gestora
     * discorda de uma nota no fechamento, o episódio que ela citou passa a
     * sustentar o comportamento. Sem eles, o chat responderia pela régua de
     * antes da conversa que acabou de acontecer na tela ao lado. */
    return {
      ...base,
      pessoa: nomeDe(pessoaId),
      comportamentos:
        comportamentosCobertos(
          pessoaId,
          trilha,
          nivel,
          estreladosDe(registro, pessoaId),
          lastrosDe(registro, pessoaId),
        ) ?? r.comportamentos,
    }
  },
})
