import { defineTool } from 'eve/tools'
import { z } from 'zod'
import { podeConsultar } from '../../lib/agente/permissoes'
import { feedbacks } from '../../data/feedbacks'
import { nomeDe, viewerDaSessao } from '../lib/viewer-da-sessao'

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

    const lista = feedbacks
      .filter((f) => !pessoaId || f.paraPessoaId === pessoaId)
      .filter((f) => podeConsultar(viewer, f.paraPessoaId).ok)
      .sort((a, b) => b.data.localeCompare(a.data))

    return {
      total: lista.length,
      nota: 'Feedback do tipo "conversa" não guarda texto, por desenho: o registro guarda que a conversa aconteceu, nunca o que foi dito.',
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
