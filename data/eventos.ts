import type { Evento } from './tipos'

/**
 * SEED MÍNIMO — ~16 eventos. O dataset completo (~180, 6 meses, elenco de 8)
 * entra no passo 9. Cada evento é UMA frase sobre trabalho, com fonte
 * rastreável: PLANO.md §2.1 — nenhuma frase sem link pra fonte.
 */
export const eventos: Evento[] = [
  // ── Carla · migração do checkout ────────────────────────────────────────
  {
    id: 'ev-01',
    pessoaId: 'carla',
    data: '2026-03-04',
    texto:
      'Propôs cortar a migração do checkout em três fases para dispensar janela de downtime.',
    fonte: { tipo: 'slack', canal: '#pagamentos', mensagemId: 'p-4412' },
    episodioId: 'ep-carla-migracao',
  },
  {
    id: 'ev-02',
    pessoaId: 'carla',
    data: '2026-03-11',
    texto: 'Abriu a fase 1 da migração com plano de rollback documentado no próprio PR.',
    fonte: { tipo: 'github', repo: 'aurora/pagamentos', pr: 1841 },
    episodioId: 'ep-carla-migracao',
  },
  {
    id: 'ev-03',
    pessoaId: 'carla',
    data: '2026-03-18',
    texto: 'Escreveu o postmortem da migração antes da virada, listando o que poderia falhar.',
    fonte: { tipo: 'doc', titulo: 'Migração checkout — riscos e rollback' },
    episodioId: 'ep-carla-migracao',
  },
  {
    id: 'ev-04',
    pessoaId: 'carla',
    data: '2026-03-21',
    texto: 'Conduziu a virada às 5h de sábado; zero incidentes e nenhuma transação perdida.',
    fonte: { tipo: 'slack', canal: '#pagamentos', mensagemId: 'p-4790' },
    episodioId: 'ep-carla-migracao',
  },

  // ── Carla · dependência com o time de Dados (sem estrela) ───────────────
  {
    id: 'ev-05',
    pessoaId: 'carla',
    data: '2026-05-06',
    texto:
      'Mapeou com o time de Dados por que o pipeline de conciliação travava e transformou isso em pauta semanal.',
    fonte: { tipo: 'slack', canal: '#dados', mensagemId: 'd-2201' },
    episodioId: 'ep-carla-dados',
  },
  {
    id: 'ev-06',
    pessoaId: 'carla',
    data: '2026-05-20',
    texto: 'Negociou com Dados uma fila dedicada para os pedidos de Pagamentos.',
    fonte: { tipo: 'slack', canal: '#dados', mensagemId: 'd-2388' },
    episodioId: 'ep-carla-dados',
  },
  {
    id: 'ev-07',
    pessoaId: 'carla',
    data: '2026-06-02',
    texto: 'Escreveu o handoff Dados↔Pagamentos que os dois times passaram a usar.',
    fonte: { tipo: 'doc', titulo: 'Handoff Dados ↔ Pagamentos' },
    episodioId: 'ep-carla-dados',
  },

  // ── Carla · onboarding do Bruno (sem estrela) ───────────────────────────
  {
    id: 'ev-08',
    pessoaId: 'carla',
    data: '2026-02-10',
    texto: 'Assumiu o onboarding técnico do Bruno sem que ninguém tivesse pedido.',
    fonte: { tipo: 'slack', canal: '#pagamentos', mensagemId: 'p-3980' },
    episodioId: 'ep-carla-onboarding',
  },
  {
    id: 'ev-09',
    pessoaId: 'carla',
    data: '2026-02-27',
    texto: 'Revisou linha a linha os seis primeiros PRs do Bruno.',
    fonte: { tipo: 'github', repo: 'aurora/pagamentos', pr: 1702 },
    episodioId: 'ep-carla-onboarding',
  },

  // ── Carla · evento solto, sem episódio ──────────────────────────────────
  {
    id: 'ev-10',
    pessoaId: 'carla',
    data: '2026-07-08',
    texto: 'Refatorou o cliente de idempotência do gateway para cobrir retries parciais.',
    fonte: { tipo: 'github', repo: 'aurora/pagamentos', pr: 2033 },
  },

  // ── Rafael · conciliação travada em Dados (sem estrela) ─────────────────
  {
    id: 'ev-11',
    pessoaId: 'rafael',
    data: '2026-04-14',
    texto:
      'Sinalizou que a conciliação depende de uma tabela que o time de Dados ainda não expôs.',
    fonte: { tipo: 'slack', canal: '#pagamentos', mensagemId: 'p-5120' },
    episodioId: 'ep-rafael-conciliacao',
  },
  {
    id: 'ev-12',
    pessoaId: 'rafael',
    data: '2026-05-28',
    texto: 'Reprogramou a entrega pela segunda vez; o bloqueio seguia em Dados.',
    fonte: { tipo: 'slack', canal: '#pagamentos', mensagemId: 'p-5644' },
    episodioId: 'ep-rafael-conciliacao',
  },
  {
    id: 'ev-13',
    pessoaId: 'rafael',
    data: '2026-06-25',
    texto: 'Cortou escopo e entregou a conciliação sem o dado de origem, documentando a dívida.',
    fonte: { tipo: 'doc', titulo: 'Conciliação v1 — escopo cortado' },
    episodioId: 'ep-rafael-conciliacao',
  },
  {
    id: 'ev-14',
    pessoaId: 'rafael',
    data: '2026-06-09',
    texto: 'Corrigiu uma race condition no retry de webhooks que gerava cobrança duplicada.',
    fonte: { tipo: 'github', repo: 'aurora/pagamentos', pr: 1955 },
  },

  // ── Bruno · densidade baixa. Dois eventos em seis meses. ────────────────
  {
    id: 'ev-15',
    pessoaId: 'bruno',
    data: '2026-04-02',
    texto: 'Ajustou os logs do serviço de cobrança para incluir o id de correlação.',
    fonte: { tipo: 'github', repo: 'aurora/pagamentos', pr: 1889 },
  },
  {
    // O loop de elicitação no sistema de tipos: esta evidência não foi
    // observada, foi PERGUNTADA. Sem ela, junho do Bruno é um buraco.
    id: 'ev-16',
    pessoaId: 'bruno',
    data: '2026-06-30',
    texto:
      'Passou seis semanas no plantão do incidente de faturamento — trabalho todo em call, nada em PR.',
    fonte: { tipo: 'humano', respondidoPor: 'marina', lacunaId: 'lac-bruno-junho' },
  },
]

export const eventoPorId = (id: string) => eventos.find((e) => e.id === id)
