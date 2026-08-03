import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import type { TipoDiretriz } from '@/data/diretrizes'

/**
 * As skills do Brain, lidas dos próprios arquivos em `agent/skills/`.
 *
 * NÃO existe um `data/skills.ts`, e a ausência é a decisão: uma lista escrita à
 * mão seria a mesma afirmação em dois lugares, com a da tela envelhecendo
 * sozinha na primeira vez que alguém editasse o procedimento. O que a página
 * mostra é o arquivo que o agente carrega — se divergirem, é porque o arquivo
 * mudou, e a tela muda junto.
 *
 * QUAL DIRETRIZ CADA SKILL LÊ também é derivado do corpo, não declarado: uma
 * skill "lê cultura" porque chama `ler_doutrina` de cultura no procedimento
 * dela. Declarar isso à mão seria voltar ao mesmo problema um nível abaixo.
 *
 * Roda só no servidor — `app/diretrizes/page.tsx` lê e passa como prop.
 */

export interface SkillDoBrain {
  id: string
  titulo: string
  /** O `description` do frontmatter: é o que faz o modelo escolher a skill. */
  quando: string
  /** Vazio é resultado legítimo: `diagnosticar-organizacao` não lê doutrina
   *  nenhuma, lê o registro agregado. A tela diz isso em vez de esconder. */
  le: TipoDiretriz[]
  /** O markdown inteiro, sem frontmatter e sem o `# título` — os dois já são
   *  cabeçalho da página. É o procedimento como o agente o recebe: a página não
   *  resume nem reescreve, porque um resumo aqui seria a terceira versão da
   *  mesma coisa e a única que ninguém executa. */
  corpo: string
}

/** Cada marca é o que aparece no procedimento quando a skill de fato abre
 *  aquele documento. `ler_regua` é tool própria; os outros três chegam por
 *  `ler_doutrina` com o id do documento. */
const MARCAS: Array<{ tipo: TipoDiretriz; marca: RegExp }> = [
  { tipo: 'regua', marca: /ler_regua/ },
  { tipo: 'cultura', marca: /cultura/ },
  { tipo: 'contexto', marca: /contexto-do-semestre/ },
  { tipo: 'politica', marca: /politica-de-decisao/ },
]

const DIR = join(process.cwd(), 'agent', 'skills')

function ler(nome: string): SkillDoBrain {
  const bruto = readFileSync(join(DIR, nome), 'utf8')
  const id = nome.replace(/\.md$/, '')
  return {
    id,
    titulo: bruto.match(/^#\s+(.+)$/m)?.[1] ?? id,
    quando: bruto.match(/^description:\s*(.+)$/m)?.[1]?.trim() ?? '',
    le: MARCAS.filter(({ marca }) => marca.test(bruto)).map(({ tipo }) => tipo),
    corpo: bruto
      .replace(/^---\n[\s\S]*?\n---\n/, '')
      .replace(/^#\s+.+\n/m, '')
      .trim(),
  }
}

export function skillsDoBrain(): SkillDoBrain[] {
  return readdirSync(DIR)
    .filter((n) => n.endsWith('.md'))
    .map(ler)
    .sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR'))
}

export function skillPorId(id: string): SkillDoBrain | undefined {
  /* Pela listagem, e não montando o caminho a partir do `id`: `id` vem da URL,
   * e concatenar entrada de rota com `join` é como se lê um arquivo fora da
   * pasta. Aqui só existe o que `readdirSync` devolveu. */
  return skillsDoBrain().find((s) => s.id === id)
}
