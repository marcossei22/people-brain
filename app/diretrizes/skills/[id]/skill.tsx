'use client'

/**
 * O procedimento inteiro, como o agente o recebe.
 *
 * A página não resume e não reescreve: o que está na tela é o arquivo que o
 * modelo carrega. Um resumo aqui seria a terceira versão da mesma coisa — e a
 * única que ninguém executa. É também o que faz esta tela responder à pergunta
 * que a liderança faz sobre qualquer produto de IA ("como é que ela decidiu
 * isso?"): o procedimento é legível, e é este.
 */

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Markdown } from '@/components/brain/markdown'
import { SemAcesso } from '@/components/brain/sem-acesso'
import { NOME_TIPO } from '@/data/diretrizes'
import { podeAdministrar } from '@/lib/agente/permissoes'
import type { SkillDoBrain } from '@/lib/skills'
import { useViewer } from '@/lib/viewer'

export function Skill({ skill }: { skill: SkillDoBrain }) {
  const { viewer, geracao } = useViewer()

  if (!podeAdministrar(viewer)) {
    return (
      <SemAcesso motivo="As diretrizes da empresa são editadas por quem responde por elas. Fale com o time de Pessoas." />
    )
  }

  return (
    <div key={geracao} className="mx-auto max-w-5xl px-10 py-12">
      <Link
        href="/diretrizes"
        className="etiqueta surgir inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3" />
        Diretrizes
      </Link>

      <header className="surgir mt-4">
        <div className="flex items-center gap-2.5">
          <h2 className="display text-[2.1rem] leading-none tracking-tight">{skill.titulo}</h2>
          <Badge variant="outline" className="etiqueta px-1.5 py-[3px]">
            procedimento
          </Badge>
        </div>
        <p className="prosa mt-3 max-w-xl text-[0.98rem] leading-relaxed text-muted-foreground">
          {skill.quando}
        </p>
      </header>

      {/* O que ele abre antes de responder. É o vínculo com a metade de cima da
          página anterior, e a razão de as duas conviverem numa tela só. */}
      <div className="surgir mt-8 border-l-2 border-border pl-4" style={{ animationDelay: '60ms' }}>
        <p className="etiqueta">Lê antes de responder</p>
        {skill.le.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {skill.le.map((tipo) => (
              <Badge key={tipo} variant="outline" className="etiqueta px-1.5 py-[3px]">
                {NOME_TIPO[tipo]}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="mt-1.5 text-[0.85rem] leading-snug text-muted-foreground">
            Nenhuma diretriz. Este lê o registro agregado — a pergunta dele é sobre a organização,
            não sobre o que a empresa escreveu.
          </p>
        )}
      </div>

      <div className="surgir mt-10 border-t border-border pt-8" style={{ animationDelay: '80ms' }}>
        <Markdown>{skill.corpo}</Markdown>
      </div>
    </div>
  )
}
