import type { Pessoa } from './tipos'

/**
 * O elenco da Aurora. Doze pessoas em cinco times.
 *
 * O elenco não é decorativo: cada pessoa existe para sustentar um achado. A
 * dependência com Dados precisa de gente de times diferentes travada pela
 * mesma fila; a cobertura zero do Paulo precisa de reports dele; e o Diego
 * precisa existir para o loop de elicitação ter onde se provar.
 */
export const pessoas: Pessoa[] = [
  // ── Pagamentos ─────────────────────────────────────────────────────────
  {
    id: 'marina',
    nome: 'Marina Duarte',
    cargo: 'Engineering Manager',
    trilha: 'eng',
    nivel: 'staff',
    time: 'Pagamentos',
    desde: '2023-03-06',
    densidadeEvidencia: 'baixa',
  },
  {
    id: 'carla',
    nome: 'Carla Nunes',
    cargo: 'Engenheira de Software',
    trilha: 'eng',
    nivel: 'pleno',
    gestorId: 'marina',
    time: 'Pagamentos',
    desde: '2024-01-15',
    densidadeEvidencia: 'alta',
  },
  {
    id: 'rafael',
    nome: 'Rafael Lima',
    cargo: 'Engenheiro de Software Sênior',
    trilha: 'eng',
    nivel: 'senior',
    gestorId: 'marina',
    time: 'Pagamentos',
    desde: '2022-08-01',
    densidadeEvidencia: 'media',
  },
  {
    id: 'bruno',
    nome: 'Bruno Sato',
    cargo: 'Engenheiro de Software',
    trilha: 'eng',
    nivel: 'pleno',
    gestorId: 'marina',
    time: 'Pagamentos',
    desde: '2024-09-02',
    // O esquecido. Densidade baixa aqui não é bug do dataset — é o caso que
    // os componentes precisam saber renderizar.
    densidadeEvidencia: 'baixa',
  },

  // ── Plataforma · o time do Paulo, que não registra feedback ────────────
  {
    id: 'paulo',
    nome: 'Paulo Rocha',
    cargo: 'Engineering Manager',
    trilha: 'eng',
    nivel: 'staff',
    time: 'Plataforma',
    desde: '2021-11-08',
    densidadeEvidencia: 'baixa',
  },
  {
    id: 'thiago',
    nome: 'Thiago Reis',
    cargo: 'Engenheiro de Software Sênior',
    trilha: 'eng',
    nivel: 'senior',
    gestorId: 'paulo',
    time: 'Plataforma',
    desde: '2022-02-14',
    densidadeEvidencia: 'media',
  },
  {
    id: 'juliana',
    nome: 'Juliana Castro',
    cargo: 'Engenheira de Software',
    trilha: 'eng',
    nivel: 'pleno',
    gestorId: 'paulo',
    time: 'Plataforma',
    desde: '2023-10-02',
    densidadeEvidencia: 'media',
  },

  // ── Dados · o gargalo, visto de dentro ─────────────────────────────────
  {
    id: 'andre',
    nome: 'André Vilela',
    cargo: 'Engenheiro de Dados Sênior',
    trilha: 'eng',
    nivel: 'senior',
    gestorId: 'paulo',
    time: 'Dados',
    desde: '2022-05-16',
    densidadeEvidencia: 'media',
  },

  // ── Vendas ─────────────────────────────────────────────────────────────
  {
    id: 'leticia',
    nome: 'Letícia Alves',
    cargo: 'Account Executive Sênior',
    trilha: 'sales',
    nivel: 'senior',
    gestorId: 'helena',
    time: 'Vendas',
    desde: '2023-06-12',
    densidadeEvidencia: 'media',
  },
  {
    id: 'sofia',
    nome: 'Sofia Brandão',
    cargo: 'Account Executive',
    trilha: 'sales',
    nivel: 'pleno',
    gestorId: 'helena',
    time: 'Vendas',
    desde: '2024-04-08',
    densidadeEvidencia: 'media',
  },

  // ── Design · onde a legibilidade digital falha ─────────────────────────
  {
    // Densidade baixa por natureza da função, não por descuido de ninguém.
    // Com a Carla o sistema observa muito e pergunta pouco; com o Diego
    // observa pouco e pergunta mais. Mesmo mecanismo, comportamento
    // diferente conforme o rastro que o trabalho deixa.
    id: 'diego',
    nome: 'Diego Moura',
    cargo: 'Design Lead',
    trilha: 'design',
    nivel: 'staff',
    gestorId: 'helena',
    time: 'Design',
    desde: '2022-09-05',
    densidadeEvidencia: 'baixa',
  },

  // ── Pessoas ────────────────────────────────────────────────────────────
  {
    // Observadora do fluxo 3. Sem trilha nem nível: não é avaliada, avalia a
    // organização. É também quem administra as diretrizes (§8.4).
    id: 'helena',
    nome: 'Helena Prado',
    cargo: 'CHRO',
    time: 'Pessoas',
    desde: '2022-02-14',
    densidadeEvidencia: 'baixa',
  },
]

export const porId = (id: string) => pessoas.find((p) => p.id === id)
