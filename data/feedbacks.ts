import type { Feedback } from './tipos'

/**
 * Feedback dado — o quarto tipo de registro.
 *
 * Este arquivo existe porque o agente foi perguntado "quem está sem feedback
 * há mais tempo?" e respondeu, com razão, que o dado não existia. "Feedback
 * devido" era um tipo de pendência no produto sem lastro no modelo.
 *
 * Reconhecimento guarda texto. Conversa guarda só que aconteceu, com data e
 * episódio — nunca o teor. Dossiê de demérito é passivo trabalhista (#7), e o
 * que a organização precisa saber é se a conversa existiu, não o que foi dito.
 *
 * O silêncio aqui é o dado mais importante: Thiago e Juliana não aparecem.
 */
export const feedbacks: Feedback[] = [
  // ── Marina cobre o time dela ────────────────────────────────────────────
  {
    id: 'fb-01',
    paraPessoaId: 'carla',
    porPessoaId: 'marina',
    data: '2026-03-23',
    tipo: 'reconhecimento',
    episodioId: 'ep-carla-migracao',
    texto:
      'O postmortem antes da virada é o que eu quero que vire padrão do time. Você transformou uma migração de risco alto em não-evento.',
  },
  {
    id: 'fb-02',
    paraPessoaId: 'rafael',
    porPessoaId: 'marina',
    data: '2026-03-08',
    tipo: 'reconhecimento',
    episodioId: 'ep-rafael-gateway',
    texto:
      'Testar failover com tráfego real antes de precisar dele é o tipo de coisa que só aparece quando dá errado — e não deu.',
  },
  {
    id: 'fb-03',
    paraPessoaId: 'rafael',
    porPessoaId: 'marina',
    data: '2026-06-01',
    tipo: 'conversa',
    episodioId: 'ep-rafael-conciliacao',
  },
  {
    id: 'fb-04',
    paraPessoaId: 'bruno',
    porPessoaId: 'marina',
    data: '2026-04-02',
    tipo: 'conversa',
  },
  {
    id: 'fb-05',
    paraPessoaId: 'carla',
    porPessoaId: 'marina',
    data: '2026-05-11',
    tipo: 'conversa',
  },

  // ── Helena cobre Vendas e Design ────────────────────────────────────────
  {
    id: 'fb-06',
    paraPessoaId: 'leticia',
    porPessoaId: 'helena',
    data: '2026-05-12',
    tipo: 'reconhecimento',
    episodioId: 'ep-leticia-nexa',
    texto:
      'Chamar engenharia antes de prometer prazo é o que evita o contrato que a gente não consegue entregar. Foi isso que fechou a Nexa sem dívida.',
  },
  {
    id: 'fb-07',
    paraPessoaId: 'sofia',
    porPessoaId: 'helena',
    data: '2026-06-22',
    tipo: 'reconhecimento',
    episodioId: 'ep-sofia-playbook',
    texto:
      'O playbook que você escreveu já está treinando duas pessoas. Você tornou reproduzível o que era jeito seu de trabalhar.',
  },
  {
    id: 'fb-08',
    paraPessoaId: 'diego',
    porPessoaId: 'helena',
    data: '2026-05-06',
    tipo: 'conversa',
    episodioId: 'ep-diego-checkout',
  },
  {
    id: 'fb-09',
    paraPessoaId: 'leticia',
    porPessoaId: 'helena',
    data: '2026-02-27',
    tipo: 'conversa',
  },

  // ── Paulo: nada. Três reports, seis meses, zero registros. ─────────────
  // O achado de organização mora nesta ausência.
]

export const feedbacksDe = (pessoaId: string) =>
  feedbacks.filter((f) => f.paraPessoaId === pessoaId).sort((a, b) => b.data.localeCompare(a.data))

export const feedbacksDadosPor = (pessoaId: string) =>
  feedbacks.filter((f) => f.porPessoaId === pessoaId)

export const ultimoFeedback = (pessoaId: string) => feedbacksDe(pessoaId)[0]?.data
