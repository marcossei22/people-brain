import type { AchadoOrg } from './tipos'

/**
 * Diagnóstico de organização — output de primeira classe (decisão #10).
 *
 * É a diferença entre "o Rafael é lento" e "Dados é gargalo de seis pessoas em
 * quatro times". A primeira frase produz um plano de desenvolvimento individual
 * inútil; a segunda produz uma decisão de alocação.
 *
 * Cada achado aponta as pessoas e os episódios que o sustentam — o mesmo
 * princípio de fonte que vale para indivíduo vale para organização. E nenhum
 * deles nomeia culpado: a unidade de análise é o sistema, não a pessoa.
 */
export const achadosOrg: AchadoOrg[] = [
  {
    id: 'org-dados-gargalo',
    tipo: 'gargalo',
    titulo: 'A fila de Dados travou seis pessoas em quatro times neste semestre',
    evidencia: {
      pessoaIds: ['carla', 'rafael', 'thiago', 'juliana', 'leticia', 'andre'],
      episodioIds: [
        'ep-rafael-conciliacao',
        'ep-thiago-cache',
        'ep-juliana-logs',
        'ep-leticia-meridiana',
        'ep-carla-dados',
      ],
    },
    recomendacao:
      'Dezenove pedidos, uma pessoa. Duas entregas foram reprogramadas, duas saíram com dívida assumida e um contrato fechou com escopo menor. Três das cinco pessoas bloqueadas aparecem no fechamento com "entrega atrasada" no registro — atraso que não é delas. Antes de qualquer leitura individual, decidir capacidade de Dados.',
  },
  {
    id: 'org-cobertura-paulo',
    tipo: 'cobertura-gestor',
    titulo: 'Plataforma passou o semestre sem nenhum feedback registrado',
    evidencia: {
      pessoaIds: ['paulo', 'thiago', 'juliana', 'andre'],
      episodioIds: ['ep-thiago-observabilidade', 'ep-juliana-ci', 'ep-andre-fila'],
    },
    recomendacao:
      'Três reports, seis meses, zero registros — enquanto Pagamentos e Vendas registraram nove. Não é conclusão sobre o Paulo: pode ser que as conversas aconteçam e não sejam registradas. A pergunta já está na fila. Mas o time com a maior alavancagem técnica da Aurora é o que chega ao fechamento sem nada escrito, e isso é um risco de decisão, não de gestão.',
  },
  {
    id: 'org-legibilidade-design',
    tipo: 'gap-skill',
    titulo: 'Design deixa metade do rastro das outras trilhas',
    evidencia: {
      pessoaIds: ['diego'],
      episodioIds: ['ep-diego-checkout'],
    },
    recomendacao:
      'Cinco eventos no semestre contra uma média de nove. Duas das três evidências mais fortes do Diego só existem porque foram perguntadas — pesquisa com usuário e sustentação do design system não geram PR nem thread. Sem uma definição de observável específica para a trilha, legibilidade digital vira proxy de performance, e a função é punida por como trabalha. A régua já tem uma sugestão pendente sobre isso.',
  },
  {
    id: 'org-promocao-travada',
    tipo: 'bloqueio-promocao',
    titulo: 'Dois casos de promoção dependem de evidência que o registro não captura',
    evidencia: {
      pessoaIds: ['carla', 'diego'],
      episodioIds: ['ep-carla-dados', 'ep-diego-checkout'],
      // As duas perguntas de que este achado depende. Respondidas, ele cai:
      // o bloqueio era a evidência faltando, e ela deixou de faltar.
      lacunaIds: ['lac-carla-articulacao', 'lac-diego-direcao'],
    },
    recomendacao:
      'Nos dois casos o resultado está registrado e a ação que o produziu não. Da Carla falta a articulação que virou fila dedicada; do Diego falta quem estava na sala quando o escopo foi decidido. São duas perguntas, não dois processos — e ambas cabem no orçamento desta semana.',
  },
]

export const NOME_TIPO_ACHADO: Record<AchadoOrg['tipo'], string> = {
  gargalo: 'Gargalo',
  'bloqueio-promocao': 'Bloqueio de promoção',
  'cobertura-gestor': 'Cobertura de gestão',
  'gap-skill': 'Legibilidade da trilha',
}
