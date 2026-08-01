import { notFound } from 'next/navigation'
import { diretrizes } from '@/data/diretrizes'
import { lerDoutrina } from '@/lib/doutrina'
import { Documento } from './documento'

/** Os documentos em prosa. A régua tem rota estática própria — segmento
 *  estático ganha do dinâmico, então `/diretrizes/regua` nunca cai aqui. */
export default async function PaginaDocumento({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const d = diretrizes.find((x) => x.id === id)
  if (!d?.arquivo) notFound()

  const texto = await lerDoutrina(d.arquivo)
  return <Documento diretriz={d} texto={texto} />
}

export function generateStaticParams() {
  return diretrizes.filter((d) => d.arquivo).map((d) => ({ id: d.id }))
}
