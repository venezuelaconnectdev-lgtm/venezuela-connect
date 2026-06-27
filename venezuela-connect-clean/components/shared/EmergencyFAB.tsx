'use client'
import { useState } from 'react'
import { EMERGENCY_NUMBERS } from '@/lib/constants'
import { useLang } from '@/lib/i18n/LangContext'

export default function EmergencyFAB() {
  const [open, setOpen] = useState(false)
  const { t } = useLang()
  const steps = t.emergency.steps

  return (
    <>
      <button
        aria-label={t.emergency.title}
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed', bottom: 24, right: 20,
          background: '#B91C1C', color: '#fff', border: 'none',
          borderRadius: '50%', width: 56, height: 56,
          fontSize: 22, cursor: 'pointer', zIndex: 200,
          boxShadow: '0 4px 16px rgba(185,28,28,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >⚠️</button>

      {open && (
        <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: '#00000055', zIndex: 300, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '16px 16px 0 0', padding: 24, width: '100%', maxWidth: 500, boxShadow: '0 -4px 30px rgba(0,0,0,0.15)' }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: '#1A1714', marginBottom: 4 }}>⚠️ {t.emergency.title}</div>
            <div style={{ fontSize: 12, color: '#9A9490', marginBottom: 20 }}>{t.emergency.subtitle}</div>

            {steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
                <div style={{ background: '#EBF0F8', color: '#1B3A6B', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{i + 1}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#1A1714' }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: '#5C5650', marginTop: 2, lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              </div>
            ))}

            <div style={{ borderTop: '1px solid #E2DDD8', paddingTop: 14, marginTop: 4 }}>
              <div style={{ fontSize: 11, color: '#9A9490', fontWeight: 700, marginBottom: 8, letterSpacing: '0.06em' }}>{t.emergency.numbers}</div>
              {EMERGENCY_NUMBERS.map(e => (
                <a key={e.number} href={`tel:${e.number}`} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', textDecoration: 'none', borderBottom: '1px solid #F7F6F3' }}>
                  <span style={{ fontSize: 12, color: '#5C5650' }}>{e.label}</span>
                  <span style={{ fontSize: 12, color: '#1B3A6B', fontWeight: 700 }}>{e.number}</span>
                </a>
              ))}
            </div>

            <button onClick={() => setOpen(false)} className="btn-primary" style={{ width: '100%', marginTop: 16, justifyContent: 'center' }}>
              {t.emergency.understood}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
