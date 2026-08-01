import { diretrizes } from '@/data/diretrizes'
import { lerTodaDoutrina } from '@/lib/doutrina'
import { IndiceDiretrizes } from './indice'

/** Server component: lê os .md do disco e entrega o conteúdo pronto ao cliente,
 *  que é quem conhece o viewer e faz o gate de permissão. */
export default async function PaginaDiretrizes() {
  const textos = await lerTodaDoutrina(diretrizes.map((d) => d.arquivo))
  return <IndiceDiretrizes textos={textos} />
}
