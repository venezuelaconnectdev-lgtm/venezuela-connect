'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import VerifiedBadge from '@/components/shared/VerifiedBadge'

const STATUS_CFG: Record<string,{label:string;bg:string;color:string;border:string;dot:string}> = {
  activo: { label:'Activo',  bg:'#F0FDF4', color:'#14532D', border:'#BBF7D0', dot:'#16A34A' },
  lleno:  { label:'Lleno',   bg:'#FFFBEB', color:'#92400E', border:'#FDE68A', dot:'#D97706' },
  cerrado:{ label:'Cerrado', bg:'#FEF2F2', color:'#7F1D1D', border:'#FECACA', dot:'#B91C1C' },
}
const CONF_CFG: Record<string,{label:string;color:string}> = {
  alta:  { label:'Fuente verificada',  color:'#14532D' },
  media: { label:'Fuente parcial',     color:'#92400E' },
  baja:  { label:'Sin fuente oficial', color:'#9A9490' },
}

export default function RefugiosPage() {
  const [shelters, setShelters]   = useState<any[]>([])
  const [loading, setLoading]     = useState(true)
  const [filter, setFilter]       = useState('all')
  const [search, setSearch]       = useState('')
  const [expanded, setExpanded]   = useState<string|null>(null)

  useEffect(() => {
    supabase.from('shelters')
      .select('*, regions(name,slug)')
      .order('status')
      .then(({ data }) => { setShelters(data ?? []); setLoading(false) })
  }, [])

  const filtered = shelters.filter(s => {
    const mF = filter === 'all' || s.status === filter
    const mS = s.name.toLowerCase().includes(search.toLowerCase()) ||
               s.city.toLowerCase().includes(search.toLowerCase())
    return mF && mS
  })

  const active    = shelters.filter(s => s.status === 'activo').length
  const freePlaces = shelters.filter(s => s.status === 'activo')
                             .reduce((a,s) => a + ((s.capacity ?? 0) - (s.current_occupancy ?? 0)), 0)
  const full      = shelters.filter(s => s.status === 'lleno').length

  return (
    <div style={{ maxWidth:720, margin:'0 auto', padding:'20px 20px 80px' }}>

      {/* HEADER */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:22, fontWeight:800, color:'#1A1714', marginBottom:4 }}>🏠 Refugios</div>
        <div style={{ fontSize:13, color:'#9A9490' }}>
          Centros verificados · Fuente: Alcaldía de Caracas, Protección Civil, Cruz Roja
        </div>
      </div>

      {/* STATS */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:16 }}>
        <div className="card" style={{ textAlign:'center', padding:'12px 8px', borderTop:'3px solid #16A34A', background:'#F0FDF4' }}>
          <div style={{ fontSize:24, fontWeight:800, color:'#14532D', fontVariantNumeric:'tabular-nums' }}>{active}</div>
          <div style={{ fontSize:11, color:'#14532D', fontWeight:600, marginTop:2 }}>Activos</div>
        </div>
        <div className="card" style={{ textAlign:'center', padding:'12px 8px', borderTop:'3px solid #1B3A6B', background:'#EBF0F8' }}>
          <div style={{ fontSize:24, fontWeight:800, color:'#1B3A6B', fontVariantNumeric:'tabular-nums' }}>
            {freePlaces > 0 ? freePlaces : '?'}
          </div>
          <div style={{ fontSize:11, color:'#1B3A6B', fontWeight:600, marginTop:2 }}>Lugares libres</div>
        </div>
        <div className="card" style={{ textAlign:'center', padding:'12px 8px', borderTop:'3px solid #D97706', background:'#FFFBEB' }}>
          <div style={{ fontSize:24, fontWeight:800, color:'#92400E', fontVariantNumeric:'tabular-nums' }}>{full}</div>
          <div style={{ fontSize:11, color:'#92400E', fontWeight:600, marginTop:2 }}>Llenos</div>
        </div>
      </div>

      {/* AVISO CAPACIDAD */}
      <div style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderLeft:'4px solid #D97706', borderRadius:8, padding:'10px 16px', marginBottom:16 }}>
        <div style={{ fontSize:12, color:'#92400E', lineHeight:1.5 }}>
          ⚠️ Muchas familias han improvisado refugios en plazas y parques. Los datos de capacidad pueden no estar disponibles en todos los centros. Llama antes de trasladarte.
        </div>
      </div>

      {/* SEARCH */}
      <input
        className="vc-input"
        placeholder="🔍 Buscar refugio o ciudad..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* FILTERS */}
      <div style={{ display:'flex', gap:8, marginBottom:20, overflowX:'auto', paddingBottom:4 }}>
        {[['all','Todos'],['activo','Activos'],['lleno','Llenos'],['cerrado','Cerrados']].map(([v,l]) => (
          <button key={v} onClick={() => setFilter(v)} className={`filter-btn ${filter===v?'active':''}`}>{l}</button>
        ))}
      </div>

      {/* LIST */}
      {loading ? (
        [1,2,3].map(i => <div key={i} className="card" style={{ height:130, marginBottom:12, opacity:0.3 }} />)
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign:'center', padding:40, color:'#9A9490' }}>
          <div style={{ fontSize:32, marginBottom:8 }}>🔍</div>
          <div>No se encontraron refugios</div>
          <button className="btn-outline" style={{ marginTop:12 }} onClick={() => { setFilter('all'); setSearch('') }}>Limpiar filtros</button>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {filtered.map(s => {
            const cfg     = STATUS_CFG[s.status] ?? STATUS_CFG.activo
            const conf    = CONF_CFG[s.confidence ?? 'baja']
            const pct     = s.capacity ? Math.round(((s.current_occupancy ?? 0) / s.capacity) * 100) : null
            const barColor = pct !== null ? (pct >= 90 ? '#B91C1C' : pct >= 70 ? '#D97706' : '#16A34A') : '#9A9490'
            const isExp   = expanded === s.id

            return (
              <div key={s.id} className="card" style={{ borderLeft:`3px solid ${cfg.dot}` }}>

                {/* TOP */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                  <div style={{ flex:1, paddingRight:8 }}>
                    <div style={{ fontWeight:700, fontSize:15, color:'#1A1714', marginBottom:4 }}>{s.name}</div>
                    <div style={{ fontSize:12, color:'#9A9490' }}>
                      📍 {s.city}{s.regions ? ` · ${(s.regions as any).name}` : ''}
                    </div>
                  </div>
                  <span style={{
                    background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.border}`,
                    padding:'3px 10px', borderRadius:4, fontSize:11, fontWeight:700, flexShrink:0,
                  }}>{cfg.label}</span>
                </div>

                {/* OCCUPANCY BAR */}
                {s.capacity ? (
                  <div style={{ marginBottom:10 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#9A9490', marginBottom:4 }}>
                      <span>{s.current_occupancy ?? '?'}/{s.capacity} personas</span>
                      <span style={{ color:barColor, fontWeight:700 }}>{pct}%</span>
                    </div>
                    <div className="occ-bar-track">
                      <div className="occ-bar-fill" style={{ width:`${pct}%`, background:barColor }} />
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize:12, color:'#9A9490', marginBottom:10 }}>
                    📊 Capacidad: no informada
                  </div>
                )}

                {/* SERVICES — acordeón */}
                {s.services && (
                  <>
                    <div
                      onClick={() => setExpanded(isExp ? null : s.id)}
                      style={{ background:'#F7F6F3', border:'1px solid #E2DDD8', borderRadius:6, padding:'8px 12px', marginBottom: isExp ? 0 : 10, cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center' }}
                    >
                      <span style={{ fontSize:12, color:'#5C5650', fontWeight:600 }}>🛎 Servicios disponibles</span>
                      <span style={{ fontSize:12, color:'#9A9490' }}>{isExp ? '▲' : '▼'}</span>
                    </div>
                    {isExp && (
                      <div style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:'0 0 6px 6px', padding:'10px 12px', marginBottom:10 }}>
                        <div style={{ fontSize:13, color:'#14532D', lineHeight:1.6 }}>✓ {s.services}</div>
                      </div>
                    )}
                  </>
                )}

                {/* PETS + VERIFIED */}
                <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap', marginBottom:10 }}>
                  {s.accepts_pets && <span style={{ fontSize:11, color:'#5C5650' }}>🐾 Acepta mascotas</span>}
                  {s.contact_name && <span style={{ fontSize:11, color:'#5C5650' }}>👤 {s.contact_name}</span>}
                  {s.verified && <VerifiedBadge small />}
                </div>

                {/* FOOTER */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:6, paddingTop:8, borderTop:'1px solid #E2DDD8' }}>
                  <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                    {s.source_name && (
                      <span style={{ fontSize:10, color:conf.color, fontWeight:600 }}>
                        📋 {s.source_name} · {conf.label}
                      </span>
                    )}
                    {s.last_updated && (
                      <span style={{ fontSize:10, color:'#9A9490' }}>
                        🕐 {new Date(s.last_updated).toLocaleDateString('es-VE', { day:'2-digit', month:'short', year:'numeric' })}
                      </span>
                    )}
                  </div>
                  {s.phone && (
                    <a href={`tel:${s.phone}`} style={{ fontSize:12, color:'#1B3A6B', textDecoration:'none', fontWeight:700 }}>
                      📞 {s.phone}
                    </a>
                  )}
                </div>

                {/* WHATSAPP */}
                <button
                  className="btn-whatsapp"
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(
                    `🏠 REFUGIO DISPONIBLE\n${s.name}\n📍 ${s.address ?? s.city}\n${s.services ? `✓ ${s.services}` : ''}\n${s.phone ? `📞 ${s.phone}` : ''}\n✅ Verificado · Venezuela Connect`
                  )}`, '_blank')}
                >
                  📤 Compartir por WhatsApp
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* DISCLAIMER */}
      <div className="card" style={{ marginTop:20, background:'#EBF0F8', border:'1px solid #BFDBFE' }}>
        <div style={{ fontSize:12, color:'#1B3A6B', lineHeight:1.6 }}>
          ℹ️ Datos verificados por Alcaldía de Caracas, Protección Civil y Cruz Roja. Los estados de ocupación se actualizan manualmente — llama siempre antes de trasladarte.
        </div>
      </div>
    </div>
  )
}