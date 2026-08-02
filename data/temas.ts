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
export const temas: Tema[] = [
  // ── Carla ───────────────────────────────────────────────────────────────
  {
    id: 'tema-carla-coordenacao',
    pessoaId: 'carla',
    padrao: 'Assume coordenação cross-team que ninguém pediu.',
    episodioIds: ['ep-carla-dados', 'ep-carla-onboarding'],
    comportamentosRegua: ['eng-senior-influencia', 'eng-senior-desbloqueio', 'eng-senior-mentoria'],
    confianca: 'alta',
  },
  {
    id: 'tema-carla-risco',
    pessoaId: 'carla',
    padrao: 'Escreve o modo de falha antes de mexer em produção.',
    episodioIds: ['ep-carla-migracao', 'ep-carla-idempotencia'],
    comportamentosRegua: ['eng-senior-risco', 'eng-pleno-qualidade'],
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
