import { notFound } from 'next/navigation'
import { pessoas } from '@/data/pessoas'
import { Dossie } from './dossie'

/**
 * Sem `generateStaticParams` de propósito. O viewer é estado de cliente, então
 * o gate de permissão só roda no navegador — e uma página pré-renderizada
 * entregaria o dossiê inteiro no HTML inicial, para qualquer um que abrisse o
 * código-fonte. Num protótipo cuja tese é "permissão é código", isso seria
 * exatamente o detalhe que derruba a demonstração.
 */
export default async function PaginaPessoa({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!pessoas.some((p) => p.id === id)) notFound()
  return <Dossie pessoaId={id} />
}
