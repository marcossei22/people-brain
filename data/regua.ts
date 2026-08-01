import type { NivelRegua } from './tipos'

/**
 * A régua de carreira da Aurora — duas trilhas × três níveis.
 *
 * É o único documento de Setup que produz veredito: os outros governam tom,
 * contexto e processo. Por isso é o único estruturado — `Tema.comportamentosRegua`
 * referencia estes ids, e é essa referência que liga padrão observado a decisão.
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
      {
        id: 'eng-pleno-comunicacao',
        texto: 'Avisa cedo quando vai atrasar.',
        observavel: 'O aviso chega antes da data, com o motivo e o novo prazo.',
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
      {
        id: 'eng-staff-padrao',
        texto: 'O que essa pessoa faz vira o jeito como o resto faz.',
        observavel: 'Uma prática dela aparece em times que ela não frequenta.',
      },
      {
        id: 'eng-staff-julgamento',
        texto: 'É chamada quando a decisão é cara e reversível com dificuldade.',
        observavel: 'Aparece como consultada em decisões de arquitetura fora do próprio domínio.',
      },
    ],
  },
  {
    trilha: 'sales',
    nivel: 'pleno',
    comportamentos: [
      {
        id: 'sales-pleno-execucao',
        texto: 'Executa o processo comercial sem precisar ser lembrada.',
        observavel: 'Follow-up, registro e próximos passos acontecem sem cobrança.',
      },
      {
        id: 'sales-pleno-descoberta',
        texto: 'Entende o problema do cliente antes de falar de produto.',
        observavel: 'As notas de descoberta descrevem a dor do cliente nas palavras dele.',
      },
      {
        id: 'sales-pleno-registro',
        texto: 'Mantém o CRM confiável.',
        observavel: 'Previsão do início do mês bate com o fechamento.',
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
      {
        id: 'sales-senior-complexidade',
        texto: 'Conduz negócio com mais de um decisor.',
        observavel: 'Mapeia quem decide, quem influencia e quem veta — e registra.',
      },
      {
        id: 'sales-senior-retorno',
        texto: 'Traz de volta o que o mercado disse.',
        observavel: 'Objeção recorrente vira insumo para produto, não desabafo em reunião.',
      },
    ],
  },
  {
    trilha: 'sales',
    nivel: 'staff',
    comportamentos: [
      {
        id: 'sales-staff-territorio',
        texto: 'Abre segmento onde a empresa ainda não vende.',
        observavel: 'Primeiro contrato de um segmento novo, com playbook escrito depois.',
      },
      {
        id: 'sales-staff-multiplicador',
        texto: 'Torna o time inteiro melhor no que ela faz bem.',
        observavel: 'Uma técnica dela vira parte do treinamento de quem entra.',
      },
      {
        id: 'sales-staff-parceria',
        texto: 'Trabalha a conta junto com produto e engenharia.',
        observavel: 'Negócio complexo com escopo técnico acordado antes da assinatura.',
      },
    ],
  },
]

export const lerRegua = (trilha: string, nivel: string) =>
  regua.find((r) => r.trilha === trilha && r.nivel === nivel)

export const comportamentoIds = new Set(
  regua.flatMap((r) => r.comportamentos.map((c) => c.id)),
)

export const NOME_TRILHA: Record<string, string> = {
  eng: 'Engenharia',
  sales: 'Vendas',
}

export const NOME_NIVEL: Record<string, string> = {
  pleno: 'Pleno',
  senior: 'Sênior',
  staff: 'Staff',
}
