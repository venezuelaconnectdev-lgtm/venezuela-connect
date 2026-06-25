import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/shared/Navbar'

export const metadata: Metadata = {
  title: 'Venezuela Connect | Información Humanitaria',
  description: 'Plataforma centralizada de información humanitaria verificada para Venezuela.',
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
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
