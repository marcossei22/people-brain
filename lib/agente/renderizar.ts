import { z } from 'zod'

/**
 * O contrato de render — ARQUITETURA.md §7.
 *
 * A biblioteca de componentes é FIXA. O modelo nunca escreve layout: ele
 * escolhe entre componentes prontos e preenche um schema validado. Quem decide
 * qual componente usar é o arquivo de skill da empresa (decisão #20), o que
 * faz a fase de Setup controlar até a forma da resposta.
 *
 * Zod falhou? Cai pra prosa. É o modo de falha gracioso do §7.1.
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

export const SCHEMAS = {
  briefing: z.object({
    pessoa: z.string(),
    contexto: z.string().describe('Uma frase sobre o momento da pessoa.'),
    pauta: z.array(z.object({ item: z.string(), porque: z.string() })),
    evidencias: z.array(evidencia),
    lacunas: z.array(z.object({ pergunta: z.string(), motivo: z.string() })),
  }),

  gap: z.object({
    pessoa: z.string(),
    nivelAtual: z.string(),
    nivelAlvo: z.string(),
    comportamentos: z.array(
      z.object({
        texto: z.string(),
        situacao: z.enum(['sustentado', 'parcial', 'sem-evidencia']),
        evidencias: z.array(fonte),
        observacao: z.string().optional(),
      }),
    ),
  }),

  dossie: z.object({
    pessoa: z.string(),
    cargo: z.string(),
    densidadeEvidencia: z.enum(['alta', 'media', 'baixa']),
    temas: z.array(z.object({ padrao: z.string(), confianca: z.string() })),
    episodios: z.array(
      z.object({ titulo: z.string(), resumo: z.string(), periodo: z.string(), comEstrela: z.boolean() }),
    ),
  }),

  timeline: z.object({
    pessoa: z.string(),
    episodios: z.array(
      z.object({ titulo: z.string(), inicio: z.string(), fim: z.string(), eventos: z.array(fonte) }),
    ),
  }),

  lacunas: z.object({
    pessoa: z.string().optional(),
    itens: z.array(
      z.object({
        pergunta: z.string(),
        motivo: z.string(),
        perguntarA: z.string(),
        valor: z.enum(['alta', 'media', 'baixa']),
      }),
    ),
  }),

  pessoas: z.object({
    titulo: z.string(),
    itens: z.array(
      z.object({ nome: z.string(), cargo: z.string(), nota: z.string().optional() }),
    ),
  }),

  diagnostico: z.object({
    titulo: z.string(),
    achado: z.string(),
    pessoasAfetadas: z.array(z.string()),
    recomendacao: z.string(),
  }),

  recusa: z.object({
    camada: z.enum(['acesso', 'escopo']).describe('acesso = permissão; escopo = não existe o dado'),
    pedido: z.string().describe('O que foi pedido, em uma frase.'),
    motivo: z.string(),
    ofereco: z.string().describe('O que dá para fazer no lugar.'),
  }),
} as const

export type TipoComponente = keyof typeof SCHEMAS
export const TIPOS = Object.keys(SCHEMAS) as TipoComponente[]

/**
 * O formato de cada componente, em uma linha, para entrar na descrição da
 * tool. Sem isso o modelo só sabe o NOME do tipo e adivinha os campos — foi
 * de onde vinha metade das falhas de validação.
 */
export const FORMATOS: Record<TipoComponente, string> = {
  briefing:
    '{ pessoa, contexto, pauta: [{ item, porque }], evidencias: [{ afirmacao, fontes: [{ eventoId }] }], lacunas: [{ pergunta, motivo }] }',
  gap: '{ pessoa, nivelAtual, nivelAlvo, comportamentos: [{ texto, situacao: "sustentado"|"parcial"|"sem-evidencia", evidencias: [{ eventoId }], observacao? }] }',
  dossie:
    '{ pessoa, cargo, densidadeEvidencia: "alta"|"media"|"baixa", temas: [{ padrao, confianca }], episodios: [{ titulo, resumo, periodo, comEstrela }] }',
  timeline: '{ pessoa, episodios: [{ titulo, inicio, fim, eventos: [{ eventoId }] }] }',
  lacunas:
    '{ pessoa?, itens: [{ pergunta, motivo, perguntarA, valor: "alta"|"media"|"baixa" }] }',
  pessoas: '{ titulo, itens: [{ nome, cargo, nota? }] }',
  diagnostico: '{ titulo, achado, pessoasAfetadas: [nome], recomendacao }',
  recusa:
    '{ camada: "acesso"|"escopo", pedido, motivo, ofereco }',
}

export type PayloadDe<T extends TipoComponente> = z.infer<(typeof SCHEMAS)[T]>

export interface Renderizacao {
  tipo: TipoComponente
  payload: unknown
}

/**
 * O modelo manda o payload ora como objeto, ora como string JSON — e o
 * provedor não normaliza. Antes desta função, TODA chamada de `renderizar`
 * morria com `expected object, received string` e a camada generativa inteira
 * caía para prosa sem ninguém perceber.
 */
function comoObjeto(payload: unknown): unknown {
  if (typeof payload !== 'string') return payload
  try {
    return JSON.parse(payload)
  } catch {
    return payload
  }
}

/** Valida o payload contra o schema do componente. Falha vira prosa. */
export function validar(tipo: string, payload: unknown):
  | { ok: true; tipo: TipoComponente; payload: unknown }
  | { ok: false; erro: string } {
  if (!(tipo in SCHEMAS)) {
    return { ok: false, erro: `Componente "${tipo}" não existe. Disponíveis: ${TIPOS.join(', ')}.` }
  }
  const schema = SCHEMAS[tipo as TipoComponente]
  const r = schema.safeParse(comoObjeto(payload))
  if (!r.success) {
    return { ok: false, erro: r.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(' · ') }
  }
  return { ok: true, tipo: tipo as TipoComponente, payload: r.data }
}
