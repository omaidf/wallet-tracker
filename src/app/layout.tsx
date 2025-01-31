import { DM_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
// import './init' // This will run the initialization on server start

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

// Only import and initialize during runtime
if (process.env.NODE_ENV !== 'production' || process.env.NEXT_PHASE !== 'build') {
  import('./init')
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} font-dm-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
