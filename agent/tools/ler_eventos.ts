import { defineTool } from 'eve/tools'
import { z } from 'zod'
import { podeConsultar } from '../../lib/agente/permissoes'
import { contestacaoDe, eventosDe } from '../../lib/sessao'
import { nomeDe, registroDaSessao, viewerDaSessao } from '../lib/viewer-da-sessao'

export default defineTool({
  description: [
    'Lê os eventos brutos de uma pessoa — cada um é uma frase sobre algo que aconteceu, com a fonte. Use quando precisar da evidência crua, não do resumo.',
    'Um evento com `contestacao` foi marcado como errado por quem aparece nele. Ele continua no registro, e citá-lo como lastro limpo afirma o que a própria pessoa negou: quando ele sustentar uma conclusão, diga que está contestado e por quê.',
  ].join('\n'),
  inputSchema: z.object({
    pessoaId: z.string(),
    desde: z.string().optional().describe('Data ISO. Só eventos a partir dela.'),
    busca: z.string().optional().describe('Filtra por texto no evento.'),
  }),
  async execute({ pessoaId, desde, busca }, ctx) {
    const auth = podeConsultar(viewerDaSessao(ctx), pessoaId)
    if (!auth.ok) return { negado: true, motivo: auth.motivo }

    // Semente + o que a sessão escreveu, na mesma ordem do dossiê.
    const registro = registroDaSessao(ctx)
    const eventos = eventosDe(registro, pessoaId)
      .filter((e) => !desde || e.data >= desde)
      .filter((e) => !busca || e.texto.toLowerCase().includes(busca.toLowerCase()))

    return {
      pessoa: nomeDe(pessoaId),
      total: eventos.length,
      eventos: eventos.map((e) => {
        const contestacao = contestacaoDe(registro, e.id)
        return {
          id: e.id,
          data: e.data,
          texto: e.texto,
          fonte: e.fonte,
          episodioId: e.episodioId,
          contestacao: contestacao
            ? { motivo: contestacao.motivo, por: nomeDe(contestacao.por), em: contestacao.em }
            : null,
        }
      }),
    }
  },
})
