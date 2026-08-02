'use client'

/**
 * `/org/[id]` — o dossiê. ARQUITETURA.md §8.2.
 *
 * UM COMPONENTE, DOIS OBSERVADORES. A Carla vendo o próprio registro e a
 * Marina vendo o registro da Carla renderizam esta mesma função, com campos
 * governados por `permissoes.ts`. Isso não é economia de código: é o princípio
 * "sem arquivo secreto" virando fato que dá pra apontar na câmera — troca a
 * persona no rodapé da sidebar, sem sair da página.
 *
 * A estrela fica no EPISÓDIO e só para o gestor. Onde estaria a estrela
 * negativa, existe "Conversar sobre isso" — reconhecimento pode ser clique,
 * preocupação tem que ser conversa (decisão #7).
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Flag,
  MessageCircle,
  MessageSquarePlus,
  Plus,
  Star,
  Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Densidade } from '@/components/shell/densidade'
import { Fonte } from '@/components/brain/fonte'
import { SemAcesso } from '@/components/brain/sem-acesso'
import { regua } from '@/data/regua'
import { eventoPorId } from '@/data/eventos'
import { lacunas as todasLacunas } from '@/data/lacunas'
import { podeConsultar } from '@/lib/agente/permissoes'
import { useChat } from '@/lib/chat'
import {
  diasDesde,
  episodiosDe,
  eventosDe,
  nomeDe,
  pessoa as buscarPessoa,
  temasDe,
  ultimoRegistro,
} from '@/lib/memoria'
import { useViewer } from '@/lib/viewer'

const NIVEL_SEGUINTE: Record<string, string | undefined> = {
  pleno: 'senior',
  senior: 'staff',
  staff: undefined,
}

export function Dossie({ pessoaId }: { pessoaId: string }) {
  const { viewer, geracao } = useViewer()
  const { abrirCom } = useChat()
  const [estrelas, setEstrelas] = useState<Record<string, boolean>>({})

  // Nada de conteúdo antes da hidratação: no servidor não existe viewer, e
  // renderizar o dossiê ali entregaria o registro sem passar pela permissão.
  const [montado, setMontado] = useState(false)
  useEffect(() => setMontado(true), [])

  const p = buscarPessoa(pessoaId)
  const auth = podeConsultar(viewer, pessoaId)

  if (!montado) return <div className="mx-auto max-w-4xl px-10 py-12" />
  if (!p) return null
  if (!auth.ok) return <SemAcesso motivo={auth.motivo} />

  const souEu = viewer.pessoaId === pessoaId
  const souGestor = viewer.papel === 'gestor' && p.gestorId === viewer.pessoaId
  const episodios = episodiosDe(pessoaId)
  const temas = temasDe(pessoaId)
  const eventos = eventosDe(pessoaId)
  const soltos = eventos.filter((e) => !e.episodioId)
  const lacunas = todasLacunas.filter((l) => l.pessoaId === pessoaId && l.status !== 'descartada')
  const dias = diasDesde(ultimoRegistro(pessoaId))
  const alvo = p.nivel ? NIVEL_SEGUINTE[p.nivel] : undefined

  return (
    <div key={geracao} className="mx-auto max-w-4xl px-10 py-12">
      <Link
        href="/org"
        className="etiqueta surgir inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3" />
        Organização
      </Link>

      <header className="surgir mt-4 flex items-start justify-between gap-8">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="display text-[2.1rem] leading-none tracking-tight">{p.nome}</h2>
            {souEu && (
              <Badge
                variant="outline"
                className="etiqueta border-comp/35 bg-comp-suave/40 px-1.5 py-[3px] text-comp"
              >
                você
              </Badge>
            )}
          </div>
          <p className="mt-2.5 text-[0.9rem] text-muted-foreground">
            {p.cargo}
            {p.nivel && <span className="text-foreground/45"> · {p.nivel}</span>}
            <span className="text-foreground/45"> · {p.time}</span>
            {p.gestorId && (
              <span className="text-foreground/45"> · reporta a {nomeDe(p.gestorId)}</span>
            )}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="etiqueta pb-1.5">Densidade de evidência</p>
          <div className="flex items-center justify-end gap-2">
            <span className="text-[0.82rem] text-muted-foreground">{p.densidadeEvidencia}</span>
            <Densidade nivel={p.densidadeEvidencia} />
          </div>
          <p className="mt-2 font-mono text-[0.7rem] text-muted-foreground/70">
            {eventos.length} eventos · {episodios.length} episódios
          </p>
          {dias !== undefined && (
            <p className="font-mono text-[0.7rem] text-muted-foreground/70">
              último registro há {dias} dias
            </p>
          )}
        </div>
      </header>

      <div className="surgir mt-6 flex flex-wrap gap-2" style={{ animationDelay: '60ms' }}>
        <Button
          size="sm"
          variant="outline"
          className="h-8 gap-1.5 text-[0.8rem]"
          onClick={() => abrirCom(perguntaPadrao(p.nome, alvo, souEu))}
        >
          <MessageSquarePlus className="size-3.5" />
          Perguntar sobre {primeiroNome(p.nome)}
        </Button>

        {souEu && (
          <>
            <Button size="sm" variant="outline" className="h-8 gap-1.5 text-[0.8rem]">
              <Plus className="size-3.5" />
              Adicionar contexto
            </Button>
            <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-[0.8rem] text-muted-foreground">
              <Flag className="size-3.5" />
              Contestar item
            </Button>
          </>
        )}
      </div>

      {temas.length > 0 && (
        <section className="mt-12">
          <div className="flex items-baseline justify-between pb-2.5">
            <p className="etiqueta">Padrões</p>
            <p className="etiqueta">Comportamentos da régua</p>
          </div>
          <Separator />
          <ul>
            {temas.map((t, i) => (
              <li
                key={t.id}
                className="surgir border-b border-border/60 py-4"
                style={{ animationDelay: `${120 + i * 40}ms` }}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="min-w-0">
                    <p className="prosa text-[1.02rem] leading-snug">{t.padrao}</p>
                    <p className="mt-1.5 font-mono text-[0.7rem] text-muted-foreground/70">
                      {t.episodioIds.length} episódios · confiança {t.confianca}
                    </p>
                  </div>
                  <ul className="hidden w-[17rem] shrink-0 space-y-1 sm:block">
                    {t.comportamentosRegua.map((id) => (
                      <li key={id} className="text-[0.78rem] leading-snug text-muted-foreground">
                        {textoDoComportamento(id)}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-12">
        <div className="flex items-baseline justify-between pb-2.5">
          <p className="etiqueta">Episódios</p>
          <p className="etiqueta">{episodios.length} no semestre</p>
        </div>
        <Separator />

        {episodios.length === 0 ? (
          <p className="prosa mt-4 max-w-xl text-[0.92rem] leading-relaxed text-muted-foreground">
            Nenhum episódio registrado neste semestre. Os {eventos.length} eventos abaixo ainda não
            foram agrupados.
          </p>
        ) : (
          <ul>
            {episodios.map((ep, i) => {
              const temEstrela = Boolean(ep.estrela) || estrelas[ep.id]
              return (
                <li
                  key={ep.id}
                  className="surgir border-b border-border/60 py-5"
                  style={{ animationDelay: `${160 + i * 50}ms` }}
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="display text-[1.1rem] leading-tight tracking-tight">
                          {ep.titulo}
                        </h3>
                        {ep.nivelObservado && (
                          <Badge variant="outline" className="etiqueta px-1.5 py-[3px]">
                            nível {ep.nivelObservado}
                          </Badge>
                        )}
                      </div>
                      <p className="prosa mt-1.5 max-w-xl text-[0.92rem] leading-relaxed text-muted-foreground">
                        {ep.resumo}
                      </p>
                      <p className="mt-2 font-mono text-[0.7rem] text-muted-foreground/60">
                        {ep.inicio} → {ep.fim}
                      </p>

                      <ul className="mt-3 space-y-1.5">
                        {ep.eventoIds.map((id) => {
                          const ev = eventoPorId(id)
                          if (!ev) return null
                          return (
                            <li key={id} className="flex items-start gap-2 text-[0.85rem] leading-snug">
                              <span className="mt-[7px] size-1 shrink-0 rounded-full bg-foreground/25" />
                              <span className="text-muted-foreground">
                                {ev.texto} <Fonte fonte={ev.fonte} data={ev.data} />
                              </span>
                            </li>
                          )
                        })}
                      </ul>

                      {ep.colaboradores.length > 0 && (
                        <p className="mt-2.5 flex items-center gap-1.5 font-mono text-[0.7rem] text-muted-foreground/60">
                          <Users className="size-3" />
                          com {ep.colaboradores.map(nomeDe).join(', ')}
                        </p>
                      )}

                      {ep.estrela && (
                        <p className="prosa mt-3 border-l-2 border-comp/40 pl-3 text-[0.88rem] leading-snug">
                          <Star className="mr-1 inline size-3 fill-comp text-comp" />
                          {ep.estrela.nota}
                          <span className="block font-mono text-[0.7rem] text-muted-foreground/70">
                            {nomeDe(ep.estrela.por)} · {ep.estrela.em}
                          </span>
                        </p>
                      )}
                      {!ep.estrela && estrelas[ep.id] && (
                        <p className="mt-3 flex items-center gap-1.5 font-mono text-[0.7rem] text-comp">
                          <Star className="size-3 fill-comp" />
                          reconhecido agora
                        </p>
                      )}
                    </div>

                    {/* A estrela vive no episódio e só o gestor a dá. Onde estaria
                        a estrela negativa, existe conversa — decisão #7. */}
                    {souGestor && (
                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        <Button
                          size="sm"
                          variant={temEstrela ? 'secondary' : 'outline'}
                          disabled={Boolean(ep.estrela)}
                          onClick={() => setEstrelas((e) => ({ ...e, [ep.id]: !e[ep.id] }))}
                          className="h-7 gap-1.5 text-[0.75rem]"
                        >
                          <Star className={`size-3 ${temEstrela ? 'fill-comp text-comp' : ''}`} />
                          {temEstrela ? 'Reconhecido' : 'Reconhecer'}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            abrirCom(
                              `Rascunha uma conversa com ${primeiroNome(p.nome)} sobre o episódio "${ep.titulo}".`,
                            )
                          }
                          className="h-7 gap-1.5 text-[0.75rem] text-muted-foreground"
                        >
                          <MessageCircle className="size-3" />
                          Conversar sobre isso
                        </Button>
                      </div>
                    )}

                    {souEu && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 shrink-0 gap-1.5 text-[0.75rem] text-muted-foreground"
                      >
                        <Users className="size-3" />
                        Pedir feedback de um par
                      </Button>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {soltos.length > 0 && (
        <section className="mt-12">
          <div className="flex items-baseline justify-between pb-2.5">
            <p className="etiqueta">Eventos sem episódio</p>
            <p className="etiqueta">{soltos.length}</p>
          </div>
          <Separator />
          <ul className="mt-3 space-y-2">
            {soltos.map((ev) => (
              <li key={ev.id} className="flex items-start gap-2 text-[0.88rem] leading-snug">
                <span className="mt-[8px] size-1 shrink-0 rounded-full bg-foreground/25" />
                <span>
                  {ev.texto} <Fonte fonte={ev.fonte} data={ev.data} />
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {lacunas.length > 0 && (
        <section className="mt-12">
          <div className="flex items-baseline justify-between pb-2.5">
            <p className="etiqueta">O que ainda não sabemos</p>
            <p className="etiqueta">{lacunas.length}</p>
          </div>
          <Separator />
          <ul>
            {lacunas.map((l) => (
              <li key={l.id} className="border-b border-border/60 py-4">
                <p className="prosa text-[0.98rem] leading-snug">{l.pergunta}</p>
                <p className="mt-1.5 max-w-2xl text-[0.85rem] leading-snug text-muted-foreground">
                  {l.motivo}
                </p>
                <p className="mt-1.5 font-mono text-[0.7rem] text-muted-foreground/60">
                  perguntar a {nomeDe(l.perguntarA)} · valor {l.valor} · {l.status}
                </p>
                {l.resposta && (
                  <p className="prosa mt-2 border-l-2 border-comp/40 pl-3 text-[0.88rem] leading-snug">
                    {l.resposta.texto}
                    <span className="block font-mono text-[0.7rem] text-muted-foreground/70">
                      {nomeDe(l.resposta.por)} · {l.resposta.em}
                    </span>
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

function textoDoComportamento(id: string) {
  return regua.flatMap((r) => r.comportamentos).find((c) => c.id === id)?.texto ?? id
}

const primeiroNome = (n: string) => n.split(' ')[0]

function perguntaPadrao(nome: string, alvo: string | undefined, souEu: boolean) {
  if (souEu) return 'O que está registrado sobre mim neste semestre?'
  if (alvo) return `Onde ${primeiroNome(nome)} está em relação à régua de ${alvo}?`
  return `O que está registrado sobre ${primeiroNome(nome)} neste semestre?`
}
