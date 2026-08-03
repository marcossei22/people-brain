/**
 * Os componentes visuais do registro.
 *
 * SEM BIBLIOTECA DE GRÁFICO. Recharts (que vem no `@openuidev/react-ui`)
 * resolveria isto em menos linhas e traria junto um visual de dashboard —
 * eixo cinza, grade pontilhada, tooltip com sombra. Este produto é um registro
 * editorial, não um painel de BI, e a diferença aparece na primeira tomada.
 * São cinco formas simples; cinco formas simples cabem em CSS.
 *
 * A REGRA DE COR, que vale para o arquivo inteiro (`globals.css`):
 * **não existe semáforo aqui.** O vermelho da Comp é a única cor, e ela mede
 * UMA coisa: quanto da régua o registro sustenta. Mais vermelho = mais
 * coberto. Não há o par verde/vermelho, e a ausência dele não é decoração: o
 * verde-bom/vermelho-ruim transforma uma leitura de trabalho observável em
 * julgamento de pessoa, e a leitura é da régua, não da pessoa.
 *
 * O produto avalia skill contra o nível — isso é o trabalho dele. O que ele
 * não faz é ordenar gente e medir cultura, e é por isso que uma escala de um
 * tom só, sobre eixos nomeados pela régua, diz tudo o que precisa dizer.
 *
 * O arquivo é visual e continua sendo: quem sabe abrir um comportamento até a
 * fonte é `components/brain/comportamento.tsx`, e a `Cobertura` só o chama.
 */

import { AbrirComportamento, SetaDeAbertura } from '@/components/brain/comportamento'
import type { EpisodioId } from '@/data/tipos'
import type { Parcela } from '@/lib/metricas'

/** A caixa padrão de todo bloco renderizado. */
export function Caixa({ children }: { children: React.ReactNode }) {
  return <div className="my-3 rounded-sm border border-border bg-card px-4 py-3.5">{children}</div>
}

/**
 * Densidade de tinta por situação da régua.
 *
 * `sem-evidencia` é tracejado, não vazio: vazio lê como "acabou o gráfico",
 * tracejado lê como "aqui falta coisa" — que é exatamente o que ele quer
 * dizer. Um comportamento sem evidência é um comportamento que o registro não
 * alcançou, e a primeira resposta a ele é uma pergunta, não uma conclusão
 * (skill `comparar-com-regua`).
 */
const TINTA = {
  sustentado: { classe: 'bg-comp', rotulo: 'sustentado' },
  parcial: { classe: 'bg-comp/40', rotulo: 'parcial' },
  'sem-evidencia': {
    classe: 'border border-dashed border-comp/35 bg-comp/[0.07]',
    rotulo: 'sem evidência',
  },
} as const

type Situacao = keyof typeof TINTA

interface Medida {
  rotulo: string
  valor: number
  nota?: string
}

const maior = (ms: Medida[]) => Math.max(1, ...ms.map((m) => m.valor))
const somar = (ms: Medida[]) => ms.reduce((s, m) => s + m.valor, 0)

/* ─────────────────────────────────────────────────────────────────────────
   Indicadores — a linha de números do topo.
   ───────────────────────────────────────────────────────────────────────── */

export function Indicadores({
  itens,
  titulo,
}: {
  itens: { valor: string; rotulo: string; nota?: string }[]
  titulo?: string
}) {
  if (!itens?.length) return null
  return (
    <Caixa>
      {titulo && <p className="etiqueta pb-3">{titulo}</p>}
      <div className="flex flex-wrap gap-x-10 gap-y-4">
        {itens.slice(0, 4).map((i, k) => (
          <div key={k}>
            <p className="display text-[1.6rem] leading-none tracking-tight tabular-nums">
              {i.valor}
            </p>
            <p className="etiqueta mt-1.5">{i.rotulo}</p>
            {i.nota && (
              <p className="mt-1 max-w-[14rem] text-[0.75rem] leading-snug text-muted-foreground">
                {i.nota}
              </p>
            )}
          </div>
        ))}
      </div>
    </Caixa>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Barras — comparação entre pessoas ou categorias.
   ───────────────────────────────────────────────────────────────────────── */

export function Barras({
  titulo,
  series,
  unidade,
  destaque,
}: {
  titulo: string
  series: Medida[]
  unidade?: string
  destaque?: string
}) {
  if (!series?.length) return null
  const teto = maior(series)

  return (
    <Caixa>
      <div className="flex items-baseline justify-between gap-4 pb-3">
        <p className="etiqueta">{titulo}</p>
        {unidade && <p className="etiqueta">{unidade}</p>}
      </div>

      <ul className="space-y-2.5">
        {series.map((s, i) => {
          const marcada = destaque !== undefined && s.rotulo === destaque
          return (
            <li key={i} className="grid grid-cols-[8.5rem_1fr_2.5rem] items-center gap-3">
              <span
                className={`truncate text-[0.82rem] leading-snug ${
                  marcada ? 'text-foreground' : 'text-muted-foreground'
                }`}
                title={s.rotulo}
              >
                {s.rotulo}
              </span>

              {/* O trilho existe para a barra curta não parecer erro de render:
                  sem ele, "zero episódios" some e lê como dado faltando. */}
              <span className="relative block h-[0.6rem] bg-comp/[0.08]">
                <span
                  className={`absolute inset-y-0 left-0 ${marcada ? 'bg-comp' : 'bg-comp/45'}`}
                  style={{ width: `${Math.max(s.valor > 0 ? 2 : 0, (s.valor / teto) * 100)}%` }}
                />
              </span>

              <span
                className={`text-right font-mono text-[0.72rem] tabular-nums ${
                  marcada ? 'text-comp' : 'text-muted-foreground'
                }`}
              >
                {s.valor}
              </span>

              {s.nota && (
                <span className="col-span-3 -mt-1 text-[0.73rem] leading-snug text-muted-foreground/75">
                  {s.nota}
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </Caixa>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Série — evidência ao longo do tempo.
   ───────────────────────────────────────────────────────────────────────── */

/**
 * O mês vazio é o ponto do componente.
 *
 * Um gráfico que pula os meses sem evidência conta uma história contínua que
 * não aconteceu. O buraco de junho do Bruno é a informação — some se a coluna
 * não for desenhada. Por isso valor 0 vira um traço na linha de base, e não
 * ausência de coluna.
 */
export function Serie({
  titulo,
  pontos,
  nota,
}: {
  titulo: string
  pontos: Medida[]
  nota?: string
}) {
  if (!pontos?.length) return null

  /**
   * Piso no teto da escala: um registro ralo precisa PARECER ralo.
   *
   * Normalizado só pelo próprio máximo, o Bruno — um evento por mês, cinco no
   * semestre — desenhava seis colunas cheias, idênticas às da Carla, que tem
   * catorze. Cada gráfico estava certo sozinho e os dois juntos mentiam. Com
   * o piso, a altura da coluna quer dizer a mesma coisa nas duas telas.
   */
  const teto = Math.max(4, maior(pontos))

  return (
    <Caixa>
      <p className="etiqueta pb-4">{titulo}</p>

      <div className="flex h-20 items-end gap-1.5">
        {pontos.map((p, i) => (
          <div key={i} className="group flex h-full flex-1 flex-col justify-end" title={p.nota}>
            {p.valor > 0 ? (
              <div
                className="w-full bg-comp/85"
                style={{ height: `${Math.max(6, (p.valor / teto) * 100)}%` }}
              />
            ) : (
              <div className="h-[2px] w-full bg-comp/25" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-1.5 flex gap-1.5 border-t border-border pt-1.5">
        {pontos.map((p, i) => (
          <div key={i} className="flex-1 text-center">
            <p className="font-mono text-[0.62rem] leading-none text-muted-foreground/70">
              {p.rotulo}
            </p>
            <p
              className={`mt-1 font-mono text-[0.66rem] leading-none tabular-nums ${
                p.valor > 0 ? 'text-muted-foreground' : 'text-foreground/25'
              }`}
            >
              {p.valor}
            </p>
          </div>
        ))}
      </div>

      {nota && (
        <p className="mt-3 text-[0.78rem] leading-snug text-muted-foreground">{nota}</p>
      )}
    </Caixa>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Distribuição — a composição de um todo.
   ───────────────────────────────────────────────────────────────────────── */

/** Da fatia mais cheia à mais rala. Cinco níveis bastam: a sexta fatia é ruído. */
const FATIAS = ['bg-comp', 'bg-comp/68', 'bg-comp/46', 'bg-comp/30', 'bg-comp/18']

export function Distribuicao({
  titulo,
  partes,
  nota,
}: {
  titulo: string
  partes: Medida[]
  nota?: string
}) {
  if (!partes?.length) return null
  const total = somar(partes)
  if (total <= 0) return null

  return (
    <Caixa>
      <p className="etiqueta pb-3">{titulo}</p>

      <div className="flex h-[0.7rem] w-full overflow-hidden">
        {partes.map((p, i) => (
          <div
            key={i}
            className={`${FATIAS[Math.min(i, FATIAS.length - 1)]} border-r border-card last:border-r-0`}
            style={{ width: `${(p.valor / total) * 100}%` }}
            title={`${p.rotulo}: ${p.valor}`}
          />
        ))}
      </div>

      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        {partes.map((p, i) => (
          /* A fatia com nota toma a linha inteira. Espremida junto das outras
             numa coluna estreita — o painel de conversa —, a nota empurrava o
             rótulo para baixo e deixava o quadradinho de cor órfão. */
          <li key={i} className={`flex items-baseline gap-1.5 ${p.nota ? 'w-full' : ''}`}>
            {/* `self-start` e não `self-center`: numa fatia de duas linhas, o
                centro vertical joga o quadradinho para o meio do parágrafo e
                ele lê como órfão. O lugar dele é ao lado da primeira linha. */}
            <span
              className={`mt-[0.3rem] size-2 shrink-0 self-start ${FATIAS[Math.min(i, FATIAS.length - 1)]}`}
            />
            <span className="text-[0.8rem] leading-snug">{p.rotulo}</span>
            <span className="font-mono text-[0.7rem] tabular-nums text-muted-foreground">
              {p.valor}
            </span>
            {p.nota && (
              <span className="text-[0.73rem] leading-snug text-muted-foreground/75">{p.nota}</span>
            )}
          </li>
        ))}
      </ul>

      {nota && <p className="mt-3 text-[0.78rem] leading-snug text-muted-foreground">{nota}</p>}
    </Caixa>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Cobertura — a régua contra o registro.
   ───────────────────────────────────────────────────────────────────────── */

/**
 * A teia — a régua de um nível como forma.
 *
 * Cada ponta é um comportamento. O anel externo tracejado é **o que o nível
 * pede**; o polígono preenchido é **onde o registro está**. É a mesma
 * informação da tira, na forma em que a distância entre as duas coisas vira
 * área — e área é o que se lê sem contar.
 *
 * Os três raios são os três estados da régua, não uma escala contínua. Não
 * existe 7,5 de influência aqui: existe "dois episódios sustentam", "um só" e
 * "nenhum". Inventar granularidade que o registro não tem seria fabricar
 * precisão, que é o defeito clássico do radar de competências.
 */
const ESCALA = 5

/** Sem evidência não colapsa no centro: um ponto único lê como gráfico
 *  quebrado, e o que se quer dizer é "aqui não chegou nada". */
const RAIO_VAZIO = 0.08

interface EixoTeia {
  rotulo: string
  /** Onde a pessoa está, 1–5. Ausente = sem evidência, que não é zero. */
  nivel?: number
  /** Onde o nível pede que ela esteja, 1–5. */
  esperado: number
}

export function Teia({ eixos }: { eixos: EixoTeia[] }) {
  if (eixos.length < 3) return null

  /* A figura é pequena e a margem é grande, de propósito: o que estoura o
     viewBox não é a teia, é o rótulo. "MULTIPLICADOR", da trilha de vendas,
     ocupa mais largura que o raio inteiro — dimensionado pela teia, ele sairia
     cortado pela borda. Então o desenho fica no meio e as sobras existem para
     as palavras. */
  const R = 56
  const CX = 170
  const CY = 100

  const ponto = (i: number, escala: number) => {
    const ang = -Math.PI / 2 + (i * 2 * Math.PI) / eixos.length
    return [CX + Math.cos(ang) * R * escala, CY + Math.sin(ang) * R * escala] as const
  }

  const poligono = (escalas: number[]) =>
    escalas.map((e, i) => ponto(i, e).join(',')).join(' ')

  const anel = (escala: number) => poligono(eixos.map(() => escala))
  const raioDe = (e: EixoTeia) => (e.nivel === undefined ? RAIO_VAZIO : e.nivel / ESCALA)

  // O tracejado NÃO é um anel: cada skill pede um número diferente, e é a
  // diferença entre as duas formas que responde "o que falta". Um contorno
  // circular esconderia justamente que a régua não é uniforme.
  const pedido = poligono(eixos.map((e) => e.esperado / ESCALA))
  const forma = poligono(eixos.map(raioDe))

  return (
    <figure className="my-1">
      {/* Teto de largura, e não `w-full`.
          Dentro de um viewBox, tudo escala junto com o elemento — inclusive o
          tamanho da fonte. Solta na largura do dossiê, a teia virava um
          pôster com rótulos de 35px. Travada em 20rem ela tem o mesmo tamanho
          no dossiê largo e no painel de conversa estreito, que é o que faz as
          duas telas parecerem o mesmo produto. */}
      <svg
        viewBox="0 0 340 200"
        className="mx-auto block w-full max-w-[22rem]"
        role="img"
        aria-label="Régua contra o registro"
      >
        {/* Malha: os raios e o anel de "parcial", bem apagados. Estão ali para
            a leitura ser posicional, não para serem vistos. */}
        {eixos.map((_, i) => {
          const [x, y] = ponto(i, 1)
          return (
            <line
              key={`r${i}`}
              x1={CX}
              y1={CY}
              x2={x}
              y2={y}
              className="stroke-comp/15"
              strokeWidth={1}
            />
          )
        })}
        {[0.4, 0.8].map((e) => (
          <polygon key={e} points={anel(e)} className="fill-none stroke-comp/12" strokeWidth={1} />
        ))}
        <polygon points={anel(1)} className="fill-none stroke-comp/15" strokeWidth={1} />

        {/* O que o nível pede. Tracejado porque é expectativa, não fato. */}
        <polygon
          points={pedido}
          className="fill-none stroke-comp/55"
          strokeWidth={1.25}
          strokeDasharray="3 3"
        />

        {/* Onde o registro está. */}
        <polygon
          points={forma}
          className="fill-comp/25 stroke-comp"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />

        {/* Ponta cheia = tem nota. Ponta vazada = o registro não alcançou.
            Sem essa diferença, o vértice colado no centro seria lido como
            "nota zero", que é a afirmação que este produto não faz. */}
        {eixos.map((e, i) => {
          const [x, y] = ponto(i, raioDe(e))
          return e.nivel === undefined ? (
            <circle
              key={`p${i}`}
              cx={x}
              cy={y}
              r={2.6}
              className="fill-card stroke-comp/70"
              strokeWidth={1.2}
            />
          ) : (
            <circle key={`p${i}`} cx={x} cy={y} r={2.4} className="fill-comp" />
          )
        })}

        {/* Rótulos. `text-anchor` sai do lado do eixo: à direita do centro o
            texto começa na ponta, à esquerda ele termina nela. Sem isso os
            rótulos de leste e oeste entram por cima da figura. */}
        {eixos.map((e, i) => {
          const ang = -Math.PI / 2 + (i * 2 * Math.PI) / eixos.length
          const cos = Math.cos(ang)
          const [x, y] = ponto(i, 1)
          return (
            <text
              key={`t${i}`}
              x={x + cos * 9}
              y={y + Math.sin(ang) * 9 + 3}
              textAnchor={cos > 0.25 ? 'start' : cos < -0.25 ? 'end' : 'middle'}
              className="etiqueta"
              fill="currentColor"
              /* O tracking largo da `etiqueta` é desenhado para rótulo solto
                 numa linha; em oito rótulos ao redor de uma figura pequena ele
                 vira largura que não existe. Apertado só aqui. */
              style={{ fontSize: '0.6rem', letterSpacing: '0.05em' }}
            >
              {e.rotulo}
            </text>
          )
        })}
      </svg>

      <figcaption className="mt-1 flex flex-wrap justify-center gap-x-4 gap-y-1">
        <span className="flex items-center gap-1.5 text-[0.72rem] text-muted-foreground">
          <span className="h-0 w-4 border-t border-dashed border-comp/60" />
          o que o nível pede
        </span>
        <span className="flex items-center gap-1.5 text-[0.72rem] text-muted-foreground">
          <span className="h-2 w-4 border border-comp bg-comp/25" />
          onde o registro está
        </span>
        {eixos.some((e) => e.nivel === undefined) && (
          <span className="flex items-center gap-1.5 text-[0.72rem] text-muted-foreground">
            <span className="size-2 rounded-full border border-comp/70 bg-card" />
            sem evidência
          </span>
        )}
      </figcaption>
    </figure>
  )
}

/** A tira do topo: a régua inteira em uma linha, antes do detalhe. */
export function TiraDeCobertura({ itens }: { itens: { situacao: Situacao }[] }) {
  if (!itens?.length) return null
  return (
    <div className="flex h-[0.55rem] gap-[3px]">
      {itens.map((i, k) => (
        <span key={k} className={`flex-1 ${TINTA[i.situacao]?.classe ?? TINTA.parcial.classe}`} />
      ))}
    </div>
  )
}

/**
 * Uma linha da régua. Os quatro primeiros campos desenham; os quatro últimos
 * fazem a linha ABRIR.
 *
 * Eles são opcionais porque este componente tem dois autores: o dossiê passa o
 * que `comportamentosCobertos()` devolveu, com parcelas e episódios, e o agente
 * o preenche a partir do que leu numa tool, onde só os quatro primeiros existem.
 * Sem os campos de abertura a linha continua sendo a mesma linha — só não leva
 * a lugar nenhum, que era o estado anterior das duas.
 */
interface ItemDeCobertura {
  rotulo?: string
  texto: string
  situacao: Situacao
  nivel?: number
  esperado?: number
  observavel?: string
  episodioIds?: EpisodioId[]
  parcelas?: Parcela[]
  soma?: number
}

export function Cobertura({
  titulo,
  itens,
  nota,
}: {
  titulo: string
  itens: ItemDeCobertura[]
  nota?: string
}) {
  if (!itens?.length) return null

  const contagem = (s: Situacao) => itens.filter((i) => i.situacao === s).length

  /**
   * Teia quando dá, tira quando não dá.
   *
   * A teia precisa de pelo menos três pontas e de um nome curto em cada uma.
   * Sem `rotulo` — uma régua de cliente que não preencheu o campo, ou uma
   * resposta sobre um comportamento só — a tira continua contando a mesma
   * história em uma linha. O card nunca fica sem a leitura de conjunto.
   */
  const eixos = itens.every((i) => i.rotulo && i.esperado)
    ? itens.map((i) => ({
        rotulo: i.rotulo as string,
        nivel: i.nivel,
        esperado: i.esperado as number,
      }))
    : undefined

  return (
    <Caixa>
      <div className="flex items-baseline justify-between gap-4 pb-3">
        <p className="etiqueta">{titulo}</p>
        <p className="font-mono text-[0.68rem] tabular-nums text-comp">
          {contagem('sustentado')}/{itens.length}
        </p>
      </div>

      {eixos && eixos.length >= 3 ? (
        <Teia eixos={eixos} />
      ) : (
        <TiraDeCobertura itens={itens} />
      )}

      <ul className="mt-4 space-y-2.5">
        {itens.map((i, k) => (
          <li key={k}>
            <LinhaDaRegua item={i} />
          </li>
        ))}
      </ul>

      {/* "Sem evidência não é o mesmo que não faz" é regra da skill. Dito uma
          vez aqui, ela para de depender do modelo repetir em toda resposta. */}
      <p className="mt-3.5 border-t border-border pt-2.5 text-[0.76rem] leading-snug text-muted-foreground">
        {nota ?? 'Sem evidência não quer dizer que não faz — quer dizer que o registro não alcançou.'}
      </p>
    </Caixa>
  )
}

/**
 * O comportamento e a nota dele, na tira — e o clique que leva à evidência.
 *
 * A tira era a única afirmação do dossiê que não abria, e era a mais importante
 * da tela para quem está sendo avaliado: "parcial, 2 · pede 4" sem caminho até
 * os episódios é exatamente o número sem fonte que este produto existe para não
 * produzir.
 *
 * A linha SEM evidência abre também, e é o caso que mais precisa abrir: o que
 * ela mostra é o observável que a régua pede e a razão de a ausência estar fora
 * da escala. Deixá-la morta seria oferecer "sem evidência" como veredito final.
 */
function LinhaDaRegua({ item }: { item: ItemDeCobertura }) {
  const conteudo = (
    <div className="flex items-start justify-between gap-4">
      <span className="min-w-0 text-[0.85rem] leading-snug">
        {item.rotulo && (
          <span className="mr-1.5 font-mono text-[0.68rem] uppercase tracking-wider text-comp">
            {item.rotulo}
          </span>
        )}
        {item.texto}
      </span>

      {/* A nota ao lado do que o nível pede, sempre as duas. Um "4" sozinho não
          quer dizer nada; "4 · pede 3" é a frase inteira. */}
      <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap font-mono text-[0.72rem] tabular-nums">
        {item.nivel === undefined ? (
          <span className="text-foreground/40">sem evidência</span>
        ) : (
          <span>
            <span className={item.situacao === 'sustentado' ? 'text-comp' : 'text-foreground'}>
              {item.nivel}
            </span>
            {item.esperado !== undefined && (
              <span className="text-muted-foreground/70"> · pede {item.esperado}</span>
            )}
          </span>
        )}
        {abrivel(item) && <SetaDeAbertura />}
      </span>
    </div>
  )

  if (!abrivel(item)) return conteudo

  return (
    <AbrirComportamento
      className="-mx-1.5 block w-[calc(100%+0.75rem)] rounded-sm px-1.5 py-0.5 transition-colors hover:bg-foreground/[0.04]"
      comportamento={{
        rotulo: item.rotulo ?? item.texto,
        texto: item.texto,
        observavel: item.observavel!,
        esperado: item.esperado!,
        nivel: item.nivel,
        parcelas: item.parcelas,
        soma: item.soma,
        episodioIds: item.episodioIds ?? [],
      }}
    >
      {conteudo}
    </AbrirComportamento>
  )
}

/** Abre quem sabe dizer o que o nível pede: é o observável que transforma a
 *  linha sem evidência em pergunta em vez de veredito. */
const abrivel = (i: ItemDeCobertura) => Boolean(i.observavel) && i.esperado !== undefined
