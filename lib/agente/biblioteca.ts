import { z } from 'zod'

/**
 * O CONTRATO da biblioteca de componentes — ARQUITETURA.md §7.
 *
 * Um arquivo, sem React, para os dois lados poderem ler o mesmo contrato: o
 * servidor monta daqui o prompt e o validador (`lib/agente/renderizar.ts`), o
 * cliente monta daqui os renderers (`components/brain/biblioteca.tsx`). Nome,
 * descrição e props vivem em UM lugar — se divergissem, o modelo receberia um
 * formato e a tela esperaria outro.
 *
 * ORDEM DAS PROPS IMPORTA. O OpenUI Lang é POSICIONAL: o modelo escreve
 * `Pessoas("Time de Pagamentos", itens)`, não `Pessoas(titulo: ...)`. A ordem
 * das chaves aqui é a ordem dos argumentos lá, e **opcional só no fim** —
 * argumento opcional no meio não tem como ser omitido.
 *
 * A biblioteca continua FIXA (§7.1). O que o OpenUI acrescenta é COMPOSIÇÃO: o
 * modelo não escolhe mais um card e para, ele monta uma resposta com vários
 * blocos. Escrever layout ele continua não podendo — só existe o que está aqui.
 */

/**
 * A fonte é só o **id**. O texto e o canal saem do registro na hora de
 * desenhar (`components/brain/componentes.tsx`).
 *
 * Antes o modelo copiava a frase do evento para dentro do payload. Custava
 * uns 2.000 tokens de saída por card — ~25s de espera na câmera — e criava
 * uma segunda cópia da evidência, que podia divergir do original. Agora a
 * frase exibida é sempre a do `data/eventos.ts`, e o card fica curto.
 */
const fonte = z.object({
  eventoId: z.string().describe('Id do evento que sustenta esta afirmação. Só o id.'),
})

const evidencia = z.object({
  afirmacao: z.string(),
  fontes: z.array(fonte).describe('Nunca vazio. Afirmação sem fonte não entra.'),
})

/** Situação de um comportamento da régua contra a evidência do registro. */
const situacao = z
  .enum(['sustentado', 'parcial', 'sem-evidencia'])
  .describe('sustentado = dois ou mais episódios; parcial = um só; sem-evidencia = nenhum')

/**
 * Uma medida de gráfico.
 *
 * `nota` existe para o número não ficar sozinho: "4" não diz nada, "4 · dois
 * vieram de pergunta" diz. É opcional porque nem toda barra precisa.
 */
const medida = z.object({
  rotulo: z.string(),
  valor: z.number(),
  nota: z.string().optional(),
})

/**
 * Cada componente: o nome que o modelo escreve, o que ele faz (vai para o
 * prompt e é o que decide a escolha) e as props.
 */
export const ESPECIFICACOES = {
  // ── Composição ────────────────────────────────────────────────────────
  Resposta: {
    descricao:
      'A raiz de toda resposta. Empilha os blocos na ordem em que a pessoa deve lê-los.',
    props: z.object({
      blocos: z.array(z.any()).describe('Os componentes da resposta, em ordem de leitura.'),
    }),
  },

  Texto: {
    descricao:
      'Um parágrafo de prosa entre os blocos. Use para a ressalva ou o próximo passo que nenhum card diz — nunca para repetir o que o card ao lado já mostra.',
    props: z.object({
      texto: z.string(),
    }),
  },

  // ── Visuais ───────────────────────────────────────────────────────────
  Indicadores: {
    descricao:
      'Uma linha de números grandes com rótulo. Para o resumo de um registro: quantos eventos, quantos episódios, há quantos dias sem registro. No máximo quatro.',
    props: z.object({
      itens: z
        .array(
          z.object({
            valor: z.string().describe('O número, já formatado. Ex: "14", "3 meses".'),
            rotulo: z.string(),
            nota: z.string().optional(),
          }),
        )
        .describe('No máximo quatro.'),
      titulo: z.string().optional(),
    }),
  },

  Barras: {
    descricao:
      'Barras horizontais para comparar uma medida entre pessoas, times ou categorias. Use quando a pergunta for "quem tem mais/menos" de algo CONTÁVEL do registro — eventos, episódios, lacunas abertas, meses sem feedback. NUNCA para ordenar pessoas por desempenho nem para medida de atividade (volume de mensagem, horário, commits).',
    props: z.object({
      titulo: z.string(),
      series: z.array(medida).describe('Uma barra por item, na ordem em que devem aparecer.'),
      unidade: z.string().optional().describe('O que o número conta. Ex: "episódios".'),
      destaque: z
        .string()
        .optional()
        .describe('O `rotulo` de uma barra para marcar como a que a pergunta é sobre.'),
    }),
  },

  Serie: {
    descricao:
      'Colunas ao longo do tempo — evidência por mês, entregas por semana. O valor zero aparece como coluna vazia, de propósito: o buraco no registro é a informação.',
    props: z.object({
      titulo: z.string(),
      pontos: z.array(medida).describe('Em ordem cronológica. Inclua os meses de valor 0.'),
      nota: z.string().optional(),
    }),
  },

  Distribuicao: {
    descricao:
      'Uma barra única repartida, para mostrar a COMPOSIÇÃO de um todo: de onde veio a evidência (Slack, GitHub, documento, pergunta), como os episódios se dividem entre temas.',
    props: z.object({
      titulo: z.string(),
      partes: z.array(medida).describe('As fatias, da maior para a menor.'),
      nota: z.string().optional(),
    }),
  },

  Cobertura: {
    descricao:
      'A régua de um nível, comportamento a comportamento, com quanto de cada um o registro sustenta. É o resumo visual: use junto do `Gap` quando quiser que a leitura de conjunto venha antes do detalhe.',
    props: z.object({
      titulo: z.string().describe('Ex: "Régua de Sênior · Engenharia".'),
      itens: z.array(z.object({ texto: z.string(), situacao })),
      nota: z.string().optional(),
    }),
  },

  // ── Os cards do registro ──────────────────────────────────────────────
  Briefing: {
    descricao: 'Pauta de 1:1 com evidência recente e o que ainda não se sabe.',
    props: z.object({
      pessoa: z.string(),
      contexto: z.string().describe('Uma frase sobre o momento da pessoa.'),
      pauta: z.array(z.object({ item: z.string(), porque: z.string() })),
      evidencias: z.array(evidencia),
      lacunas: z.array(z.object({ pergunta: z.string(), motivo: z.string() })),
    }),
  },

  Gap: {
    descricao:
      'Régua do nível alvo contra a evidência, comportamento a comportamento, cada um com as fontes que o sustentam.',
    props: z.object({
      pessoa: z.string(),
      nivelAtual: z.string(),
      nivelAlvo: z.string(),
      comportamentos: z.array(
        z.object({
          texto: z.string(),
          situacao,
          evidencias: z.array(fonte),
          observacao: z.string().optional(),
        }),
      ),
    }),
  },

  Dossie: {
    descricao: 'Retrato de uma pessoa no semestre: densidade, padrões e episódios.',
    props: z.object({
      pessoa: z.string(),
      cargo: z.string(),
      densidadeEvidencia: z.enum(['alta', 'media', 'baixa']),
      temas: z.array(z.object({ padrao: z.string(), confianca: z.string() })),
      episodios: z.array(
        z.object({
          titulo: z.string(),
          resumo: z.string(),
          periodo: z.string(),
          comEstrela: z.boolean(),
        }),
      ),
    }),
  },

  Timeline: {
    descricao: 'Linha do tempo dos episódios; cada um abre nos eventos que o compõem.',
    props: z.object({
      pessoa: z.string(),
      episodios: z.array(
        z.object({
          titulo: z.string(),
          inicio: z.string(),
          fim: z.string(),
          eventos: z.array(fonte),
        }),
      ),
    }),
  },

  Lacunas: {
    descricao: 'O que o Brain sabe que não sabe, com o motivo e a quem perguntar.',
    props: z.object({
      itens: z.array(
        z.object({
          pergunta: z.string(),
          motivo: z.string(),
          perguntarA: z.string(),
          valor: z.enum(['alta', 'media', 'baixa']),
        }),
      ),
      pessoa: z.string().optional(),
    }),
  },

  Pessoas: {
    descricao: 'Lista simples de pessoas com cargo e uma nota curta.',
    props: z.object({
      titulo: z.string(),
      itens: z.array(z.object({ nome: z.string(), cargo: z.string(), nota: z.string().optional() })),
    }),
  },

  Diagnostico: {
    descricao: 'Achado sobre a organização — o padrão, quem ele afeta e o que fazer.',
    props: z.object({
      titulo: z.string(),
      achado: z.string(),
      pessoasAfetadas: z.array(z.string()),
      recomendacao: z.string(),
    }),
  },

  Recusa: {
    descricao:
      'A recusa, com o motivo e o que dá para fazer no lugar. Toda recusa passa por aqui — em prosa ela some no meio da conversa.',
    props: z.object({
      camada: z.enum(['acesso', 'escopo']).describe('acesso = permissão; escopo = não existe o dado'),
      pedido: z.string().describe('O que foi pedido, em uma frase.'),
      motivo: z.string(),
      ofereco: z.string().describe('O que dá para fazer no lugar.'),
    }),
  },
} as const

export type NomeComponente = keyof typeof ESPECIFICACOES
export const NOMES = Object.keys(ESPECIFICACOES) as NomeComponente[]

/** As props de um componente, já inferidas. `PropsDe<'Gap'>` na assinatura do renderer. */
export type PropsDe<N extends NomeComponente> = z.infer<(typeof ESPECIFICACOES)[N]['props']>

/** O componente raiz de todo programa. */
export const RAIZ = 'Resposta' satisfies NomeComponente
