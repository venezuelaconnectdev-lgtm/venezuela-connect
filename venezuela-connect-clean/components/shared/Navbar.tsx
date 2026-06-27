'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useLang } from '@/lib/i18n/LangContext'
import type { Lang } from '@/lib/i18n'

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { t, lang, setLang } = useLang()

  const NAV_LINKS = [
    { href: '/',           label: t.nav.home      },
    { href: '/refugios',   label: t.nav.shelters  },
    { href: '/hospitales', label: t.nav.hospitals },
    { href: '/noticias',   label: t.nav.news      },
    { href: '/donaciones', label: t.nav.donate    },
    { href: '/diaspora',   label: t.nav.diaspora  },
    { href: '/recursos',   label: t.nav.resources },
  ]

  const LANGS: { code: Lang; flag: string }[] = [
    { code: 'es', flag: '🇻🇪' },
    { code: 'en', flag: '🇺🇸' },
    { code: 'pt', flag: '🇧🇷' },
  ]

  return (
    <>
      <header style={{
        background: '#fff',
        borderBottom: '1px solid #E2DDD8',
        position: 'sticky', top: 0, zIndex: 100,
        height: 56,
        display: 'flex', alignItems: 'center',
        padding: '0 20px',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => setOpen(false)}>
          <span style={{ fontSize: 22 }}>🇻🇪</span>
          <span style={{ fontWeight: 800, fontSize: 16, color: '#1A1714', letterSpacing: '-0.02em' }}>
            Venezuela<span style={{ color: '#1B3A6B' }}>Connect</span>
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Alert pulse — desktop */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ position: 'relative', display: 'inline-flex', width: 10, height: 10 }}>
              <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#B91C1C', opacity: 0.4, animation: 'ping 1.5s infinite' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#B91C1C', display: 'block', position: 'relative' }} />
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#B91C1C' }}>EMERGENCIA</span>
          </div>

          {/* Desktop nav */}
          <nav className="desktop-nav" style={{ display: 'none', gap: 2, alignItems: 'center' }}>
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} style={{
                padding: '5px 10px', borderRadius: 6, fontSize: 13, fontWeight: 600,
                textDecoration: 'none',
                color: pathname === l.href ? '#1B3A6B' : '#5C5650',
                background: pathname === l.href ? '#EBF0F8' : 'transparent',
                borderBottom: pathname === l.href ? '2px solid #1B3A6B' : '2px solid transparent',
              }}>{l.label}</Link>
            ))}
            {/* Lang switcher desktop */}
            <div style={{ display: 'flex', gap: 4, marginLeft: 8, borderLeft: '1px solid #E2DDD8', paddingLeft: 12 }}>
              {LANGS.map(({ code, flag }) => (
                <button key={code} onClick={() => setLang(code)} title={t.lang[code]} style={{
                  background: lang === code ? '#EBF0F8' : 'transparent',
                  border: `1px solid ${lang === code ? '#1B3A6B' : 'transparent'}`,
                  borderRadius: 6, padding: '3px 7px',
                  fontSize: 12, fontWeight: 700,
                  color: lang === code ? '#1B3A6B' : '#9A9490',
                  cursor: 'pointer',
                }}>{flag} {code.toUpperCase()}</button>
              ))}
            </div>
          </nav>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Menú de navegación"
            className="hamburger"
            style={{
              background: open ? '#EBF0F8' : 'transparent',
              border: `1px solid ${open ? '#1B3A6B' : 'transparent'}`,
              borderRadius: 8, color: '#5C5650',
              cursor: 'pointer', padding: '6px 8px',
              display: 'flex', flexDirection: 'column',
              gap: 4, alignItems: 'center', justifyContent: 'center',
            }}
          >
            <span style={{ width: 18, height: 2, background: open ? '#1B3A6B' : '#5C5650', borderRadius: 2, display: 'block', transition: 'all 0.2s', transform: open ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
            <span style={{ width: 18, height: 2, background: open ? '#1B3A6B' : '#5C5650', borderRadius: 2, display: 'block', transition: 'all 0.2s', opacity: open ? 0 : 1 }} />
            <span style={{ width: 18, height: 2, background: open ? '#1B3A6B' : '#5C5650', borderRadius: 2, display: 'block', transition: 'all 0.2s', transform: open ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
          </button>
        </div>
      </header>

      {/* Overlay */}
      {open && (
        <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: '#00000033', zIndex: 90 }} />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 56, right: 0,
        width: 260, height: 'calc(100vh - 56px)',
        background: '#fff',
        borderLeft: '1px solid #E2DDD8',
        zIndex: 95,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.25s ease',
        overflowY: 'auto',
        paddingTop: 8,
        boxShadow: '-4px 0 20px rgba(0,0,0,0.08)',
      }}>
        {NAV_LINKS.map(l => (
          <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
            display: 'flex', alignItems: 'center',
            padding: '13px 20px',
            textDecoration: 'none',
            fontSize: 14, fontWeight: 600,
            color: pathname === l.href ? '#1B3A6B' : '#5C5650',
            background: pathname === l.href ? '#EBF0F8' : 'transparent',
            borderLeft: `3px solid ${pathname === l.href ? '#1B3A6B' : 'transparent'}`,
          }}>
            {l.label}
          </Link>
        ))}

        {/* Lang switcher en drawer */}
        <div style={{ margin: '16px 20px', paddingTop: 16, borderTop: '1px solid #E2DDD8' }}>
          <div style={{ fontSize: 11, color: '#9A9490', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
            Idioma / Language
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {LANGS.map(({ code, flag }) => (
              <button key={code} onClick={() => { setLang(code); setOpen(false) }} style={{
                background: lang === code ? '#1B3A6B' : '#F7F6F3',
                color: lang === code ? '#fff' : '#5C5650',
                border: `1px solid ${lang === code ? '#1B3A6B' : '#E2DDD8'}`,
                borderRadius: 8, padding: '7px 12px',
                fontSize: 12, fontWeight: 700, cursor: 'pointer',
                flex: 1,
              }}>{flag} {code.toUpperCase()}</button>
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
