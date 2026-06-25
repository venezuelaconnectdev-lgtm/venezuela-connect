import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/shared/Navbar'

export const metadata: Metadata = {
  title: 'Venezuela Connect | Información Humanitaria',
  description: 'Plataforma centralizada de información humanitaria verificada para Venezuela y la diáspora venezolana.',
  keywords: 'venezuela, emergencia, refugios, hospitales, diáspora, humanitaria',
  openGraph: {
    title: 'Venezuela Connect',
    description: 'Información humanitaria verificada para Venezuela',
    type: 'website',
    locale: 'es_VE',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0F172A" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded">
          Ir al contenido principal
        </a>
        <Navbar />
        <main id="main">{children}</main>
      </body>
    </html>
  )
}
