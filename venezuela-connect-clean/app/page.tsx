import { supabase } from '@/lib/supabase'
import { ALERT_LEVELS, SERVICE_STATUS, SOURCE_STYLES } from '@/lib/constants'
import StatusCard from '@/components/shared/StatusCard'
import RegionBadge from '@/components/shared/RegionBadge'
import EmergencyFAB from '@/components/shared/EmergencyFAB'
import QuickAccessCards from '@/components/shared/QuickAccessCards'
import Link from 'next/link'

export const revalidate = 60

async function getData() {
  const [regionsRes, hospitalsRes, sheltersRes, newsRes] = await Promise.all([
    supabase.from('regions').select('*').order('alert_level', { ascending: false }),
    supabase.from('hospitals').select('status'),
    supabase.from('shelters').select('status, capacity, current_occupancy'),
    supabase.from('news').select('*').order('priority', { ascending: false }).order('created_at', { ascending: false }).limit(4),
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

      <div style={{ background: alertInfo.bg, borderBottom: `1px solid ${alertInfo.color}44`, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: alertInfo.color, display: 'inline-block', flexShrink: 0 }} />
        <span style={{ fontWeight: 700, color: alertInfo.color, fontSize: 13 }}>NIVEL {alertInfo.label} ACTIVO</span>
        <span style={{ color: '#94a3b8', fontSize: 12 }}>· Información verificada</span>
      </div>

      <div style={{ padding: '20px 20px 0' }}>

        {urgentNews && (
          <div style={{ background: '#7f1d1d', border: '1px solid #dc262655', borderRadius: 8, padding: '10px 14px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
            <span>🔴</span>
            <div>
              <span style={{ fontWeight: 700, color: '#fca5a5', fontSize: 11 }}>URGENTE · {urgentNews.source} </span>
              <span style={{ color: '#fecaca', fontSize: 13 }}>{urgentNews.title}</span>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
          <StatusCard title="Hospitales" value={operativeHospitals} status="normal" icon="🏥" href="/hospitales" sub="operativos" />
          <StatusCard title="Refugios"   value={activeShelters}     status="info"   icon="🏠" href="/refugios"   sub="activos" />
          <StatusCard title="Críticas"   value={criticalRegions}    status="danger" icon="⚠️" href="/"           sub="regiones" />
        </div>

        <div style={{ background: '#14532d33', border: '1px solid #16A34A44', borderRadius: 8, padding: '10px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#86efac' }}>🏠 Lugares disponibles en refugios</span>
          <span style={{ fontWeight: 800, fontSize: 20, color: '#86efac' }}>{freePlaces}</span>
        </div>

        <QuickAccessCards activeShelters={activeShelters} freePlaces={freePlaces} operativeHospitals={operativeHospitals} />

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

        <div>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>📢 Últimas noticias verificadas</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {news.map(n => {
              const src = SOURCE_STYLES[n.source_type as keyof typeof SOURCE_STYLES]
              return (
                <div key={n.id} className="card">
                  <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
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

        <div style={{ marginTop: 24, background: '#1e3a5f33', border: '1px solid #1e3a5f', borderRadius: 10, padding: 20 }}>
          <div style={{ fontSize: 18, marginBottom: 6 }}>🌎 ¿Estás fuera de Venezuela?</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 14 }}>Descubre cómo ayudar desde tu país con guías específicas.</div>
          <Link href="/diaspora">
            <button className="btn-primary">Ver guía para la diáspora →</button>
          </Link>
        </div>

        <div style={{ marginTop: 12, background: '#0f2a1a', border: '1px solid #16A34A44', borderRadius: 10, padding: 20 }}>
          <div style={{ fontSize: 18, marginBottom: 6 }}>🔗 Recursos y herramientas</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: '#94a3b8' }}>🔍 Búsqueda de personas — venezuelatebusca.com</div>
            <div style={{ fontSize: 13, color: '#94a3b8' }}>📱 Recarga de celular a distancia — rebtel.com</div>
          </div>
          <Link href="/recursos">
            <button className="btn-primary" style={{ background: '#16A34A' }}>Ver todos los recursos →</button>
          </Link>
        </div>
      </div>

      <EmergencyFAB />
    </div>
  )
}
