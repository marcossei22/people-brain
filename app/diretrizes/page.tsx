import { IndiceDiretrizes } from './indice'
import { skillsDoBrain } from '@/lib/skills'

/**
 * A leitura dos arquivos de skill acontece aqui, no servidor, e desce como
 * prop: o índice é client component (o gate de admin roda no navegador) e não
 * pode abrir `node:fs`.
 */
export default function PaginaDiretrizes() {
  return <IndiceDiretrizes skills={skillsDoBrain()} />
}
