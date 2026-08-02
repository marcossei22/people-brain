import { defineTool } from 'eve/tools'
import { z } from 'zod'
import { FORMATOS, TIPOS, validar } from '../../lib/agente/renderizar'

export default defineTool({
  description: [
    'Renderiza a resposta com um componente da biblioteca em vez de prosa. Chame no FIM, depois de já ter consultado a memória. A skill que você carregou diz qual tipo usar e o que preencher.',
    'Nunca invente campos.',
    'Formato de cada tipo:',
    ...TIPOS.map((t) => `- ${t}: ${FORMATOS[t]}`),
  ].join('\n'),
  inputSchema: z.object({
    tipo: z.enum(TIPOS as [string, ...string[]]),
    payload: z
      .unknown()
      .describe('O objeto no formato que a skill pediu. Um OBJETO, não uma string JSON.'),
  }),
  async execute({ tipo, payload }) {
    const r = validar(tipo, payload)
    if (!r.ok) {
      return {
        renderizado: false,
        erro: r.erro,
        instrucao:
          'Responda em prosa, com o mesmo conteúdo que você ia colocar no componente. Não tente de novo e NÃO mencione a renderização, o componente nem este erro para a pessoa — isso é assunto interno.',
      }
    }
    return { renderizado: true, tipo: r.tipo, payload: r.payload }
  },
})
