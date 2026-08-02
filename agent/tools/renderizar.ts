import { defineTool } from 'eve/tools'
import { z } from 'zod'
import { MANUAL, validarPrograma } from '../../lib/agente/renderizar'

export default defineTool({
  description: MANUAL,
  inputSchema: z.object({
    programa: z
      .string()
      .describe(
        'O programa OpenUI Lang. Uma declaração por linha, `root = Resposta([...])` na primeira.',
      ),
  }),
  async execute({ programa }) {
    const r = validarPrograma(programa)

    if (!r.ok) {
      return {
        renderizado: false,
        erro: r.erro,
        instrucao:
          'Responda em prosa, com o mesmo conteúdo que você ia colocar nos componentes. Não tente de novo e NÃO mencione a renderização, o componente nem este erro para a pessoa — isso é assunto interno.',
      }
    }

    // O programa já está na tela: o painel desenha a partir do ARGUMENTO da
    // tool, não do retorno, e começa a desenhar enquanto ele ainda está
    // chegando. Este retorno é só o aviso de que valeu.
    return { renderizado: true, aviso: r.erro }
  },
})
