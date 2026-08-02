import { defineTool } from 'eve/tools'
import { z } from 'zod'
import { TIPOS, validar } from '../../lib/agente/renderizar'

export default defineTool({
  description:
    `Renderiza a resposta com um componente da biblioteca em vez de prosa. Chame no FIM, depois de já ter consultado a memória. A skill que você carregou diz qual tipo usar e o que preencher. Tipos: ${TIPOS.join(', ')}. Nunca invente campos: se a validação falhar, responda em prosa.`,
  inputSchema: z.object({
    tipo: z.string().describe(`Um de: ${TIPOS.join(', ')}`),
    payload: z.unknown().describe('O objeto no formato que a skill pediu.'),
  }),
  async execute({ tipo, payload }) {
    const r = validar(tipo, payload)
    if (!r.ok) {
      return { renderizado: false, erro: r.erro, instrucao: 'Responda em prosa, sem tentar de novo.' }
    }
    return { renderizado: true, tipo: r.tipo, payload: r.payload }
  },
})
