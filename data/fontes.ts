import type { Fonte } from './tipos'

/**
 * Catálogo de integrações — ARQUITETURA.md §8.5.
 *
 * `tipoFonte` amarra a integração ao discriminante de `Fonte` no modelo de
 * dados: uma integração conectada é exatamente uma variante de evidência que
 * pode existir. Slack conectado ⇒ existem eventos com `fonte.tipo === 'slack'`.
 */

export type EstadoIntegracao = 'conectada' | 'disponivel'

export interface Integracao {
  id: string
  nome: string
  categoria: string
  estado: EstadoIntegracao
  tipoFonte?: Fonte['tipo']
  conectadaEm?: string
  conectadaPor?: string
  /** O que esta fonte entrega para o registro. */
  captura: string[]
  /** O que ela poderia entregar e é deixado de fora, de propósito. */
  ignora: string[]
  escopos?: string[]
  volume?: { rotulo: string; valor: string }[]
}

export const integracoes: Integracao[] = [
  {
    id: 'slack',
    nome: 'Slack',
    categoria: 'Comunicação',
    estado: 'conectada',
    tipoFonte: 'slack',
    conectadaEm: '2026-01-28',
    conectadaPor: 'helena',
    captura: [
      'Mensagens em canais públicos de trabalho',
      'Threads em que a pessoa participou',
      'Reações em mensagens de canais públicos',
    ],
    ignora: [
      'Mensagens diretas',
      'Canais privados',
      'Horário em que a pessoa esteve online',
      'Tempo de resposta',
      'Volume de mensagens por pessoa',
    ],
    escopos: ['channels:history', 'channels:read', 'users:read'],
    volume: [
      { rotulo: 'Canais monitorados', valor: '14' },
      { rotulo: 'Última sincronização', valor: 'há 2 horas' },
    ],
  },
  {
    id: 'github',
    nome: 'GitHub',
    categoria: 'Engenharia',
    estado: 'conectada',
    tipoFonte: 'github',
    conectadaEm: '2026-01-28',
    conectadaPor: 'helena',
    captura: [
      'Pull requests abertos e revisados',
      'Descrição e discussão técnica do PR',
      'Repositórios dos times conectados',
    ],
    ignora: [
      'Linhas de código escritas',
      'Horário dos commits',
      'Contagem de commits por pessoa',
      'Repositórios pessoais',
    ],
    escopos: ['repo:read', 'pull_requests:read'],
    volume: [
      { rotulo: 'Repositórios', valor: '9' },
      { rotulo: 'Última sincronização', valor: 'há 40 minutos' },
    ],
  },
  {
    id: 'google-docs',
    nome: 'Google Workspace',
    categoria: 'Documentos',
    estado: 'conectada',
    tipoFonte: 'doc',
    conectadaEm: '2026-02-03',
    conectadaPor: 'helena',
    captura: [
      'Documentos em drives compartilhados do time',
      'Autoria e contribuição em documentos de trabalho',
    ],
    ignora: ['Drive pessoal', 'E-mail', 'Agenda e participação em reuniões'],
    escopos: ['drive.readonly (shared drives)'],
    volume: [
      { rotulo: 'Drives compartilhados', valor: '6' },
      { rotulo: 'Última sincronização', valor: 'há 5 horas' },
    ],
  },
  {
    id: 'hris',
    nome: 'Personio',
    categoria: 'HRIS',
    estado: 'conectada',
    tipoFonte: undefined,
    conectadaEm: '2026-01-26',
    conectadaPor: 'helena',
    captura: ['Cadastro, cargo e nível', 'Organograma e linha de reporte', 'Data de admissão'],
    ignora: ['Salário', 'Histórico de avaliações anteriores', 'Registro de ponto', 'Férias e faltas'],
    volume: [
      // O número tem que bater com o elenco: a tela ao lado lista 12 pessoas,
      // e "712 colaboradores" era a única frase do protótipo que contava outra
      // história sobre o tamanho da Aurora.
      { rotulo: 'Colaboradores sincronizados', valor: '12' },
      { rotulo: 'Última sincronização', valor: 'ontem' },
    ],
  },
  {
    id: 'crm',
    nome: 'Salesforce',
    categoria: 'Vendas',
    estado: 'conectada',
    tipoFonte: 'crm',
    conectadaEm: '2026-02-11',
    conectadaPor: 'helena',
    captura: [
      'Negócios trabalhados e estágio',
      'Notas de negociação registradas pela pessoa',
      'Contratos fechados no período',
    ],
    ignora: ['Comissão', 'Ligações gravadas', 'Tempo em ligação'],
    escopos: ['opportunity:read', 'account:read'],
    volume: [
      { rotulo: 'Pipelines', valor: '4' },
      { rotulo: 'Última sincronização', valor: 'há 1 hora' },
    ],
  },
  {
    id: 'linear',
    nome: 'Linear',
    categoria: 'Engenharia',
    estado: 'disponivel',
    captura: ['Issues entregues e escopo trabalhado', 'Projetos e ciclos'],
    ignora: ['Story points por pessoa', 'Velocity individual'],
  },
  {
    id: 'figma',
    nome: 'Figma',
    categoria: 'Design',
    estado: 'disponivel',
    captura: ['Arquivos e projetos em que a pessoa trabalhou', 'Comentários em revisão de design'],
    ignora: ['Tempo em arquivo', 'Número de edições'],
  },
  {
    id: 'zendesk',
    nome: 'Zendesk',
    categoria: 'Suporte',
    estado: 'disponivel',
    captura: ['Casos resolvidos e complexidade', 'Notas internas em casos difíceis'],
    ignora: ['Tempo médio de atendimento', 'CSAT individual'],
  },
]

export const conectadas = () => integracoes.filter((i) => i.estado === 'conectada')
export const disponiveis = () => integracoes.filter((i) => i.estado === 'disponivel')
