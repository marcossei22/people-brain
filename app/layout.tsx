import type { Metadata } from 'next'
import { Fraunces, IBM_Plex_Mono, Instrument_Sans, Newsreader } from 'next/font/google'
import './globals.css'
import { Palco } from '@/components/shell/palco'
import { Sidebar } from '@/components/shell/sidebar'
import { PainelChat } from '@/components/chat/painel-chat'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ProvedorChat } from '@/lib/chat'
import { ProvedorRegistro } from '@/lib/registro'
import { ProvedorViewer } from '@/lib/viewer'

/* Quatro famílias, cada uma com um trabalho:
   display  — o wordmark e os títulos. É o que dá voz editorial ao produto.
   prosa    — o registro em si: resumos, evidência, o que se LÊ.
   ui       — navegação, botões, rótulos. Precisa ser nítido em vídeo.
   mono     — ids, fontes, tool calls. Onde o sistema mostra o mecanismo. */
const display = Fraunces({
  variable: '--font-display',
  subsets: ['latin'],
  axes: ['SOFT', 'WONK', 'opsz'],
})
const prosa = Newsreader({ variable: '--font-prosa-serif', subsets: ['latin'] })
const ui = Instrument_Sans({ variable: '--font-ui', subsets: ['latin'] })
const mono = IBM_Plex_Mono({
  variable: '--font-mono-plex',
  subsets: ['latin'],
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'People Brain',
  description: 'O Brain lembra. As pessoas decidem.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${prosa.variable} ${ui.variable} ${mono.variable} h-full antialiased`}
    >
      {/* `suppressHydrationWarning` por causa de extensão de navegador, não de
          bug nosso: Grammarly, ColorZilla e afins escrevem `data-*` no <body>
          antes de o React hidratar, e o diff de atributos acende o indicador
          de erro do dev — inclusive na gravação. A supressão vale SÓ para os
          atributos deste elemento; mismatch real em qualquer filho continua
          estourando como sempre. Num navegador limpo o app hidrata sem aviso
          nenhum (verificado em /org, /ciclo/[id] e /meu-ciclo). */}
      <body className="min-h-full" suppressHydrationWarning>
        {/* O registro vai DENTRO do viewer: toda escrita da sessão tem autor, e
            o autor é quem está olhando. Fora daqui, cada ação teria que receber
            de quem partiu — nove chances de a tela errar o que o contexto já
            sabe. E é o `geracao` do viewer que zera a sessão no "Recomeçar". */}
        <ProvedorViewer>
          <ProvedorRegistro>
            <ProvedorChat>
              <TooltipProvider delayDuration={200}>
                <Palco>
                  <Sidebar />
                  <main className="min-w-0 flex-1">{children}</main>
                </Palco>
                <PainelChat />
              </TooltipProvider>
            </ProvedorChat>
          </ProvedorRegistro>
        </ProvedorViewer>
      </body>
    </html>
  )
}
