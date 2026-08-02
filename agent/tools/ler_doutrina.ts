import { defineTool } from 'eve/tools'
import { z } from 'zod'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { diretrizes } from '../../data/diretrizes'

export default defineTool({
  description:
    'Lê um documento de diretriz da empresa. "cultura" governa o tom de tudo que você escreve — carregue antes de rascunhar qualquer texto. "contexto-do-semestre" diz o que conta como impacto agora. "politica-de-decisao" diz quem decide o quê e o que um caso de promoção precisa conter.',
  inputSchema: z.object({
    nome: z.enum(['cultura', 'contexto-do-semestre', 'politica-de-decisao']),
  }),
  async execute({ nome }) {
    const d = diretrizes.find((x) => x.id === nome)
    if (!d?.arquivo) return { encontrado: false }

    const texto = await readFile(path.join(process.cwd(), 'doutrina', d.arquivo), 'utf8')
    return {
      encontrado: true,
      titulo: d.titulo,
      atualizadoEm: d.atualizadoEm,
      usadoPara: d.usadoPara,
      naoUsadoPara: d.naoUsadoPara,
      texto,
    }
  },
})
