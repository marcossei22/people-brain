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
 */

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

export function Cobertura({
  titulo,
  itens,
  nota,
}: {
  titulo: string
  itens: { texto: string; situacao: Situacao }[]
  nota?: string
}) {
  if (!itens?.length) return null

  const contagem = (s: Situacao) => itens.filter((i) => i.situacao === s).length

  return (
    <Caixa>
      <div className="flex items-baseline justify-between gap-4 pb-3">
        <p className="etiqueta">{titulo}</p>
        <p className="font-mono text-[0.68rem] tabular-nums text-comp">
          {contagem('sustentado')}/{itens.length}
        </p>
      </div>

      <TiraDeCobertura itens={itens} />

      <ul className="mt-4 space-y-2">
        {itens.map((i, k) => (
          <li key={k} className="flex items-start gap-2.5">
            <span
              className={`mt-[6px] h-[0.5rem] w-4 shrink-0 ${
                TINTA[i.situacao]?.classe ?? TINTA.parcial.classe
              }`}
            />
            <span className="text-[0.85rem] leading-snug">
              {i.texto}
              <span className="ml-1.5 font-mono text-[0.66rem] text-foreground/40">
                {TINTA[i.situacao]?.rotulo ?? i.situacao}
              </span>
            </span>
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
