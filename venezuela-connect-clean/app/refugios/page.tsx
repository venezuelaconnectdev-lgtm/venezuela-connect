'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Shelter } from '@/lib/types'
import VerifiedBadge from '@/components/shared/VerifiedBadge'

export default function RefugiosPage() {
  const [shelters, setShelters] = useState<Shelter[]>([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('all')
  const [search, setSearch]     = useState('')

  useEffect(() => {
    supabase.from('shelters').select('*, regions(name, slug)').order('status').then(({ data }) => {
      setShelters(data ?? [])
      setLoading(false)
    })
  }, [])

  const filtered = shelters.filter(s => {
    const matchF = filter === 'all' || s.status === filter
    const matchS = s.name.toLowerCase().includes(search.toLowerCase()) || s.city.toLowerCase().includes(search.toLowerCase())
    return matchF && matchS
  })

  const active    = shelters.filter(s => s.status === 'activo').length
  const freePlaces = shelters.filter(s => s.status === 'activo').reduce((a,s) => a + ((s.capacity??0) - (s.current_occupancy??0)), 0)
  const full      = shelters.filter(s => s.status === 'lleno').length

  const statusColor: Record<string,string> = { activo:'#16A34A', lleno:'#EA580C', cerrado:'#DC2626' }
  const statusLabel: Record<string,string> = { activo:'🟢 Activo', lleno:'🟠 Lleno', cerrado:'🔴 Cerrado' }

  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'20px 20px 80px' }}>
      <div style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>🏠 Refugios</div>
      <div style={{ fontSize:13, color:'#64748b', marginBottom:16 }}>Centros de atención habilitados y verificados</div>

      {/* STATS */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:16 }}>
        {[['Activos',`${active}`, '#86efac'],['Lugares libres',`${freePlaces}`,'#93c5fd'],['Llenos',`${full}`,'#fca5a5']].map(([l,v,c]) => (
          <div key={l} className="card" style={{ textAlign:'center', padding:'10px 8px' }}>
            <div style={{ fontSize:22, fontWeight:800, color:c, lineHeight:1 }}>{v}</div>
            <div style={{ fontSize:11, color:'#64748b', marginTop:4 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* SEARCH */}
      <input
        style={{ background:'#1e293b', border:'1px solid #334155', borderRadius:8, padding:'10px 14px', color:'#F1F5F9', fontSize:14, width:'100%', outline:'none', marginBottom:12 }}
        placeholder="🔍 Buscar por nombre o ciudad..."
        value={search} onChange={e => setSearch(e.target.value)}
      />

      {/* FILTERS */}
      <div style={{ display:'flex', gap:8, marginBottom:16, overflowX:'auto', paddingBottom:4 }}>
        {[['all','Todos'],['activo','Activos'],['lleno','Llenos'],['cerrado','Cerrados']].map(([v,l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{
            background: filter===v ? '#3b82f6' : '#1e293b',
            color: filter===v ? '#fff' : '#94a3b8',
            border: `1px solid ${filter===v ? '#3b82f6' : '#334155'}`,
            borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
          }}>{l}</button>
        ))}
      </div>

      {/* LIST */}
      {loading ? (
        [1,2,3].map(i => <div key={i} className="card" style={{ height:120, marginBottom:12, opacity:0.4, animation:'pulse-slow 2s infinite' }} />)
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign:'center', padding:40, color:'#64748b' }}>
          <div style={{ fontSize:32, marginBottom:8 }}>🔍</div>
          <div>No se encontraron refugios</div>
          <button className="btn-outline" style={{ marginTop:12 }} onClick={() => { setFilter('all'); setSearch('') }}>Limpiar filtros</button>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {filtered.map(s => {
            const pct = s.capacity ? Math.round(((s.current_occupancy??0) / s.capacity) * 100) : 0
            const barColor = pct >= 90 ? '#DC2626' : pct >= 70 ? '#D97706' : '#16A34A'
            return (
              <div key={s.id} className="card">
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14 }}>{s.name}</div>
                    <div style={{ fontSize:12, color:'#64748b' }}>{s.city}{s.regions ? ` · ${(s.regions as any).name}` : ''}</div>
                  </div>
                  <span style={{ color:statusColor[s.status], fontSize:12, fontWeight:700, flexShrink:0, marginLeft:8 }}>{statusLabel[s.status]}</span>
                </div>

                {/* OCCUPANCY BAR */}
                {s.capacity && (
                  <div style={{ marginBottom:10 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#94a3b8', marginBottom:4 }}>
                      <span>{s.current_occupancy}/{s.capacity} personas</span>
                      <span style={{ color:barColor }}>{pct}%</span>
                    </div>
                    <div style={{ background:'#334155', borderRadius:4, height:6 }}>
                      <div style={{ width:`${pct}%`, background:barColor, borderRadius:4, height:6, transition:'width 0.5s' }} />
                    </div>
                  </div>
                )}

                <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
                  {s.accepts_pets && <span style={{ fontSize:11, color:'#94a3b8' }}>🐾 Acepta mascotas</span>}
                  {s.contact_name && <span style={{ fontSize:11, color:'#94a3b8' }}>👤 {s.contact_name}</span>}
                  {s.verified && <VerifiedBadge small />}
                  {s.phone && (
                    <a href={`tel:${s.phone}`} style={{ marginLeft:'auto', fontSize:12, color:'#3b82f6', textDecoration:'none', fontWeight:700 }}>📞 {s.phone}</a>
                  )}
                </div>

                {/* WHATSAPP */}
                <button
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`🏠 REFUGIO: ${s.name}\n📍 ${s.city}\n👥 ${s.capacity ? `${(s.capacity - (s.current_occupancy??0))} lugares disponibles` : 'Consultar capacidad'}\n📞 ${s.phone ?? 'Sin teléfono'}\n✅ Venezuela Connect`)}`, '_blank')}
                  style={{ width:'100%', marginTop:10, background:'transparent', border:'1px solid #25D36655', color:'#25D366', borderRadius:8, padding:'8px', fontSize:12, fontWeight:700, cursor:'pointer' }}
                >
                  📤 Compartir por WhatsApp
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
