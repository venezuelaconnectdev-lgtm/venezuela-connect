import { supabase } from '@/lib/supabase'
import { ALERT_LEVELS, SERVICE_STATUS, SOURCE_STYLES } from '@/lib/constants'
import StatusCard from '@/components/shared/StatusCard'
import RegionBadge from '@/components/shared/RegionBadge'
import EmergencyFAB from '@/components/shared/EmergencyFAB'
import Link from 'next/link'

export const revalidate = 60

async function getData() {
  const [regionsRes, hospitalsRes, sheltersRes, newsRes] = await Promise.all([
    supabase.from('regions').select('*').order('alert_level', { ascending: false }),
    supabase.from('hospitals').select('status'),
    supabase.from('shelters').select('status, capacity, current_occupancy'),
    supabase.from('news').select('*, regions(name)').order('priority', { ascending: false }).order('created_at', { ascending: false }).limit(4),
  ])
  return {
    regions:   regionsRes.data   ?? [],
    hospitals: hospitalsRes.data ?? [],
    shelters:  sheltersRes.data  ?? [],
    news:      newsRes.data      ?? [],
  }
}

export default async function HomePage() {
  const { regions, hospitals, shelters, news } = await getData()

  const operativeHospitals = hospitals.filter(h => h.status === 'operativo').length
  const activeShelters     = shelters.filter(s => s.status === 'activo').length
  const freePlaces         = shelters.filter(s => s.status === 'activo').reduce((a, s) => a + ((s.capacity ?? 0) - (s.current_occupancy ?? 0)), 0)
  const criticalRegions    = regions.filter(r => r.alert_level >= 2).length
  const globalAlert        = Math.max(...regions.map(r => r.alert_level ?? 0), 0) as 0|1|2|3
  const alertInfo          = ALERT_LEVELS[globalAlert]
  const urgentNews         = news.find(n => n.priority === 2)

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 0 80px' }}>

      {/* ALERT BANNER */}
      <div style={{ background: alertInfo.bg, borderBottom: `1px solid ${alertInfo.color}44`, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ position: 'relative', display: 'inline-flex', width: 12, height: 12, flexShrink: 0 }}>
          <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: alertInfo.color, opacity: 0.5, animation: 'ping 1.5s infinite' }} />
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: alertInfo.color, display: 'block', position: 'relative' }} />
        </span>
        <div>
          <span style={{ fontWeight: 700, color: alertInfo.color, fontSize: 13 }}>NIVEL {alertInfo.label} ACTIVO </span>
          <span style={{ color: '#94a3b8', fontSize: 12 }}>· Actualiza cada minuto · {new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      <div style={{ padding: '20px 20px 0' }}>

        {/* URGENT NEWS */}
        {urgentNews && (
          <div style={{ background: '#7f1d1d', border: '1px solid #dc262655', borderRadius: 8, padding: '10px 14px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 14 }}>🔴</span>
            <div>
              <span style={{ fontWeight: 700, color: '#fca5a5', fontSize: 11 }}>URGENTE · {urgentNews.source} </span>
              <span style={{ color: '#fecaca', fontSize: 13 }}>{urgentNews.title}</span>
            </div>
          </div>
        )}

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
          <StatusCard title="Hospitales" value={operativeHospitals} status="normal"  icon="🏥" href="/hospitales" sub="operativos" />
          <StatusCard title="Refugios"   value={activeShelters}     status="info"    icon="🏠" href="/refugios"  sub="activos"    />
          <StatusCard title="Críticas"   value={criticalRegions}    status="danger"  icon="⚠️" href="/"         sub="regiones"   />
        </div>

        {/* FREE PLACES */}
        <div style={{ background: '#14532d33', border: '1px solid #16A34A44', borderRadius: 8, padding: '10px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#86efac' }}>🏠 Lugares disponibles en refugios</span>
          <span style={{ fontWeight: 800, fontSize: 20, color: '#86efac' }}>{freePlaces}</span>
        </div>

        {/* QUICK ACCESS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          {[
            { icon:'🏠', title:'Refugios',    desc:`${activeShelters} activos · ${freePlaces} lugares libres`, href:'/refugios',   color:'#3b82f6' },
            { icon:'🏥', title:'Hospitales',  desc:`${operativeHospitals} operativos`,                          href:'/hospitales', color:'#16A34A' },
            { icon:'📢', title:'Noticias',    desc:'Solo fuentes verificadas',                                  href:'/noticias',   color:'#D97706' },
            { icon:'💰', title:'Cómo donar',  desc:'Organizaciones verificadas',                                href:'/donaciones', color:'#8b5cf6' },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#243447')}
                onMouseLeave={e => (e.currentTarget.style.background = '#1E293B')}
              >
                <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: item.color, fontWeight: 600 }}>{item.desc}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* REGIONS */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>🗺️ Estado por región</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {regions.map(r => {
              const sp = SERVICE_STATUS[r.status_power as keyof typeof SERVICE_STATUS]
              const si = SERVICE_STATUS[r.status_internet as keyof typeof SERVICE_STATUS]
              const sh = SERVICE_STATUS[r.status_health as keyof typeof SERVICE_STATUS]
              const sw = SERVICE_STATUS[r.status_water as keyof typeof SERVICE_STATUS]
              return (
                <div key={r.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{r.name}</div>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, color: sp?.color }}>{sp?.dot} Luz</span>
                      <span style={{ fontSize: 11, color: si?.color }}>{si?.dot} Net</span>
                      <span style={{ fontSize: 11, color: sh?.color }}>{sh?.dot} Salud</span>
                      <span style={{ fontSize: 11, color: sw?.color }}>{sw?.dot} Agua</span>
                    </div>
                  </div>
                  <RegionBadge level={r.alert_level as 0|1|2|3} small />
                </div>
              )
            })}
          </div>
        </div>

        {/* LATEST NEWS */}
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>📢 Últimas noticias verificadas</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {news.map(n => {
              const src = SOURCE_STYLES[n.source_type as keyof typeof SOURCE_STYLES]
              return (
                <div key={n.id} className="card">
                  <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ background: src.bg, color: src.color, padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>{src.label}</span>
                    {n.priority === 2 && <span style={{ background: '#7f1d1d', color: '#fca5a5', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>URGENTE</span>}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, lineHeight: 1.4 }}>{n.title}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{n.source} · {new Date(n.created_at).toLocaleDateString('es-VE')}</div>
                </div>
              )
            })}
            <Link href="/noticias" style={{ textDecoration: 'none' }}>
              <button className="btn-outline" style={{ width: '100%', marginTop: 4 }}>Ver todas las noticias →</button>
            </Link>
          </div>
        </div>

        {/* DIASPORA BANNER */}
        <div style={{ marginTop: 24, background: '#1e3a5f33', border: '1px solid #1e3a5f', borderRadius: 10, padding: 20 }}>
          <div style={{ fontSize: 18, marginBottom: 6 }}>🌎 ¿Estás fuera de Venezuela?</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 14 }}>Descubre cómo ayudar desde tu país con guías específicas.</div>
          <Link href="/diaspora">
            <button className="btn-primary">Ver guía para la diáspora →</button>
          </Link>
        </div>
      </div>

      <EmergencyFAB />
    </div>
  )
}
