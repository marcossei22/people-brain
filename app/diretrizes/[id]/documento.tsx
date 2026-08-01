'use client'

import { Markdown } from '@/components/brain/markdown'
import { SemAcesso } from '@/components/brain/sem-acesso'
import { CabecalhoDiretriz, CardSugestao, ComoOBrainUsa } from '@/components/brain/diretriz'
import type { Diretriz } from '@/data/diretrizes'
import { podeAdministrar } from '@/lib/agente/permissoes'
import { useViewer } from '@/lib/viewer'

export function Documento({ diretriz, texto }: { diretriz: Diretriz; texto: string }) {
  const { viewer, geracao } = useViewer()

  if (!podeAdministrar(viewer)) {
    return (
      <SemAcesso motivo="As diretrizes da empresa são editadas por quem responde por elas. Fale com o time de Pessoas." />
    )
  }

  return (
    <div key={geracao} className="mx-auto max-w-5xl px-10 py-12">
      <CabecalhoDiretriz d={diretriz} descricao={diretriz.resumo} />
      <ComoOBrainUsa d={diretriz} />
      <CardSugestao d={diretriz} />

      <div className="surgir mt-10 border-t border-border pt-8" style={{ animationDelay: '80ms' }}>
        <Markdown>{texto}</Markdown>
      </div>
    </div>
  )
}
