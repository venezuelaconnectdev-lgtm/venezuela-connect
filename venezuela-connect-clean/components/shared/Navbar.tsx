'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const NAV_LINKS = [
  { href: '/',           label: '📊 Inicio'     },
  { href: '/refugios',   label: '🏠 Refugios'   },
  { href: '/hospitales', label: '🏥 Hospitales' },
  { href: '/noticias',   label: '📢 Noticias'   },
  { href: '/donaciones', label: '💰 Donar'      },
  { href: '/diaspora',   label: '🌎 Diáspora'   },
  { href: '/recursos',   label: '🔗 Recursos'   },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* ── TOP BAR ── */}
      <header style={{
        background: '#0F172A',
        borderBottom: '1px solid #1e293b',
        position: 'sticky', top: 0, zIndex: 100,
        height: 56,
        display: 'flex', alignItems: 'center',
        padding: '0 20px',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => setOpen(false)}>
          <span style={{ fontSize: 22 }}>🇻🇪</span>
          <span style={{ fontWeight: 800, fontSize: 17, color: '#F1F5F9', letterSpacing: '-0.02em' }}>
            Venezuela<span style={{ color: '#3b82f6' }}>Connect</span>
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Alert badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ position: 'relative', display: 'inline-flex', width: 10, height: 10 }}>
              <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#EA580C', opacity: 0.5, animation: 'ping 1.5s infinite' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#EA580C', display: 'block', position: 'relative' }} />
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#EA580C' }}>EMERGENCIA</span>
          </div>

          {/* Desktop nav links */}
          <nav style={{ display: 'none', gap: 2 }} className="desktop-nav">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} style={{
                padding: '5px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                textDecoration: 'none',
                color: pathname === l.href ? '#F1F5F9' : '#64748b',
                background: pathname === l.href ? '#1e293b' : 'transparent',
              }}>{l.label}</Link>
            ))}
          </nav>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Menú de navegación"
            style={{
              background: open ? '#1e293b' : 'transparent',
              border: '1px solid',
              borderColor: open ? '#334155' : 'transparent',
              borderRadius: 8,
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px 8px',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="hamburger"
          >
            <span style={{ width: 18, height: 2, background: open ? '#F1F5F9' : '#94a3b8', borderRadius: 2, display: 'block', transition: 'all 0.2s', transform: open ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
            <span style={{ width: 18, height: 2, background: open ? '#F1F5F9' : '#94a3b8', borderRadius: 2, display: 'block', transition: 'all 0.2s', opacity: open ? 0 : 1 }} />
            <span style={{ width: 18, height: 2, background: open ? '#F1F5F9' : '#94a3b8', borderRadius: 2, display: 'block', transition: 'all 0.2s', transform: open ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
          </button>
        </div>
      </header>

      {/* ── MOBILE DRAWER OVERLAY ── */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: '#000000aa',
            zIndex: 90,
          }}
        />
      )}

      {/* ── MOBILE DRAWER ── */}
      <div style={{
        position: 'fixed',
        top: 56, right: 0,
        width: 240,
        height: 'calc(100vh - 56px)',
        background: '#0F172A',
        borderLeft: '1px solid #1e293b',
        zIndex: 95,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.25s ease',
        overflowY: 'auto',
        paddingTop: 8,
      }}>
        {NAV_LINKS.map(l => (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '14px 20px',
              textDecoration: 'none',
              fontSize: 14, fontWeight: 600,
              color: pathname === l.href ? '#F1F5F9' : '#94a3b8',
              background: pathname === l.href ? '#1e293b' : 'transparent',
              borderLeft: pathname === l.href ? '3px solid #3b82f6' : '3px solid transparent',
              transition: 'background 0.15s',
            }}
          >
            {l.label}
          </Link>
        ))}

        <div style={{ margin: '16px 20px', borderTop: '1px solid #1e293b', paddingTop: 16 }}>
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Idioma</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[['ES','Español'],['EN','English'],['PT','Português']].map(([code, label]) => (
              <button
                key={code}
                style={{
                  background: code === 'ES' ? '#3b82f6' : '#1e293b',
                  color: code === 'ES' ? '#fff' : '#64748b',
                  border: '1px solid #334155',
                  borderRadius: 6, padding: '4px 8px',
                  fontSize: 11, fontWeight: 700, cursor: 'pointer',
                }}
                title={label}
              >{code}</button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .hamburger { display: none !important; }
          .desktop-nav { display: flex !important; }
        }
        @keyframes ping {
          0%, 100% { transform: scale(1); opacity: 0.75; }
          50% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </>
  )
}
