import type { NivelRegua } from './tipos'

/**
 * A régua de carreira da Aurora — Engenharia e Vendas em três níveis, Design
 * em dois. A assimetria é de propósito: ver §"Design" mais abaixo.
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
        rotulo: 'Entrega',
        esperado: 4,
        texto: 'Entrega tarefas bem definidas com autonomia.',
        observavel: 'Fecha o escopo combinado sem precisar de acompanhamento diário.',
      },
      {
        id: 'eng-pleno-qualidade',
        rotulo: 'Qualidade',
        esperado: 4,
        texto: 'Deixa o sistema mais fácil de operar do que encontrou.',
        observavel: 'Testes, logs e rollback aparecem no próprio PR, não depois.',
      },
      {
        id: 'eng-pleno-colaboracao',
        rotulo: 'Revisão',
        esperado: 3,
        texto: 'Pede e dá revisão de forma específica.',
        observavel: 'Revisões apontam consequência, não estilo.',
      },
      {
        id: 'eng-pleno-comunicacao',
        rotulo: 'Comunicação',
        esperado: 3,
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
        rotulo: 'Ambiguidade',
        esperado: 4,
        texto: 'Recebe problema, não tarefa.',
        observavel: 'Propõe o recorte da solução antes de existir spec.',
      },
      {
        id: 'eng-senior-influencia',
        rotulo: 'Influência',
        esperado: 4,
        texto: 'Move trabalho em times sobre os quais não tem autoridade.',
        observavel:
          'Consegue mudança de prioridade em outro time por argumento, sem escalar para gestão.',
      },
      {
        id: 'eng-senior-desbloqueio',
        rotulo: 'Desbloqueio',
        esperado: 3,
        texto: 'Trata dependência travada como problema próprio.',
        observavel: 'O bloqueio vira acordo documentado, não reclamação em retro.',
      },
      {
        id: 'eng-senior-risco',
        rotulo: 'Risco',
        esperado: 4,
        texto: 'Antecipa o modo de falha antes de mexer em produção.',
        observavel: 'O plano de rollback existe antes do deploy, não durante o incidente.',
      },
      {
        id: 'eng-senior-mentoria',
        rotulo: 'Mentoria',
        esperado: 3,
        texto: 'Aumenta a capacidade de quem está por perto.',
        observavel: 'Alguém no time passa a fazer sozinho o que só essa pessoa fazia.',
      },
    ],
    derivado: {
      sugestao:
        'Adicionar comportamento: "transforma dependência entre times em acordo com dono e prazo". Apareceu em dois casos independentes neste semestre e hoje não tem onde ser creditado na régua.',
      baseadoEm: ['carla', 'rafael'],
      status: 'proposto',
      virariaComportamento: {
        id: 'eng-senior-acordo',
        rotulo: 'Acordo',
        esperado: 3,
        texto: 'Transforma dependência entre times em acordo com dono e prazo.',
        observavel:
          'O bloqueio vira acordo com responsável e data, registrado onde os dois times veem.',
      },
    },
  },
  {
    trilha: 'eng',
    nivel: 'staff',
    comportamentos: [
      {
        id: 'eng-staff-direcao',
        rotulo: 'Direção',
        esperado: 4,
        texto: 'Escolhe em que problema o time não vai trabalhar.',
        observavel: 'Decisões de escopo com trade-off registrado e revisitado.',
      },
      {
        id: 'eng-staff-alavanca',
        rotulo: 'Alavanca',
        esperado: 5,
        texto: 'Resolve a classe do problema, não a instância.',
        observavel: 'Uma mudança de plataforma apaga uma categoria inteira de chamado.',
      },
      {
        id: 'eng-staff-padrao',
        rotulo: 'Padrão',
        esperado: 4,
        texto: 'O que essa pessoa faz vira o jeito como o resto faz.',
        observavel: 'Uma prática dela aparece em times que ela não frequenta.',
      },
      {
        id: 'eng-staff-julgamento',
        rotulo: 'Julgamento',
        esperado: 4,
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
        rotulo: 'Execução',
        esperado: 4,
        texto: 'Executa o processo comercial sem precisar ser lembrada.',
        observavel: 'Follow-up, registro e próximos passos acontecem sem cobrança.',
      },
      {
        id: 'sales-pleno-descoberta',
        rotulo: 'Descoberta',
        esperado: 4,
        texto: 'Entende o problema do cliente antes de falar de produto.',
        observavel: 'As notas de descoberta descrevem a dor do cliente nas palavras dele.',
      },
      {
        id: 'sales-pleno-registro',
        rotulo: 'Registro',
        esperado: 3,
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
        rotulo: 'Pipeline',
        esperado: 4,
        texto: 'Constrói pipeline previsível, não picos.',
        observavel: 'Cobertura de pipeline estável trimestre a trimestre.',
      },
      {
        id: 'sales-senior-negociacao',
        rotulo: 'Negociação',
        esperado: 4,
        texto: 'Fecha preservando a relação e a margem.',
        observavel: 'Desconto concedido vem com contrapartida registrada.',
      },
      {
        id: 'sales-senior-complexidade',
        rotulo: 'Complexidade',
        esperado: 3,
        texto: 'Conduz negócio com mais de um decisor.',
        observavel: 'Mapeia quem decide, quem influencia e quem veta — e registra.',
      },
      {
        id: 'sales-senior-retorno',
        rotulo: 'Retorno',
        esperado: 3,
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
        rotulo: 'Território',
        esperado: 4,
        texto: 'Abre segmento onde a empresa ainda não vende.',
        observavel: 'Primeiro contrato de um segmento novo, com playbook escrito depois.',
      },
      {
        id: 'sales-staff-multiplicador',
        rotulo: 'Multiplicador',
        esperado: 4,
        texto: 'Torna o time inteiro melhor no que ela faz bem.',
        observavel: 'Uma técnica dela vira parte do treinamento de quem entra.',
      },
      {
        id: 'sales-staff-parceria',
        rotulo: 'Parceria',
        esperado: 3,
        texto: 'Trabalha a conta junto com produto e engenharia.',
        observavel: 'Negócio complexo com escopo técnico acordado antes da assinatura.',
      },
    ],
  },
  // ── Design ────────────────────────────────────────────────────────────
  // A trilha existe porque o Diego existe. E ela é mais curta de propósito:
  // a Aurora escreveu a régua de Eng e Sales primeiro, e Design ficou para
  // depois — o que é exatamente o que acontece nas empresas de verdade.
  {
    trilha: 'design',
    nivel: 'senior',
    comportamentos: [
      {
        id: 'design-senior-pesquisa',
        rotulo: 'Pesquisa',
        esperado: 4,
        texto: 'Desenha depois de entender, não antes.',
        observavel: 'Existe registro de conversa com usuário anterior à primeira tela.',
      },
      {
        id: 'design-senior-recorte',
        rotulo: 'Recorte',
        esperado: 4,
        texto: 'Reduz o problema antes de resolver.',
        observavel: 'A proposta corta escopo com justificativa, em vez de acomodar tudo.',
      },
      {
        id: 'design-senior-entrega',
        rotulo: 'Entrega',
        esperado: 3,
        texto: 'Acompanha até virar produto.',
        observavel: 'Está na conversa quando a implementação diverge do desenho.',
      },
    ],
  },
  {
    trilha: 'design',
    nivel: 'staff',
    comportamentos: [
      {
        id: 'design-staff-sistema',
        rotulo: 'Sistema',
        esperado: 4,
        texto: 'Constrói o que o resto do time reusa.',
        observavel: 'Componentes e padrões que outras pessoas aplicam sem pedir ajuda.',
      },
      {
        id: 'design-staff-direcao',
        rotulo: 'Direção',
        esperado: 4,
        texto: 'Escolhe a direção do produto junto com quem decide.',
        observavel: 'Participa da decisão de escopo, não só da execução dela.',
      },
      {
        id: 'design-staff-medicao',
        rotulo: 'Medição',
        esperado: 3,
        texto: 'Fecha o ciclo com número.',
        observavel: 'O efeito do desenho aparece medido, não afirmado.',
      },
    ],
    derivado: {
      sugestao:
        'Design é a trilha com menor densidade de evidência da Aurora: 5 eventos no semestre contra uma média de 9. Não é falta de trabalho — é que pesquisa, facilitação e sustentação de design system não deixam rastro em PR nem em thread. Vale escrever na régua o que conta como observável aqui, ou o registro vai continuar punindo a função.',
      baseadoEm: ['diego'],
      status: 'proposto',
    },
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
  design: 'Design',
}

export const NOME_NIVEL: Record<string, string> = {
  pleno: 'Pleno',
  senior: 'Sênior',
  staff: 'Staff',
}
