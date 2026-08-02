/**
 * Modelo de dados do People Brain — ARQUITETURA.md §5.1
 *
 * Espelha a cadeia do PLANO.md §3.2: evento → episódio → tema → lacuna.
 * Nada aqui é opinião sobre a pessoa. Os tipos guardam TRABALHO, e é por isso
 * que a recusa do §6.7 não precisa ser uma política: não existe campo de
 * sentimento, então não há com o que responder.
 */

export type PessoaId = string
export type EventoId = string
export type EpisodioId = string
export type LacunaId = string
export type TemaId = string

export type Trilha = 'eng' | 'sales' | 'design'
export type Nivel = 'pleno' | 'senior' | 'staff'

/** Janela do semestre em avaliação. `validar.ts` recusa evento fora dela. */
export const JANELA = { inicio: '2026-02-01', fim: '2026-07-31' } as const

/** De onde veio a evidência. A variante 'humano' é o loop de elicitação
 *  aparecendo no sistema de tipos: evidência obtida perguntando é
 *  first-class e distinguível de evidência observada. */
export type Fonte =
  | { tipo: 'slack'; canal: string; mensagemId: string }
  | { tipo: 'github'; repo: string; pr: number }
  | { tipo: 'doc'; titulo: string }
  | { tipo: 'crm'; negocio: string }
  | { tipo: 'humano'; respondidoPor: PessoaId; lacunaId: LacunaId }

export interface Pessoa {
  id: PessoaId
  nome: string
  cargo: string
  /** Opcionais porque nem todo mundo é avaliado contra uma régua: quem só
   *  observa (CHRO, admin) não tem trilha nem nível. Sem isso, a alternativa
   *  seria inventar uma trilha falsa — e dado falso no elenco é o erro que
   *  estraga a gravação (§5.2). */
  trilha?: Trilha
  nivel?: Nivel
  gestorId?: PessoaId
  time: string
  desde: string
  /** Exibida no dossiê por honestidade — trade-off #1 do PLANO.md
   *  virando informação visível em vez de viés escondido. */
  densidadeEvidencia: 'alta' | 'media' | 'baixa'
}

export interface Evento {
  id: EventoId
  pessoaId: PessoaId
  data: string // ISO
  texto: string // uma frase: o que aconteceu
  fonte: Fonte
  episodioId?: EpisodioId
}

export interface Episodio {
  id: EpisodioId
  pessoaId: PessoaId
  titulo: string
  resumo: string
  inicio: string
  fim: string
  eventoIds: EventoId[]
  colaboradores: PessoaId[]
  /** A estrela gruda AQUI, no episódio — nunca na pessoa.
   *  Não existe campo para estrela negativa. Por desenho. (PLANO.md §3.3) */
  estrela?: { por: PessoaId; em: string; nota?: string }
  nivelObservado?: Nivel // "isso foi acima do nível dela"
}

export interface Tema {
  id: TemaId
  pessoaId: PessoaId
  padrao: string // "assume coordenação cross-team que ninguém pediu"
  episodioIds: EpisodioId[]
  comportamentosRegua: string[] // ids da régua — é o que liga tema a decisão
  confianca: 'alta' | 'media' | 'baixa' // função da densidade de evidência
}

export interface Lacuna {
  id: LacunaId
  pessoaId: PessoaId
  pergunta: string
  perguntarA: PessoaId
  motivo: string // o "declara o porquê" do orçamento de pergunta
  valor: 'alta' | 'media' | 'baixa' // valor da informação — governa a fila
  status: 'aberta' | 'perguntada' | 'respondida' | 'descartada'
  resposta?: { texto: string; por: PessoaId; em: string }
}

/**
 * Feedback dado — o quarto tipo de registro.
 *
 * Não existia até o agente ser perguntado "quem está sem feedback há mais
 * tempo?" e responder, com razão, que o dado não existe. "Feedback devido" era
 * um tipo de pendência no produto sem lastro no modelo.
 *
 * Guarda que houve conversa e sobre qual episódio — nunca o teor da correção.
 * Registro de demérito é passivo trabalhista (decisão #7): o que fica é que a
 * conversa aconteceu, não o que foi dito nela.
 */
export interface Feedback {
  id: string
  paraPessoaId: PessoaId
  porPessoaId: PessoaId
  data: string
  tipo: 'reconhecimento' | 'conversa'
  episodioId?: EpisodioId
  /** Só para reconhecimento. Conversa não guarda texto, por desenho. */
  texto?: string
}

export interface ComportamentoRegua {
  id: string
  texto: string
  observavel: string
}

export interface NivelRegua {
  trilha: Trilha
  nivel: Nivel
  comportamentos: ComportamentoRegua[]
  /** A régua viva: sugestão derivada da evidência real (PLANO.md §3.1) */
  derivado?: {
    sugestao: string
    baseadoEm: PessoaId[]
    status: 'proposto' | 'aceito'
  }
}

export interface AchadoOrg {
  id: string
  tipo: 'gargalo' | 'bloqueio-promocao' | 'cobertura-gestor' | 'gap-skill'
  titulo: string
  evidencia: { pessoaIds: PessoaId[]; episodioIds: EpisodioId[] }
  recomendacao: string
}
