import { notFound } from 'next/navigation'
import { skillPorId, skillsDoBrain } from '@/lib/skills'
import { Skill } from './skill'

/** Segmento estático, como `/diretrizes/regua`: nunca cai no `[id]` dos
 *  documentos, e um id que não existe é 404 e não documento vazio. */
export default async function PaginaSkill({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const skill = skillPorId(id)
  if (!skill) notFound()

  return <Skill skill={skill} />
}

export function generateStaticParams() {
  return skillsDoBrain().map((s) => ({ id: s.id }))
}
