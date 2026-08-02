'use client'

/**
 * O palco: sidebar + conteúdo, encolhendo quando a conversa abre.
 *
 * O chat sobrepunha a página, e sobrepor quebra o gesto que ele existe para
 * servir — a pergunta nasce olhando o dossiê, e a resposta só é verificável
 * com o dossiê ainda à vista. Onde cabe (a partir de `lg`), o painel doca e o
 * conteúdo cede espaço; abaixo disso não há largura para dois, e ele volta a
 * ser sobreposição.
 */

import { useChat } from '@/lib/chat'

export function Palco({ children }: { children: React.ReactNode }) {
  const { aberto } = useChat()

  return (
    <div
      data-conversa={aberto ? 'aberta' : 'fechada'}
      className={`relative z-10 flex min-h-dvh transition-[padding] duration-300 ease-out ${
        aberto ? 'lg:pr-[30rem] xl:pr-[34rem]' : ''
      }`}
    >
      {children}
    </div>
  )
}
