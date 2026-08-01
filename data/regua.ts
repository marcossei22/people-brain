import type { NivelRegua } from './tipos'

/**
 * SEED MÍNIMO — Eng (pleno/senior/staff) + Sales (senior).
 * A régua das duas trilhas × três níveis entra no passo 10.
 *
 * `derivado` é a régua viva do PLANO.md §3.1: uma sugestão que nasceu da
 * evidência real e está esperando decisão humana. Régua congelada morre —
 * é o mecanismo de N5 (decisão #8).
 */
export const regua: NivelRegua[] = [
  {
    trilha: 'eng',
    nivel: 'pleno',
    comportamentos: [
      {
        id: 'eng-pleno-entrega',
        texto: 'Entrega tarefas bem definidas com autonomia.',
        observavel: 'Fecha o escopo combinado sem precisar de acompanhamento diário.',
      },
      {
        id: 'eng-pleno-qualidade',
        texto: 'Deixa o sistema mais fácil de operar do que encontrou.',
        observavel: 'Testes, logs e rollback aparecem no próprio PR, não depois.',
      },
      {
        id: 'eng-pleno-colaboracao',
        texto: 'Pede e dá revisão de forma específica.',
        observavel: 'Revisões apontam consequência, não estilo.',
      },
    ],
  },
  {
    trilha: 'eng',
    nivel: 'senior',
    comportamentos: [
      {
        id: 'eng-senior-ambiguidade',
        texto: 'Recebe problema, não tarefa.',
        observavel: 'Propõe o recorte da solução antes de existir spec.',
      },
      {
        id: 'eng-senior-influencia',
        texto: 'Move trabalho em times sobre os quais não tem autoridade.',
        observavel:
          'Consegue mudança de prioridade em outro time por argumento, sem escalar para gestão.',
      },
      {
        id: 'eng-senior-desbloqueio',
        texto: 'Trata dependência travada como problema próprio.',
        observavel: 'O bloqueio vira acordo documentado, não reclamação em retro.',
      },
      {
        id: 'eng-senior-risco',
        texto: 'Antecipa o modo de falha antes de mexer em produção.',
        observavel: 'O plano de rollback existe antes do deploy, não durante o incidente.',
      },
      {
        id: 'eng-senior-mentoria',
        texto: 'Aumenta a capacidade de quem está por perto.',
        observavel: 'Alguém no time passa a fazer sozinho o que só essa pessoa fazia.',
      },
    ],
    derivado: {
      sugestao:
        'Adicionar comportamento: "transforma dependência entre times em acordo com dono e prazo". Apareceu em dois casos independentes neste semestre e hoje não tem onde ser creditado na régua.',
      baseadoEm: ['carla', 'rafael'],
      status: 'proposto',
    },
  },
  {
    trilha: 'eng',
    nivel: 'staff',
    comportamentos: [
      {
        id: 'eng-staff-direcao',
        texto: 'Escolhe em que problema o time não vai trabalhar.',
        observavel: 'Decisões de escopo com trade-off registrado e revisitado.',
      },
      {
        id: 'eng-staff-alavanca',
        texto: 'Resolve a classe do problema, não a instância.',
        observavel: 'Uma mudança de plataforma apaga uma categoria inteira de chamado.',
      },
    ],
  },
  {
    trilha: 'sales',
    nivel: 'senior',
    comportamentos: [
      {
        id: 'sales-senior-pipeline',
        texto: 'Constrói pipeline previsível, não picos.',
        observavel: 'Cobertura de pipeline estável trimestre a trimestre.',
      },
      {
        id: 'sales-senior-negociacao',
        texto: 'Fecha preservando a relação e a margem.',
        observavel: 'Desconto concedido vem com contrapartida registrada.',
      },
    ],
  },
]

export const lerRegua = (trilha: string, nivel: string) =>
  regua.find((r) => r.trilha === trilha && r.nivel === nivel)

export const comportamentoIds = new Set(
  regua.flatMap((r) => r.comportamentos.map((c) => c.id)),
)
