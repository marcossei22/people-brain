import { defineTool } from 'eve/tools'
import { z } from 'zod'
import { podeConsultar, pessoasVisiveis } from '../../lib/agente/permissoes'
import { feedbacksDe, mesesSemFeedback } from '../../lib/sessao'
import { nomeDe, registroDaSessao, viewerDaSessao } from '../lib/viewer-da-sessao'

export default defineTool({
  description:
    'Lê os feedbacks recebidos por uma pessoa. Reconhecimento guarda o texto; conversa guarda apenas que aconteceu, com data e episódio — nunca o teor. Use para responder quem está há mais tempo sem retorno.',
  inputSchema: z.object({ pessoaId: z.string().optional() }),
  async execute({ pessoaId }, ctx) {
    const viewer = viewerDaSessao(ctx)
    if (pessoaId) {
      const auth = podeConsultar(viewer, pessoaId)
      if (!auth.ok) return { negado: true, motivo: auth.motivo }
    }

    /* Pessoa a pessoa, e não varrendo `data/feedbacks.ts`: a conversa que a
     * gestora acabou de agendar em `/feedback` só existe na sessão, e lendo a
     * semente o Brain declarava quatro meses de silêncio para quem tinha acabado
     * de receber retorno. É o mesmo par de números que `mesesSemFeedback` já foi
     * unificado uma vez para resolver. */
    const registro = registroDaSessao(ctx)
    const alvos = pessoaId ? [pessoaId] : pessoasVisiveis(viewer).map((p) => p.id)
    const lista = alvos
      .flatMap((id) => feedbacksDe(registro, id))
      .sort((a, b) => b.data.localeCompare(a.data))

    return {
      total: lista.length,
      nota: 'Feedback do tipo "conversa" não guarda texto, por desenho: o registro guarda que a conversa aconteceu, nunca o que foi dito.',
      /* O intervalo já calculado, para o chat e a tela de pendências não
       * darem números diferentes para a mesma pessoa. */
      mesesSemFeedback: pessoaId ? mesesSemFeedback(registro, pessoaId) : undefined,
      /* Sem `pessoaId`, o intervalo de cada pessoa que o observador alcança —
       * é exatamente o que "quem está há mais tempo sem retorno" pergunta, e
       * derivá-lo das datas de cabeça é como as duas superfícies divergem. */
      intervalos: pessoaId
        ? undefined
        : alvos.map((id) => ({
            pessoa: nomeDe(id),
            pessoaId: id,
            mesesSemFeedback: mesesSemFeedback(registro, id),
          })),
      feedbacks: lista.map((f) => ({
        id: f.id,
        para: nomeDe(f.paraPessoaId),
        por: nomeDe(f.porPessoaId),
        data: f.data,
        tipo: f.tipo,
        episodioId: f.episodioId,
        texto: f.texto ?? null,
      })),
    }
  },
})
