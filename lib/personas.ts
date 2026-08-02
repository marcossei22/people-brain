import type { PessoaId } from '@/data/tipos'

/**
 * As personas do seletor, sem React.
 *
 * Vive separado de `viewer.tsx` porque o canal do agente (`agent/channels/eve.ts`)
 * importa daqui, e ele roda no runtime do eve — não pode arrastar um client
 * component junto.
 */

export type Papel = 'gestor' | 'colaborador' | 'chro'

export interface Viewer {
  pessoaId: PessoaId
  papel: Papel
}

export type Persona = Viewer

export const PERSONAS: Persona[] = [
  { pessoaId: 'marina', papel: 'gestor' },
  { pessoaId: 'carla', papel: 'colaborador' },
  { pessoaId: 'helena', papel: 'chro' },
]

/** Helena: é a única com acesso de admin, então o produto abre já mostrando a
 *  organização inteira e as telas de Setup. */
export const PERSONA_PADRAO =
  PERSONAS.find((p) => p.pessoaId === 'helena') ?? PERSONAS[0]

export const NOME_DO_PAPEL: Record<Papel, string> = {
  gestor: 'Gestora',
  colaborador: 'Colaboradora',
  chro: 'CHRO',
}
