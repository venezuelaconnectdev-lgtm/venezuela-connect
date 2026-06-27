import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/shared/Navbar'
import { LangProvider } from '@/lib/i18n/LangContext'

export const metadata: Metadata = {
  title: 'Venezuela Connect | Información Humanitaria',
  description: 'Plataforma centralizada de información humanitaria verificada para Venezuela y la diáspora venezolana.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#F7F6F3" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <LangProvider>
          <Navbar />
          <main>{children}</main>
        </LangProvider>
      </body>
    </html>
  )
}
