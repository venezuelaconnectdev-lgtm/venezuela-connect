'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { href: '/',           label: '📊 Inicio'    },
  { href: '/refugios',   label: '🏠 Refugios'  },
  { href: '/hospitales', label: '🏥 Hospitales'},
  { href: '/noticias',   label: '📢 Noticias'  },
  { href: '/donaciones', label: '💰 Donar'     },
  { href: '/diaspora',   label: '🌎 Diáspora'  },
  { href: '/recursos',   label: '🔗 Recursos'  },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header style={{ background: '#0F172A', borderBottom: '1px solid #1e293b', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22 }}>🇻🇪</span>
          <span style={{ fontWeight: 800, fontSize: 17, color: '#F1F5F9', letterSpacing: '-0.02em' }}>
            Venezuela<span style={{ color: '#3b82f6' }}>Connect</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', gap: 4 }} className="hidden md:flex">
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} style={{
              padding: '6px 10px', borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: 'none',
              color: pathname === l.href ? '#F1F5F9' : '#64748b',
              background: pathname === l.href ? '#1e293b' : 'transparent',
            }}>{l.label}</Link>
          ))}
        </nav>

        {/* Alert badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ position: 'relative', display: 'inline-flex', width: 10, height: 10 }}>
            <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#EA580C', opacity: 0.5, animation: 'ping 1.5s infinite' }} />
            <span style={{ position: 'relative', width: 10, height: 10, borderRadius: '50%', background: '#EA580C', display: 'block' }} />
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#EA580C' }}>EMERGENCIA</span>

          {/* Hamburger */}
          <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginLeft: 8, display: 'flex' }} className="md:hidden">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: '#1e293b', borderTop: '1px solid #334155', padding: '8px 0' }} className="md:hidden">
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
              display: 'block', padding: '12px 24px', fontSize: 14, fontWeight: 600, textDecoration: 'none',
              color: pathname === l.href ? '#F1F5F9' : '#94a3b8',
              background: pathname === l.href ? '#0F172A' : 'transparent',
            }}>{l.label}</Link>
          ))}
        </div>
      )}
    </header>
  )
}
