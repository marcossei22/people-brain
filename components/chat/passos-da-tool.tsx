'use client'

/**
 * Tool calls visíveis — ARQUITETURA.md §7.2.
 *
 * Enquanto o agente trabalha, a UI mostra os passos em mono. É o momento em
 * que a arquitetura fica visível na câmera: dá pra apontar e dizer "ele leu a
 * doutrina da empresa antes de consultar a memória".
 */

import { Check, Loader2 } from 'lucide-react'

const ROTULO: Record<string, string> = {
  buscar_pessoas: 'consultando memória · pessoas',
  ler_eventos: 'consultando memória · eventos',
  ler_episodios: 'consultando memória · episódios',
  ler_temas: 'consultando memória · temas',
  listar_lacunas: 'consultando memória · lacunas',
  ler_feedbacks: 'consultando memória · feedbacks',
  diagnosticar_organizacao: 'consultando os achados de organização',
  ler_regua: 'lendo a régua',
  ler_doutrina: 'lendo a doutrina da empresa',
  load_skill: 'carregando skill',
  list_skills: 'listando as skills',
  ask_question: 'perguntando',
  renderizar: 'montando a resposta',
}

export interface PassoTool {
  id: string
  nome: string
  argumento?: string
  resultado?: string
  concluido: boolean
}

export function PassosDaTool({ passos }: { passos: PassoTool[] }) {
  if (passos.length === 0) return null

  return (
    <ol className="my-2 space-y-1">
      {passos.map((p) => (
        <li key={p.id} className="flex items-baseline gap-2 font-mono text-[0.7rem] leading-relaxed">
          {p.concluido ? (
            <Check className="size-2.5 shrink-0 translate-y-[3px] text-comp" />
          ) : (
            <Loader2 className="size-2.5 shrink-0 translate-y-[3px] animate-spin text-muted-foreground" />
          )}
          <span className="text-muted-foreground">
            {ROTULO[p.nome] ?? p.nome}
            {p.argumento && <span className="text-foreground/45"> · {p.argumento}</span>}
          </span>
          {p.resultado && <span className="ml-auto shrink-0 text-foreground/40">▸ {p.resultado}</span>}
        </li>
      ))}
    </ol>
  )
}
