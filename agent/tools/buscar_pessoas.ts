import { defineTool } from 'eve/tools'
import { z } from 'zod'
import { pessoas } from '../../data/pessoas'
import { pessoasVisiveis } from '../../lib/agente/permissoes'
import { resumoDe } from '../../lib/memoria'
import { viewerDaSessao } from '../lib/viewer-da-sessao'

export default defineTool({
  description:
    'Lista as pessoas que o observador atual pode consultar. Use no começo para saber quem existe e quem está no time de quem. Filtros opcionais por time, trilha, nível e gestor.',
  inputSchema: z.object({
    time: z.string().optional(),
    trilha: z.enum(['eng', 'sales']).optional(),
    nivel: z.enum(['pleno', 'senior', 'staff']).optional(),
    gestorId: z.string().optional(),
  }),
  async execute(filtros, ctx) {
    const viewer = viewerDaSessao(ctx)
    const visiveis = pessoasVisiveis(viewer)

    const filtradas = visiveis.filter(
      (p) =>
        (!filtros.time || p.time === filtros.time) &&
        (!filtros.trilha || p.trilha === filtros.trilha) &&
        (!filtros.nivel || p.nivel === filtros.nivel) &&
        (!filtros.gestorId || p.gestorId === filtros.gestorId),
    )

    return {
      observador: viewer.pessoaId,
      papel: viewer.papel,
      totalNaEmpresa: pessoas.length,
      visiveisParaVoce: visiveis.length,
      pessoas: filtradas.map((p) => ({
        id: p.id,
        nome: p.nome,
        cargo: p.cargo,
        trilha: p.trilha,
        nivel: p.nivel,
        time: p.time,
        gestorId: p.gestorId,
        densidadeEvidencia: p.densidadeEvidencia,
        ...resumoDe(p.id),
      })),
    }
  },
})
