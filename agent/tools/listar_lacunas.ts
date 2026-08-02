import { defineTool } from 'eve/tools'
import { z } from 'zod'
import { podeConsultar } from '../../lib/agente/permissoes'
import { lacunas } from '../../data/lacunas'
import { nomeDe, viewerDaSessao } from '../lib/viewer-da-sessao'

export default defineTool({
  description:
    'Lista o que o Brain sabe que não sabe sobre uma pessoa: perguntas abertas, a quem perguntar e por quê. Use antes de concluir qualquer coisa — lacuna aberta é motivo para perguntar, não para inferir.',
  inputSchema: z.object({
    pessoaId: z.string().optional(),
    status: z.enum(['aberta', 'perguntada', 'respondida', 'descartada']).optional(),
  }),
  async execute({ pessoaId, status }, ctx) {
    const viewer = viewerDaSessao(ctx)
    if (pessoaId) {
      const auth = podeConsultar(viewer, pessoaId)
      if (!auth.ok) return { negado: true, motivo: auth.motivo }
    }

    const lista = lacunas
      .filter((l) => !pessoaId || l.pessoaId === pessoaId)
      .filter((l) => !status || l.status === status)
      .filter((l) => podeConsultar(viewer, l.pessoaId).ok)

    return {
      total: lista.length,
      lacunas: lista.map((l) => ({
        id: l.id,
        pessoa: nomeDe(l.pessoaId),
        pergunta: l.pergunta,
        perguntarA: nomeDe(l.perguntarA),
        motivo: l.motivo,
        valor: l.valor,
        status: l.status,
        resposta: l.resposta ? { texto: l.resposta.texto, por: nomeDe(l.resposta.por), em: l.resposta.em } : null,
      })),
    }
  },
})
