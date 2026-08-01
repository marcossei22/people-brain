import type { Metadata } from 'next'
import { Fraunces, IBM_Plex_Mono, Instrument_Sans, Newsreader } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/shell/sidebar'
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
      <body className="min-h-full">
        <ProvedorViewer>
          <div className="relative z-10 flex min-h-dvh">
            <Sidebar />
            <main className="min-w-0 flex-1">{children}</main>
          </div>
        </ProvedorViewer>
      </body>
    </html>
  )
}
