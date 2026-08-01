import type { Tema } from './tipos'

/**
 * SEED MÍNIMO — 1 tema. `comportamentosRegua` é o que liga padrão observado a
 * decisão de promoção: sem esse campo, tema é elogio; com ele, é argumento.
 * `confianca` é função da densidade de evidência da pessoa, não da força do
 * padrão — dizer "alta" sobre quem tem dois eventos seria mentira estatística.
 */
export const temas: Tema[] = [
  {
    id: 'tema-carla-coordenacao',
    pessoaId: 'carla',
    padrao: 'Assume coordenação cross-team que ninguém pediu.',
    episodioIds: ['ep-carla-dados', 'ep-carla-onboarding'],
    comportamentosRegua: ['eng-senior-influencia', 'eng-senior-desbloqueio', 'eng-senior-mentoria'],
    confianca: 'alta',
  },
]

export const temasDe = (pessoaId: string) => temas.filter((t) => t.pessoaId === pessoaId)
