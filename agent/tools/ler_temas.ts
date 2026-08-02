import { defineTool } from 'eve/tools'
import { z } from 'zod'
import { podeConsultar } from '../../lib/agente/permissoes'
import { temasDe } from '../../lib/memoria'
import { regua } from '../../data/regua'
import { nomeDe, viewerDaSessao } from '../lib/viewer-da-sessao'

const textoDoComportamento = (id: string) =>
  regua.flatMap((r) => r.comportamentos).find((c) => c.id === id)?.texto ?? id

export default defineTool({
  description:
    'Lê os temas de uma pessoa — padrões que atravessam vários episódios, já ligados aos comportamentos da régua. É o que transforma "fez isso uma vez" em argumento.',
  inputSchema: z.object({ pessoaId: z.string() }),
  async execute({ pessoaId }, ctx) {
    const auth = podeConsultar(viewerDaSessao(ctx), pessoaId)
    if (!auth.ok) return { negado: true, motivo: auth.motivo }

    return {
      pessoa: nomeDe(pessoaId),
      temas: temasDe(pessoaId).map((t) => ({
        id: t.id,
        padrao: t.padrao,
        episodioIds: t.episodioIds,
        confianca: t.confianca,
        comportamentosRegua: t.comportamentosRegua.map((id) => ({ id, texto: textoDoComportamento(id) })),
      })),
    }
  },
})
