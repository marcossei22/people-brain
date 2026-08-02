import type { Episodio } from './tipos'

/**
 * Episódios — blocos de trabalho com começo, fim e os eventos que os compõem.
 * É o nível certo para falar de contribuição: evento é ruído, tema é padrão,
 * episódio é o que aconteceu.
 *
 * A estrela gruda AQUI, nunca na pessoa (decisão #6), e não existe campo para
 * estrela negativa (decisão #7). Poucos episódios têm estrela — reconhecimento
 * que acontece sempre não é reconhecimento, é ritual.
 */
export const episodios: Episodio[] = [
  // ── Carla ───────────────────────────────────────────────────────────────
  {
    id: 'ep-carla-migracao',
    pessoaId: 'carla',
    titulo: 'Migração do checkout sem downtime',
    resumo:
      'Dividiu a migração em três fases para dispensar janela de indisponibilidade, escreveu o postmortem antes da virada e conduziu a troca em produção sem incidente.',
    inicio: '2026-03-04',
    fim: '2026-03-21',
    eventoIds: ['ev-c01', 'ev-c02', 'ev-c03', 'ev-c04'],
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
    eventoIds: ['ev-c05', 'ev-c06', 'ev-c07'],
    colaboradores: ['rafael', 'andre'],
    // Sem estrela: ninguém reconheceu no momento. É justamente o episódio que
    // mais sustenta o caso de sênior — e o argumento contra depender de memória.
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
    eventoIds: ['ev-c08', 'ev-c09'],
    colaboradores: ['bruno'],
  },
  {
    id: 'ep-carla-idempotencia',
    pessoaId: 'carla',
    titulo: 'Idempotência do gateway',
    resumo:
      'Refatorou o cliente de idempotência para cobrir retries parciais e documentou as três formas de cobrança duplicada que o comportamento antigo permitia.',
    inicio: '2026-07-08',
    fim: '2026-07-15',
    eventoIds: ['ev-c10', 'ev-c11'],
    colaboradores: [],
  },

  // ── Rafael ──────────────────────────────────────────────────────────────
  {
    id: 'ep-rafael-conciliacao',
    pessoaId: 'rafael',
    titulo: 'Conciliação: duas datas perdidas, mesmo bloqueio',
    resumo:
      'Duas reprogramações de entrega, ambas travadas na mesma dependência com o time de Dados. Entregou com escopo cortado e documentou a dívida.',
    inicio: '2026-04-14',
    fim: '2026-06-25',
    eventoIds: ['ev-r01', 'ev-r02', 'ev-r03', 'ev-r04'],
    colaboradores: ['carla', 'andre'],
  },
  {
    id: 'ep-rafael-webhook',
    pessoaId: 'rafael',
    titulo: 'Cobrança duplicada no retry de webhooks',
    resumo:
      'Reproduziu a condição de corrida em teste de carga antes de corrigir, o que transformou um bug intermitente em caso determinístico.',
    inicio: '2026-06-09',
    fim: '2026-06-16',
    eventoIds: ['ev-r05', 'ev-r06'],
    colaboradores: [],
  },
  {
    id: 'ep-rafael-gateway',
    pessoaId: 'rafael',
    titulo: 'Segundo gateway e regra de failover',
    resumo:
      'Tirou a Aurora de fornecedor único de pagamento e validou o failover com 1% do tráfego real antes de assumir.',
    inicio: '2026-02-19',
    fim: '2026-03-05',
    eventoIds: ['ev-r07', 'ev-r08'],
    colaboradores: [],
    estrela: {
      por: 'marina',
      em: '2026-03-08',
      nota: 'Testar failover com tráfego real antes de precisar dele é o tipo de coisa que só aparece quando dá errado — e não deu.',
    },
  },

  // ── Bruno ───────────────────────────────────────────────────────────────
  {
    id: 'ep-bruno-plantao',
    pessoaId: 'bruno',
    titulo: 'Incidente de faturamento duplicado',
    resumo:
      'Abriu o incidente depois de reproduzir o caso e ficou seis semanas no plantão. O trabalho aconteceu quase todo em call e não deixou rastro em PR — só existe no registro porque foi perguntado.',
    inicio: '2026-05-19',
    fim: '2026-06-30',
    eventoIds: ['ev-b03', 'ev-b02'],
    colaboradores: [],
  },

  // ── Thiago ──────────────────────────────────────────────────────────────
  {
    id: 'ep-thiago-observabilidade',
    pessoaId: 'thiago',
    titulo: 'Observabilidade ponta a ponta',
    resumo:
      'Instrumentou os serviços críticos, construiu o painel de latência e treinou os plantonistas de três times. Tempo de diagnóstico caiu de 40 para 8 minutos.',
    inicio: '2026-02-12',
    fim: '2026-03-24',
    eventoIds: ['ev-t01', 'ev-t02', 'ev-t03'],
    colaboradores: ['juliana'],
    nivelObservado: 'staff',
  },
  {
    id: 'ep-thiago-cache',
    pessoaId: 'thiago',
    titulo: 'Cache de leitura entregue com dívida',
    resumo:
      'A materialização que o cache precisava não foi priorizada por Dados. Entregou com invalidação manual e registrou a dívida em vez de esperar.',
    inicio: '2026-05-12',
    fim: '2026-06-18',
    eventoIds: ['ev-t04', 'ev-t05'],
    colaboradores: ['andre'],
  },

  // ── Juliana ─────────────────────────────────────────────────────────────
  {
    id: 'ep-juliana-ci',
    pessoaId: 'juliana',
    titulo: 'CI de 22 para 9 minutos',
    resumo:
      'Reescreveu o pipeline, colocou o cache de dependências que faltava havia dois anos e documentou como adicionar serviço novo sem pedir ajuda.',
    inicio: '2026-02-18',
    fim: '2026-03-30',
    eventoIds: ['ev-j01', 'ev-j02', 'ev-j03'],
    colaboradores: [],
    nivelObservado: 'senior',
  },
  {
    id: 'ep-juliana-logs',
    pessoaId: 'juliana',
    titulo: 'Migração de logs parada seis semanas',
    resumo:
      'Esperou o schema que Dados ia publicar. Quando saiu, já estava defasado e parte do trabalho teve que ser refeita.',
    inicio: '2026-05-26',
    fim: '2026-07-07',
    eventoIds: ['ev-j04', 'ev-j05'],
    colaboradores: ['andre'],
  },

  // ── André ───────────────────────────────────────────────────────────────
  {
    id: 'ep-andre-fila',
    pessoaId: 'andre',
    titulo: 'Fila de Dados, aberta e com prazo',
    resumo:
      'Construiu a fila dedicada que a Carla negociou, aceitou o handoff escrito e publicou a fila inteira em canal aberto, com prazo declarado por item.',
    inicio: '2026-05-20',
    fim: '2026-06-19',
    eventoIds: ['ev-a01', 'ev-a02', 'ev-a03'],
    colaboradores: ['carla'],
    nivelObservado: 'senior',
  },
  {
    id: 'ep-andre-catalogo',
    pessoaId: 'andre',
    titulo: 'Catálogo de dados e limpeza de tabelas órfãs',
    resumo:
      'Escreveu o catálogo que faltava, cobrou dono para as 14 tabelas sem responsável e aposentou seis tabelas mortas depois de confirmar que nada as consumia.',
    inicio: '2026-02-25',
    fim: '2026-04-02',
    eventoIds: ['ev-a04', 'ev-a05', 'ev-a06'],
    colaboradores: [],
  },

  // ── Letícia ─────────────────────────────────────────────────────────────
  {
    id: 'ep-leticia-nexa',
    pessoaId: 'leticia',
    titulo: 'Nexa Logística — maior contrato de mid-market do semestre',
    resumo:
      'Mapeou decisor, influenciador e quem veta antes de propor. Trouxe engenharia para a call técnica antes de prometer prazo, e concedeu desconto com contrapartida registrada.',
    inicio: '2026-02-09',
    fim: '2026-05-08',
    eventoIds: ['ev-l01', 'ev-l02', 'ev-l03', 'ev-l04'],
    colaboradores: ['rafael'],
    estrela: {
      por: 'helena',
      em: '2026-05-12',
      nota: 'Chamar engenharia antes de prometer prazo é o que evita o contrato que a gente não consegue entregar.',
    },
    nivelObservado: 'senior',
  },
  {
    id: 'ep-leticia-renovacao',
    pessoaId: 'leticia',
    titulo: 'Renovação antecipada e retorno para produto',
    resumo:
      'Antecipou a conversa de renovação em dois meses e transformou a objeção de billing, que apareceu em quatro contas seguidas, em documento para produto.',
    inicio: '2026-06-03',
    fim: '2026-06-17',
    eventoIds: ['ev-l05', 'ev-l06'],
    colaboradores: [],
  },
  {
    id: 'ep-leticia-meridiana',
    pessoaId: 'leticia',
    titulo: 'Meridiana fechada com escopo menor',
    resumo:
      'O relatório de uso que o cliente pediu dependia de Dados e não saiu a tempo. Fechou sem o módulo, preservando o contrato.',
    inicio: '2026-05-14',
    fim: '2026-07-02',
    eventoIds: ['ev-l07', 'ev-l08'],
    colaboradores: ['andre'],
  },

  // ── Sofia ───────────────────────────────────────────────────────────────
  {
    id: 'ep-sofia-midmarket',
    pessoaId: 'sofia',
    titulo: 'Previsibilidade em mid-market',
    resumo:
      'Bateu meta com volume em vez de pico, manteve a previsão dentro de 5% do fechamento por três meses e registrou descoberta nas palavras do cliente.',
    inicio: '2026-02-20',
    fim: '2026-05-29',
    eventoIds: ['ev-s01', 'ev-s02', 'ev-s03'],
    colaboradores: [],
  },
  {
    id: 'ep-sofia-playbook',
    pessoaId: 'sofia',
    titulo: 'Playbook de descoberta virou treinamento',
    resumo:
      'Escreveu o playbook a partir do que já fazia e rodou com as duas pessoas que entraram no time em julho.',
    inicio: '2026-06-10',
    fim: '2026-07-09',
    eventoIds: ['ev-s04', 'ev-s05'],
    colaboradores: [],
    nivelObservado: 'senior',
  },

  // ── Diego ───────────────────────────────────────────────────────────────
  {
    id: 'ep-diego-checkout',
    pessoaId: 'diego',
    titulo: 'Redesenho do checkout',
    resumo:
      'Nove entrevistas com clientes antes de desenhar qualquer tela. A taxa de abandono caiu de 31% para 19%. Metade deste episódio só existe no registro porque foi perguntado.',
    inicio: '2026-03-10',
    fim: '2026-05-04',
    eventoIds: ['ev-d01', 'ev-d02', 'ev-d03'],
    colaboradores: ['carla'],
    nivelObservado: 'staff',
  },
]

export const episodioPorId = (id: string) => episodios.find((e) => e.id === id)
