import { notFound } from 'next/navigation'
import { pessoas } from '@/data/pessoas'
import { Fechamento } from './fechamento'

/**
 * Sem `generateStaticParams`, pelo mesmo motivo de `/org/[id]`: o viewer é
 * estado de cliente, o gate de permissão só roda no navegador, e uma página
 * pré-renderizada entregaria a régua avaliada de qualquer pessoa no HTML
 * inicial. Aqui o custo seria maior que no dossiê — o que vazaria não é só o
 * registro, é a avaliação.
 */
export default async function PaginaFechamento({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!pessoas.some((p) => p.id === id)) notFound()
  return <Fechamento pessoaId={id} />
}
