import { readFile } from 'node:fs/promises'
import path from 'node:path'

/**
 * Leitura dos documentos de doutrina — só no servidor.
 *
 * Os arquivos são markdown de verdade em /doutrina, não string em `.ts`: é o
 * formato em que a empresa escreveria, e mantém a promessa de que o conteúdo
 * é editável sem tocar em código.
 */
export async function lerDoutrina(arquivo: string): Promise<string> {
  const caminho = path.join(process.cwd(), 'doutrina', arquivo)
  return readFile(caminho, 'utf8')
}

export async function lerTodaDoutrina(
  arquivos: (string | undefined)[],
): Promise<Record<string, string>> {
  const nomes = arquivos.filter((a): a is string => Boolean(a))
  const conteudos = await Promise.all(nomes.map((n) => lerDoutrina(n)))
  return Object.fromEntries(nomes.map((n, i) => [n, conteudos[i]]))
}
