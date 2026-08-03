import type { Tema } from './tipos'

/**
 * Temas — padrões que atravessam episódios.
 *
 * É o que separa "fez isso uma vez" de argumento. E é a resposta para "por que
 * não basta buscar no Slack?": busca dá evento; decisão precisa de tema, e tema
 * só existe para quem estava olhando continuamente.
 *
 * `confianca` é função da densidade de evidência da pessoa, não da força do
 * padrão. Dizer "alta" sobre quem tem cinco eventos seria mentira estatística,
 * e o validador recusa.
 */
/**
 * UM TEMA APONTA PARA OS DOIS NÍVEIS, e não só para o de cima.
 *
 * O mesmo trabalho responde a duas perguntas diferentes: "o que falta para
 * subir" (a régua do nível alvo, que o dossiê mostra o ano inteiro) e "ela
 * sustenta o que já é dela" (a régua do nível ocupado, que é a do fechamento —
 * JORNADAS G5). Enquanto os temas só carregavam os ids do nível alvo, a segunda
 * pergunta não tinha resposta: a Carla saía com três de quatro comportamentos
 * de pleno "sem evidência" tendo catorze eventos e densidade alta, o que não é
 * leitura do registro dela — é buraco no mapeamento.
 *
 * O critério para adicionar um id é o `observavel` da régua, e não a
 * plausibilidade: o episódio tem que mostrar o que aquela linha descreve. Onde
 * ele não mostra, o comportamento fica sem evidência mesmo, e é isso que o
 * fechamento precisa poder dizer.
 */
export const temas: Tema[] = [
  // ── Carla ───────────────────────────────────────────────────────────────
  {
    id: 'tema-carla-coordenacao',
    pessoaId: 'carla',
    padrao: 'Assume coordenação cross-team que ninguém pediu.',
    episodioIds: ['ep-carla-dados', 'ep-carla-onboarding'],
    // `eng-pleno-colaboracao` pede "revisões apontam consequência, não estilo",
    // e o onboarding do Bruno é literalmente PR revisado linha a linha.
    comportamentosRegua: [
      'eng-senior-influencia',
      'eng-senior-desbloqueio',
      'eng-senior-mentoria',
      'eng-pleno-colaboracao',
    ],
    confianca: 'alta',
  },
  {
    id: 'tema-carla-risco',
    pessoaId: 'carla',
    padrao: 'Escreve o modo de falha antes de mexer em produção.',
    episodioIds: ['ep-carla-migracao', 'ep-carla-idempotencia'],
    // `eng-pleno-entrega` pede "fecha o escopo combinado sem acompanhamento
    // diário": migração em três fases conduzida até o fim sem incidente, e a
    // idempotência refatorada e documentada sem ninguém atrás.
    comportamentosRegua: [
      'eng-senior-risco',
      'eng-pleno-qualidade',
      'eng-pleno-entrega',
    ],
    confianca: 'alta',
  },

  // ── Rafael ──────────────────────────────────────────────────────────────
  {
    id: 'tema-rafael-divida',
    pessoaId: 'rafael',
    padrao: 'Entrega com escopo cortado e dívida registrada em vez de esperar destravar.',
    episodioIds: ['ep-rafael-conciliacao', 'ep-rafael-gateway'],
    comportamentosRegua: ['eng-senior-ambiguidade', 'eng-senior-risco'],
    confianca: 'media',
  },
  {
    id: 'tema-rafael-reproducao',
    pessoaId: 'rafael',
    padrao: 'Transforma bug intermitente em caso determinístico antes de corrigir.',
    episodioIds: ['ep-rafael-webhook'],
    comportamentosRegua: ['eng-pleno-qualidade', 'eng-senior-risco'],
    confianca: 'media',
  },

  // ── Bruno ───────────────────────────────────────────────────────────────
  {
    /**
     * O único tema do Bruno, e ele existe para o fechamento ter o que mostrar
     * quando o registro quase não alcançou.
     *
     * Confiança baixa, um episódio só, nota 1 — e nota 1 aqui é CONTAGEM, não
     * veredito de fraqueza: um episódio sustenta o comportamento e mais nada
     * foi encontrado. Com densidade baixa ao lado, essa linha pede a mesma
     * coisa que "sem evidência" pede, que é uma pergunta na semana seguinte.
     * É o caso que impede a tela de fechamento de ser lida como vigilância, e
     * sem ele o Bruno chega ao fechamento com quatro linhas vazias e o produto
     * não tem onde demonstrar a distinção.
     *
     * O episódio inteiro só existe porque foi perguntado — seis semanas de
     * plantão que não deixaram rastro em PR nenhum.
     */
    id: 'tema-bruno-plantao',
    pessoaId: 'bruno',
    padrao: 'Sustenta incidente longo até o fim, com o caso reproduzido antes de abrir.',
    episodioIds: ['ep-bruno-plantao'],
    comportamentosRegua: ['eng-pleno-entrega'],
    confianca: 'baixa',
  },

  // ── Thiago ──────────────────────────────────────────────────────────────
  {
    id: 'tema-thiago-alavanca',
    pessoaId: 'thiago',
    padrao: 'Resolve a classe do problema: o que ele constrói vira ferramenta de outros times.',
    episodioIds: ['ep-thiago-observabilidade'],
    comportamentosRegua: ['eng-staff-alavanca', 'eng-staff-padrao', 'eng-senior-mentoria'],
    confianca: 'media',
  },

  // ── Juliana ─────────────────────────────────────────────────────────────
  {
    id: 'tema-juliana-atrito',
    pessoaId: 'juliana',
    padrao: 'Ataca atrito que todo mundo aceitou como normal.',
    episodioIds: ['ep-juliana-ci'],
    comportamentosRegua: ['eng-senior-ambiguidade', 'eng-pleno-qualidade'],
    confianca: 'media',
  },

  // ── André ───────────────────────────────────────────────────────────────
  {
    id: 'tema-andre-transparencia',
    pessoaId: 'andre',
    padrao: 'Torna a própria fila visível em vez de absorver a pressão em silêncio.',
    episodioIds: ['ep-andre-fila', 'ep-andre-catalogo'],
    comportamentosRegua: ['eng-senior-desbloqueio', 'eng-senior-ambiguidade'],
    confianca: 'media',
  },

  // ── Letícia ─────────────────────────────────────────────────────────────
  {
    id: 'tema-leticia-mapeamento',
    pessoaId: 'leticia',
    padrao: 'Mapeia a estrutura de decisão do cliente antes de propor qualquer coisa.',
    episodioIds: ['ep-leticia-nexa', 'ep-leticia-renovacao'],
    comportamentosRegua: ['sales-senior-complexidade', 'sales-senior-negociacao'],
    confianca: 'media',
  },
  {
    id: 'tema-leticia-retorno',
    pessoaId: 'leticia',
    padrao: 'Devolve para dentro o que o mercado disse, por escrito.',
    episodioIds: ['ep-leticia-renovacao', 'ep-leticia-meridiana'],
    comportamentosRegua: ['sales-senior-retorno'],
    confianca: 'media',
  },

  // ── Sofia ───────────────────────────────────────────────────────────────
  {
    id: 'tema-sofia-previsibilidade',
    pessoaId: 'sofia',
    padrao: 'Prefere volume previsível a pico, e a previsão dela se sustenta.',
    episodioIds: ['ep-sofia-midmarket'],
    comportamentosRegua: ['sales-pleno-registro', 'sales-senior-pipeline'],
    confianca: 'media',
  },
  {
    id: 'tema-sofia-multiplicacao',
    pessoaId: 'sofia',
    padrao: 'Transforma o que faz bem em material que outra pessoa consegue usar.',
    episodioIds: ['ep-sofia-playbook'],
    comportamentosRegua: ['sales-staff-multiplicador'],
    confianca: 'media',
  },

  // ── Diego ───────────────────────────────────────────────────────────────
  {
    // Confiança baixa não porque o padrão seja fraco, mas porque a evidência
    // é rala. É o trade-off #1 aparecendo no dado, e não escondido nele.
    id: 'tema-diego-pesquisa',
    pessoaId: 'diego',
    padrao: 'Só desenha depois de conversar com quem usa.',
    episodioIds: ['ep-diego-checkout'],
    comportamentosRegua: ['design-senior-pesquisa', 'design-staff-medicao'],
    confianca: 'baixa',
  },
]

export const temasDe = (pessoaId: string) => temas.filter((t) => t.pessoaId === pessoaId)
