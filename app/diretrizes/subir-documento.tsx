'use client'

/**
 * Subir documento — ARQUITETURA.md §8.4.
 *
 * Encenação, e declarada como tal no fim do fluxo: não há persistência (#15),
 * então um arquivo que sobrevivesse ao reload seria mentira. O que a tela
 * demonstra é o caminho real: arquivo → o Brain propõe a estrutura → o humano
 * aprova. É o mesmo loop da régua viva, aplicado à entrada de conteúdo.
 */

import { useState } from 'react'
import { Check, FileText, Loader2, UploadCloud } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type Fase = 'escolher' | 'lendo' | 'proposta'

const EXTRAIDO = [
  'Trilha de Produto · 3 níveis',
  '14 comportamentos, dos quais 11 com exemplo observável',
  '3 comportamentos sem exemplo — o Brain vai perguntar',
]

export function SubirDocumento({ aberto, aoFechar }: { aberto: boolean; aoFechar: () => void }) {
  const [fase, setFase] = useState<Fase>('escolher')

  function escolher() {
    setFase('lendo')
    setTimeout(() => setFase('proposta'), 1400)
  }

  function fechar() {
    aoFechar()
    setTimeout(() => setFase('escolher'), 250)
  }

  return (
    <Dialog open={aberto} onOpenChange={(o) => !o && fechar()}>
      <DialogContent className="max-h-[85dvh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="display text-[1.3rem] tracking-tight">
            Subir documento
          </DialogTitle>
          <DialogDescription className="prosa text-[0.9rem]">
            PDF, Word ou Markdown. O Brain lê e propõe a estrutura; você aprova.
          </DialogDescription>
        </DialogHeader>

        {fase === 'escolher' && (
          <button
            onClick={escolher}
            className="flex w-full flex-col items-center gap-2.5 rounded-sm border border-dashed border-border px-6 py-10 transition-colors hover:border-comp/50 hover:bg-comp-suave/20"
          >
            <UploadCloud className="size-6 text-muted-foreground/60" />
            <span className="text-[0.88rem]">Arraste um arquivo ou clique para escolher</span>
            <span className="font-mono text-[0.72rem] text-muted-foreground">
              .pdf · .docx · .md
            </span>
          </button>
        )}

        {fase === 'lendo' && (
          <div className="flex flex-col items-center gap-3 px-6 py-12">
            <Loader2 className="size-5 animate-spin text-comp" />
            <p className="text-[0.88rem] text-muted-foreground">
              Lendo <span className="font-mono">ladder-produto-2026.pdf</span>
            </p>
          </div>
        )}

        {fase === 'proposta' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 rounded-sm border border-border bg-card px-3.5 py-3">
              <FileText className="size-4 shrink-0 text-muted-foreground" />
              <span className="font-mono text-[0.78rem]">ladder-produto-2026.pdf</span>
              <span className="ml-auto font-mono text-[0.72rem] text-muted-foreground">
                214 KB
              </span>
            </div>

            <div>
              <p className="etiqueta pb-2">O Brain encontrou</p>
              <ul className="space-y-1.5">
                {EXTRAIDO.map((e) => (
                  <li key={e} className="flex items-baseline gap-2.5 text-[0.88rem]">
                    <Check className="size-3.5 shrink-0 translate-y-[2px] text-comp" />
                    {e}
                  </li>
                ))}
              </ul>
            </div>

            <p className="prosa text-[0.86rem] leading-snug text-muted-foreground">
              Nada entra na régua sem você revisar comportamento a comportamento.
            </p>

            <div className="flex gap-2">
              <Button size="sm" className="flex-1" onClick={fechar}>
                Revisar e adicionar
              </Button>
              <Button size="sm" variant="ghost" onClick={fechar}>
                Cancelar
              </Button>
            </div>

            <p className="border-t border-border pt-3 text-[0.72rem] text-muted-foreground/70">
              Protótipo: o arquivo não é enviado nem persistido.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
