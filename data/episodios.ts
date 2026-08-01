import type { Episodio } from './tipos'

/**
 * SEED MÍNIMO — 4 episódios. Só um tem estrela, de propósito: a estrela é
 * evento raro de reconhecimento, não checkbox. E ela gruda no EPISÓDIO,
 * nunca na pessoa (decisão #6). Não existe campo de estrela negativa (#7).
 */
export const episodios: Episodio[] = [
  {
    id: 'ep-carla-migracao',
    pessoaId: 'carla',
    titulo: 'Migração do checkout sem downtime',
    resumo:
      'Dividiu a migração em três fases para dispensar janela de indisponibilidade, escreveu o postmortem antes da virada e conduziu a troca em produção sem incidente.',
    inicio: '2026-03-04',
    fim: '2026-03-21',
    eventoIds: ['ev-01', 'ev-02', 'ev-03', 'ev-04'],
    colaboradores: ['rafael'],
    estrela: {
      por: 'marina',
      em: '2026-03-23',
      nota: 'O postmortem antes da virada é o que eu quero que vire padrão do time.',
    },
    nivelObservado: 'senior',
  },
  {
    id: 'ep-carla-dados',
    pessoaId: 'carla',
    titulo: 'Destravou a dependência de Pagamentos com Dados',
    resumo:
      'Levou o gargalo do pipeline de conciliação para uma pauta recorrente com o time de Dados, negociou fila dedicada e documentou o handoff que os dois times passaram a usar.',
    inicio: '2026-05-06',
    fim: '2026-06-02',
    eventoIds: ['ev-05', 'ev-06', 'ev-07'],
    colaboradores: ['rafael'],
    // Sem estrela: ninguém reconheceu no momento. É justamente o episódio que
    // mais sustenta o caso de senior — e o argumento contra depender de memória.
    nivelObservado: 'senior',
  },
  {
    id: 'ep-carla-onboarding',
    pessoaId: 'carla',
    titulo: 'Onboarding do Bruno',
    resumo:
      'Assumiu o onboarding técnico do Bruno sem atribuição formal e revisou linha a linha os primeiros PRs dele.',
    inicio: '2026-02-10',
    fim: '2026-02-27',
    eventoIds: ['ev-08', 'ev-09'],
    colaboradores: ['bruno'],
  },
  {
    id: 'ep-rafael-conciliacao',
    pessoaId: 'rafael',
    titulo: 'Conciliação: duas datas perdidas, mesmo bloqueio',
    resumo:
      'Duas reprogramações de entrega, ambas travadas na mesma dependência com o time de Dados. Entregou com escopo cortado e documentou a dívida.',
    inicio: '2026-04-14',
    fim: '2026-06-25',
    eventoIds: ['ev-11', 'ev-12', 'ev-13'],
    colaboradores: ['carla'],
  },
]

export const episodioPorId = (id: string) => episodios.find((e) => e.id === id)
