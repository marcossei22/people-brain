import type { EpisodioId, LacunaId, PessoaId } from './tipos'

/**
 * Pendências de atenção — FLUXO 1 (ARQUITETURA.md §8.3).
 *
 * No máximo três por semana, por pessoa. O limite não é estético: o recurso
 * escasso do sistema é o direito de perguntar (decisão #11), e uma caixa que
 * enche vira ruído e morre em 60 dias.
 *
 * Cada item declara o `motivo` — por que o Brain achou que valia a atenção
 * desta semana. Pendência sem motivo é notificação.
 */

export type TipoPendencia = 'pergunta' | 'reconhecimento' | 'feedback'

export interface Pendencia {
  id: string
  /** De quem é a caixa. Pendência é pessoal, não do time. */
  de: PessoaId
  tipo: TipoPendencia
  sobre: PessoaId
  titulo: string
  motivo: string
  episodioId?: EpisodioId
  lacunaId?: LacunaId
  /** Rascunho pré-escrito para o item de reconhecimento. */
  rascunho?: string
  acao: string
}

/** Orçamento de pergunta por papel — decisão #11. */
export const ORCAMENTO: Record<string, number> = {
  gestor: 2,
  colaborador: 1,
  chro: 0,
}

export const pendencias: Pendencia[] = [
  {
    id: 'pd-1',
    de: 'marina',
    tipo: 'pergunta',
    sobre: 'carla',
    titulo:
      'Como a Carla conseguiu a fila dedicada com o time de Dados? O registro tem o resultado, não a conversa.',
    motivo:
      'A régua de sênior pede "move trabalho em times sobre os quais não tem autoridade". O que está registrado prova o resultado; falta a evidência de que a articulação foi dela.',
    lacunaId: 'lac-carla-articulacao',
    acao: 'Responder em uma frase',
  },
  {
    id: 'pd-2',
    de: 'marina',
    tipo: 'reconhecimento',
    sobre: 'carla',
    titulo: 'A Carla fechou o handoff entre Dados e Pagamentos e ninguém comentou.',
    motivo:
      'Três eventos entre 6 de maio e 2 de junho, sem nenhum reconhecimento registrado. É o episódio que mais sustenta o caso de sênior dela.',
    episodioId: 'ep-carla-dados',
    rascunho:
      'Carla, o handoff que você escreveu entre Dados e Pagamentos virou o jeito como os dois times trabalham. Você levou um gargalo que travava três pessoas para uma pauta semanal e saiu de lá com fila dedicada — sem escalar para ninguém. Isso é trabalho de sênior e eu não tinha dito.',
    acao: 'Rascunhar',
  },
  {
    id: 'pd-3',
    de: 'marina',
    tipo: 'feedback',
    sobre: 'bruno',
    titulo: 'O Bruno está há 4 meses sem retorno seu.',
    motivo:
      'Último feedback registrado em 2 de abril. É o maior intervalo do seu time, e ele passou seis semanas em plantão que não gerou rastro nenhum.',
    acao: 'Agendar conversa',
  },
  {
    id: 'pd-4',
    de: 'carla',
    tipo: 'pergunta',
    sobre: 'carla',
    titulo: 'O que exatamente travava o pipeline de conciliação antes de você entrar?',
    motivo:
      'O registro mostra que destravou, mas não o que estava travado. Sem isso o episódio fica sem tamanho — e é ele que sustenta o seu caso de sênior.',
    acao: 'Responder em uma frase',
  },
]

export const pendenciasDe = (pessoaId: PessoaId) => pendencias.filter((p) => p.de === pessoaId)

export const NOME_TIPO: Record<TipoPendencia, string> = {
  pergunta: 'Pergunta',
  reconhecimento: 'Reconhecimento',
  feedback: 'Feedback devido',
}
