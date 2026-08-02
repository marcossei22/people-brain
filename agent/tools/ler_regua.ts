import { defineTool } from 'eve/tools'
import { z } from 'zod'
import { regua } from '../../data/regua'
import { podeConsultar } from '../../lib/agente/permissoes'
import { comportamentosCobertos } from '../../lib/metricas'
import { nomeDe, viewerDaSessao } from '../lib/viewer-da-sessao'

export default defineTool({
  description: [
    'Lê a régua de carreira da empresa para uma trilha e nível: os comportamentos esperados e o que conta como observável em cada um. Sem isso não há contra o que comparar evidência.',
    'Com `pessoaId`, cada comportamento vem com `episodios` (quantos episódios distintos do registro o sustentam) e `situacao` já calculada. USE essa `situacao` — não reconte de cabeça. A mesma contagem alimenta a régua no dossiê da pessoa, e recontar é como a mesma régua sai com dois resultados na mesma tela.',
  ].join('\n'),
  inputSchema: z.object({
    trilha: z.enum(['eng', 'sales', 'design']),
    nivel: z.enum(['pleno', 'senior', 'staff']),
    pessoaId: z
      .string()
      .optional()
      .describe('Quando informado, a régua vem pesada contra o registro dessa pessoa.'),
  }),
  async execute({ trilha, nivel, pessoaId }, ctx) {
    const r = regua.find((x) => x.trilha === trilha && x.nivel === nivel)
    if (!r) return { encontrada: false, motivo: `A Aurora não definiu régua para ${trilha}/${nivel}.` }

    const base = {
      encontrada: true as const,
      trilha: r.trilha,
      nivel: r.nivel,
      sugestaoPendente: r.derivado ?? null,
    }

    if (!pessoaId) return { ...base, comportamentos: r.comportamentos }

    // A régua é doutrina pública, mas o quanto o registro de alguém a sustenta
    // é o registro dessa pessoa. A permissão vale para a versão pesada.
    const auth = podeConsultar(viewerDaSessao(ctx), pessoaId)
    if (!auth.ok) return { negado: true, motivo: auth.motivo }

    return {
      ...base,
      pessoa: nomeDe(pessoaId),
      comportamentos: comportamentosCobertos(pessoaId, trilha, nivel) ?? r.comportamentos,
    }
  },
})
