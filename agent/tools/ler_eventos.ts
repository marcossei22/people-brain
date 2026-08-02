import { defineTool } from 'eve/tools'
import { z } from 'zod'
import { podeConsultar } from '../../lib/agente/permissoes'
import { eventosDe } from '../../lib/memoria'
import { nomeDe, viewerDaSessao } from '../lib/viewer-da-sessao'

export default defineTool({
  description:
    'Lê os eventos brutos de uma pessoa — cada um é uma frase sobre algo que aconteceu, com a fonte. Use quando precisar da evidência crua, não do resumo.',
  inputSchema: z.object({
    pessoaId: z.string(),
    desde: z.string().optional().describe('Data ISO. Só eventos a partir dela.'),
    busca: z.string().optional().describe('Filtra por texto no evento.'),
  }),
  async execute({ pessoaId, desde, busca }, ctx) {
    const auth = podeConsultar(viewerDaSessao(ctx), pessoaId)
    if (!auth.ok) return { negado: true, motivo: auth.motivo }

    const eventos = eventosDe(pessoaId)
      .filter((e) => !desde || e.data >= desde)
      .filter((e) => !busca || e.texto.toLowerCase().includes(busca.toLowerCase()))

    return {
      pessoa: nomeDe(pessoaId),
      total: eventos.length,
      eventos: eventos.map((e) => ({
        id: e.id,
        data: e.data,
        texto: e.texto,
        fonte: e.fonte,
        episodioId: e.episodioId,
      })),
    }
  },
})
