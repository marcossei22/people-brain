import { defineTool } from 'eve/tools'
import { z } from 'zod'
import { regua } from '../../data/regua'

export default defineTool({
  description:
    'Lê a régua de carreira da empresa para uma trilha e nível: os comportamentos esperados e o que conta como observável em cada um. Sem isso não há contra o que comparar evidência.',
  inputSchema: z.object({
    trilha: z.enum(['eng', 'sales', 'design']),
    nivel: z.enum(['pleno', 'senior', 'staff']),
  }),
  async execute({ trilha, nivel }) {
    const r = regua.find((x) => x.trilha === trilha && x.nivel === nivel)
    if (!r) return { encontrada: false, motivo: `A Aurora não definiu régua para ${trilha}/${nivel}.` }

    return {
      encontrada: true,
      trilha: r.trilha,
      nivel: r.nivel,
      comportamentos: r.comportamentos,
      sugestaoPendente: r.derivado ?? null,
    }
  },
})
