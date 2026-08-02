import { defineTool } from 'eve/tools'
import { z } from 'zod'
import { achadosOrg } from '../../data/achados-org'
import { podeVerDiagnosticoOrg } from '../../lib/agente/permissoes'
import { nomeDe, viewerDaSessao } from '../lib/viewer-da-sessao'

export default defineTool({
  description:
    'Lê os achados de organização: padrões que atravessam pessoas e times. É o que separa "o Rafael é lento" de "Dados é gargalo de seis pessoas". Só quem tem escopo agregado alcança.',
  inputSchema: z.object({
    tipo: z
      .enum(['gargalo', 'bloqueio-promocao', 'cobertura-gestor', 'gap-skill'])
      .optional(),
  }),
  async execute({ tipo }, ctx) {
    const viewer = viewerDaSessao(ctx)
    if (!podeVerDiagnosticoOrg(viewer))
      return {
        negado: true,
        motivo:
          'O diagnóstico de organização é agregado e fica com quem responde pela organização. Um gestor vê o próprio time.',
      }

    const lista = achadosOrg.filter((a) => !tipo || a.tipo === tipo)
    return {
      total: lista.length,
      achados: lista.map((a) => ({
        id: a.id,
        tipo: a.tipo,
        titulo: a.titulo,
        pessoasAfetadas: a.evidencia.pessoaIds.map(nomeDe),
        episodioIds: a.evidencia.episodioIds,
        recomendacao: a.recomendacao,
      })),
    }
  },
})
