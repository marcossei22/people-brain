import { defineTool } from 'eve/tools'
import { z } from 'zod'
import { podeConsultar } from '../../lib/agente/permissoes'
import { episodiosComEstrela } from '../../lib/sessao'
import { nomeDe, registroDaSessao, viewerDaSessao } from '../lib/viewer-da-sessao'

export default defineTool({
  description:
    'Lê os episódios de uma pessoa — blocos de trabalho com começo, fim e os eventos que os compõem. É o nível certo para falar de contribuição. A estrela, quando existe, marca o episódio e nunca a pessoa.',
  inputSchema: z.object({
    pessoaId: z.string(),
    comEstrela: z.boolean().optional(),
  }),
  async execute({ pessoaId, comEstrela }, ctx) {
    const auth = podeConsultar(viewerDaSessao(ctx), pessoaId)
    if (!auth.ok) return { negado: true, motivo: auth.motivo }

    // Com a estrela desta sessão junto: um episódio reconhecido agora sai
    // reconhecido aqui, como sai no dossiê.
    const eps = episodiosComEstrela(registroDaSessao(ctx), pessoaId).filter(
      (e) => comEstrela === undefined || Boolean(e.estrela) === comEstrela,
    )

    return {
      pessoa: nomeDe(pessoaId),
      total: eps.length,
      episodios: eps.map((e) => ({
        id: e.id,
        titulo: e.titulo,
        resumo: e.resumo,
        inicio: e.inicio,
        fim: e.fim,
        eventoIds: e.eventoIds,
        colaboradores: e.colaboradores.map(nomeDe),
        nivelObservado: e.nivelObservado,
        estrela: e.estrela ? { por: nomeDe(e.estrela.por), em: e.estrela.em, nota: e.estrela.nota } : null,
      })),
    }
  },
})
