'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useLang } from '@/lib/i18n/LangContext'
import { translations } from '@/lib/i18n'
import Link from 'next/link'
import EmergencyFAB from '@/components/shared/EmergencyFAB'
import QuickAccessCards from '@/components/shared/QuickAccessCards'

const ALERT_CFG = {
  0: { color: '#14532D', bg: '#F0FDF4', border: '#BBF7D0' },
  1: { color: '#92400E', bg: '#FFFBEB', border: '#FDE68A' },
  2: { color: '#B91C1C', bg: '#FEF2F2', border: '#FECACA' },
  3: { color: '#7F1D1D', bg: '#FEF2F2', border: '#FCA5A5' },
} as Record<number, { color: string; bg: string; border: string }>

const SVC_COLOR: Record<string, string> = {
  normal: '#14532D', intermitente: '#92400E', sin_servicio: '#B91C1C',
  operativo: '#14532D', critico: '#92400E', colapsado: '#B91C1C', racionado: '#92400E',
}
const SVC_DOT: Record<string, string> = {
  normal: '#16A34A', intermitente: '#D97706', sin_servicio: '#DC2626',
  operativo: '#16A34A', critico: '#D97706', colapsado: '#DC2626', racionado: '#D97706',
}

export default function HomePage() {
  const { t, lang } = useLang()
  const tStatus = translations[lang].status
  const tAlert  = translations[lang].alert as Record<string, string>

  const [regions,   setRegions]   = useState<any[]>([])
  const [hospitals, setHospitals] = useState<any[]>([])
  const [shelters,  setShelters]  = useState<any[]>([])
  const [news,      setNews]      = useState<any[]>([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('regions').select('*').order('alert_level', { ascending: false }),
      supabase.from('hospitals').select('status'),
      supabase.from('shelters').select('status, capacity, current_occupancy'),
      supabase.from('news').select('*').order('priority', { ascending: false }).order('created_at', { ascending: false }).limit(4),
    ]).then(([r, h, s, n]) => {
      setRegions(r.data ?? [])
      setHospitals(h.data ?? [])
      setShelters(s.data ?? [])
      setNews(n.data ?? [])
      setLoading(false)
    })
  }, [])

  const operativeHospitals = hospitals.filter(h => h.status === 'operativo').length
  const activeShelters     = shelters.filter(s => s.status === 'activo').length
  const freePlaces         = shelters.filter(s => s.status === 'activo').reduce((a, s) => a + ((s.capacity ?? 0) - (s.current_occupancy ?? 0)), 0)
  const criticalRegions    = regions.filter(r => r.alert_level >= 2).length
  const globalAlert        = regions.length ? Math.max(...regions.map(r => r.alert_level ?? 0)) : 2
  const alertCfg           = ALERT_CFG[globalAlert] ?? ALERT_CFG[2]
  const urgentNews         = news.find(n => n.priority === 2)

  const SRC_CLASS: Record<string,string> = { gov:'src-gov', ngo:'src-ngo', un:'src-un', media:'src-media' }
  const SRC_LABEL: Record<string,string> = { gov:'GOB', ngo:'ONG', un:'ONU', media:'MEDIO' }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 0 80px' }}>

      {/* ALERT BANNER */}
      <div style={{ background: alertCfg.bg, borderBottom: `1px solid ${alertCfg.border}`, borderLeft: `4px solid ${alertCfg.color}`, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ position: 'relative', display: 'inline-flex', width: 10, height: 10, flexShrink: 0 }}>
          <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: alertCfg.color, opacity: 0.4, animation: 'ping 1.5s infinite' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: alertCfg.color, display: 'block', position: 'relative' }} />
        </span>
        <span style={{ fontWeight: 700, color: alertCfg.color, fontSize: 13 }}>
          {t.home.alertLevel} {tAlert[String(globalAlert)]} {t.home.alertActive}
        </span>
        <span style={{ color: '#9A9490', fontSize: 12, marginLeft: 4 }}>· {t.home.verified}</span>
      </div>

      <div style={{ padding: '20px 20px 0' }}>

        {/* URGENT NEWS */}
        {urgentNews && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderLeft: '4px solid #B91C1C', borderRadius: 8, padding: '10px 16px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 700, color: '#B91C1C', fontSize: 11 }}>{t.home.urgent} · {urgentNews.source} — </span>
              <span style={{ color: '#7F1D1D', fontSize: 13 }}>{urgentNews.title}</span>
            </div>
          </div>
        )}

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
          {[
            { label: t.home.hospitals, value: operativeHospitals, sub: t.home.operative, href: '/hospitales', color: '#1B3A6B', border: '#1B3A6B' },
            { label: t.home.shelters,  value: activeShelters,     sub: t.home.active,    href: '/refugios',  color: '#1B3A6B', border: '#1B3A6B' },
            { label: t.home.critical,  value: criticalRegions,    sub: t.home.regions,   href: '/',          color: '#B91C1C', border: '#B91C1C' },
          ].map(item => (
            <Link key={item.href + item.label} href={item.href} className="card-status" style={{ borderLeft: `3px solid ${item.border}` }}>
              <div style={{ fontSize: 11, color: '#9A9490', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{item.label}</div>
              <div className="stat-num" style={{ color: item.color }}>{loading ? '—' : item.value}</div>
              <div style={{ fontSize: 11, color: '#9A9490', marginTop: 2 }}>{item.sub}</div>
            </Link>
          ))}
        </div>

        {/* FREE PLACES */}
        <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, padding: '10px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#14532D', fontWeight: 600 }}>🏠 {t.home.freePlaces}</span>
          <span style={{ fontWeight: 800, fontSize: 22, color: '#14532D', fontVariantNumeric: 'tabular-nums' }}>{loading ? '—' : freePlaces}</span>
        </div>

        {/* QUICK ACCESS */}
        <QuickAccessCards activeShelters={activeShelters} freePlaces={freePlaces} operativeHospitals={operativeHospitals} />

        {/* REGIONS */}
        <div style={{ marginBottom: 24 }}>
          <div className="section-title">🗺️ {t.home.regionStatus}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {loading ? (
              [1,2,3].map(i => <div key={i} className="card" style={{ height: 60, opacity: 0.4 }} />)
            ) : regions.map(r => {
              const al = ALERT_CFG[r.alert_level] ?? ALERT_CFG[0]
              return (
                <div key={r.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6, color: '#1A1714' }}>{r.name}</div>
                    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                      {[
                        [r.status_power,    t.home.power   ],
                        [r.status_internet, t.home.internet],
                        [r.status_health,   t.home.health  ],
                        [r.status_water,    t.home.water   ],
                      ].map(([val, label]) => (
                        <span key={String(label)} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                          <span className="status-dot" style={{ background: SVC_DOT[val] ?? '#9A9490' }} />
                          <span style={{ color: SVC_COLOR[val] ?? '#9A9490', fontWeight: 600 }}>{label}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <span style={{ background: al.bg, color: al.color, border: `1px solid ${al.border}`, padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                    {tAlert[String(r.alert_level)]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* LATEST NEWS */}
        <div style={{ marginBottom: 24 }}>
          <div className="section-title">📢 {t.home.latestNews}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {loading ? (
              [1,2,3].map(i => <div key={i} className="card" style={{ height: 80, opacity: 0.4 }} />)
            ) : news.map(n => (
              <div key={n.id} className="card" style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span className={SRC_CLASS[n.source_type] ?? 'src-media'}>{SRC_LABEL[n.source_type] ?? 'MEDIO'}</span>
                  {n.priority === 2 && <span className="badge-danger">{t.home.urgent}</span>}
                </div>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#1A1714', lineHeight: 1.4, marginBottom: 4 }}>{n.title}</div>
                <div style={{ fontSize: 11, color: '#9A9490' }}>{n.source} · {new Date(n.created_at).toLocaleDateString('es-VE')}</div>
              </div>
            ))}
            <Link href="/noticias" style={{ textDecoration: 'none' }}>
              <button className="btn-outline" style={{ width: '100%', marginTop: 4 }}>{t.home.allNews}</button>
            </Link>
          </div>
        </div>

        {/* DIASPORA BANNER */}
        <div style={{ background: '#EBF0F8', border: '1px solid #BFDBFE', borderRadius: 10, padding: 20, marginBottom: 12 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#1A1714', marginBottom: 6 }}>🌎 {t.home.diasporaTitle}</div>
          <div style={{ fontSize: 13, color: '#5C5650', marginBottom: 14, lineHeight: 1.5 }}>{t.home.diasporaDesc}</div>
          <Link href="/diaspora"><button className="btn-primary">{t.home.diasporaCta}</button></Link>
        </div>

        {/* RESOURCES BANNER */}
        <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: 20 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#1A1714', marginBottom: 6 }}>🔗 {t.home.resourcesTitle}</div>
          <div style={{ fontSize: 13, color: '#5C5650', marginBottom: 4 }}>🔍 venezuelatebusca.com</div>
          <div style={{ fontSize: 13, color: '#5C5650', marginBottom: 14 }}>📱 rebtel.com</div>
          <Link href="/recursos"><button className="btn-primary" style={{ background: '#16A34A' }}>{t.home.resourcesCta}</button></Link>
        </div>
      </div>

      <EmergencyFAB />
    </div>
  )
}
