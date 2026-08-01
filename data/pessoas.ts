import type { Pessoa } from './tipos'

/**
 * SEED MÍNIMO — ARQUITETURA.md §13, Fase A.
 * Elenco completo (8 pessoas) entra no passo 9. Aqui só o necessário para
 * exercitar os casos difíceis: densidade baixa, lacuna aberta, episódio sem
 * estrela, recusa por escopo e recusa por acesso.
 *
 * Letícia não é report da Marina — existe no seed para que a recusa de acesso
 * (§6.6) tenha alvo real, e para que a trilha `sales` não seja teórica.
 */
export const pessoas: Pessoa[] = [
  {
    id: 'marina',
    nome: 'Marina Duarte',
    cargo: 'Engineering Manager',
    trilha: 'eng',
    nivel: 'staff',
    time: 'Pagamentos',
    desde: '2023-03-06',
    densidadeEvidencia: 'media',
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
    // O esquecido. A densidade baixa aqui não é bug do seed — é o caso
    // difícil que os componentes precisam saber renderizar.
    densidadeEvidencia: 'baixa',
  },
  {
    id: 'leticia',
    nome: 'Letícia Alves',
    cargo: 'Account Executive Sênior',
    trilha: 'sales',
    nivel: 'senior',
    // Sem gestor no seed: a liderança de Vendas entra com o elenco completo
    // (passo 9). Aqui ela existe para dar alvo à recusa de acesso.
    time: 'Vendas',
    desde: '2023-06-12',
    densidadeEvidencia: 'media',
  },
  {
    id: 'paulo',
    nome: 'Paulo Rocha',
    cargo: 'Engineering Manager',
    trilha: 'eng',
    nivel: 'staff',
    time: 'Plataforma',
    desde: '2021-11-08',
    // Cobertura de feedback ≈ zero — vira achado de organização no fluxo 3.
    densidadeEvidencia: 'baixa',
  },
]

export const porId = (id: string) => pessoas.find((p) => p.id === id)
