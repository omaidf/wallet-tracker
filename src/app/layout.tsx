import { DM_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import './init'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} font-dm-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
