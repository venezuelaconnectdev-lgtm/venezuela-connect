'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import VerifiedBadge from '@/components/shared/VerifiedBadge'

const STATUS_CFG: Record<string,{label:string;bg:string;color:string;border:string;dot:string}> = {
  operativo:   { label:'Operativo',   bg:'#F0FDF4', color:'#14532D', border:'#BBF7D0', dot:'#16A34A' },
  parcial:     { label:'Parcial',     bg:'#FFFBEB', color:'#92400E', border:'#FDE68A', dot:'#D97706' },
  cerrado:     { label:'Cerrado',     bg:'#FEF2F2', color:'#7F1D1D', border:'#FECACA', dot:'#B91C1C' },
  desbordado:  { label:'DESBORDADO', bg:'#FFF1F2', color:'#9F1239', border:'#FDA4AF', dot:'#E11D48' },
}
const CONF_CFG: Record<string,{label:string;color:string}> = {
  alta:  { label:'Fuente verificada', color:'#14532D' },
  media: { label:'Fuente parcial',    color:'#92400E' },
  baja:  { label:'Sin fuente oficial',color:'#9A9490' },
}

export default function HospitalesPage() {
  const [hospitals, setHospitals] = useState<any[]>([])
  const [loading, setLoading]     = useState(true)
  const [filter, setFilter]       = useState('all')
  const [search, setSearch]       = useState('')
  const [expanded, setExpanded]   = useState<string|null>(null)

  useEffect(() => {
    supabase.from('hospitals')
      .select('*, regions(name,slug)')
      .order('status')
      .then(({ data }) => { setHospitals(data ?? []); setLoading(false) })
  }, [])

  const filtered = hospitals.filter(h => {
    const mF = filter === 'all' || h.status === filter
    const mS = h.name.toLowerCase().includes(search.toLowerCase()) ||
               h.city.toLowerCase().includes(search.toLowerCase())
    return mF && mS
  })

  const counts = {
    operativo:  hospitals.filter(h => h.status === 'operativo').length,
    parcial:    hospitals.filter(h => h.status === 'parcial').length,
    desbordado: hospitals.filter(h => h.status === 'desbordado').length,
    cerrado:    hospitals.filter(h => h.status === 'cerrado').length,
  }

  return (
    <div style={{ maxWidth:720, margin:'0 auto', padding:'20px 20px 80px' }}>

      {/* HEADER */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:22, fontWeight:800, color:'#1A1714', marginBottom:4 }}>🏥 Hospitales</div>
        <div style={{ fontSize:13, color:'#9A9490' }}>
          Estado actualizado post-terremoto · Fuente: OPS/PAHO, MinSalud, Reuters
        </div>
      </div>

      {/* ALERTA OPS */}
      <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderLeft:'4px solid #B91C1C', borderRadius:8, padding:'10px 16px', marginBottom:20 }}>
        <div style={{ fontSize:11, fontWeight:700, color:'#B91C1C', marginBottom:3 }}>⚠️ ALERTA OPS/PAHO</div>
        <div style={{ fontSize:13, color:'#7F1D1D', lineHeight:1.5 }}>
          91 hospitales en zonas de actividad Mercalli VI+. Al menos 20 en áreas de máxima afectación (Mercalli VII). Se realizan evaluaciones estructurales de urgencia.
        </div>
      </div>

      {/* STATS */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:16 }}>
        {[
          ['Operativos', counts.operativo,  '#14532D','#F0FDF4','#BBF7D0'],
          ['Parciales',  counts.parcial,    '#92400E','#FFFBEB','#FDE68A'],
          ['Desbordados',counts.desbordado, '#9F1239','#FFF1F2','#FDA4AF'],
          ['Cerrados',   counts.cerrado,    '#7F1D1D','#FEF2F2','#FECACA'],
        ].map(([l,v,c,bg,border]) => (
          <div key={String(l)} className="card" style={{ textAlign:'center', padding:'10px 6px', borderTop:`3px solid ${String(border)}`, background:String(bg) }}>
            <div style={{ fontSize:20, fontWeight:800, color:String(c), fontVariantNumeric:'tabular-nums' }}>{v}</div>
            <div style={{ fontSize:10, color:String(c), fontWeight:600, marginTop:2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* SEARCH */}
      <input
        className="vc-input"
        placeholder="🔍 Buscar hospital o ciudad..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* FILTERS */}
      <div style={{ display:'flex', gap:8, marginBottom:20, overflowX:'auto', paddingBottom:4 }}>
        {[
          ['all','Todos'],
          ['operativo','Operativos'],
          ['parcial','Parciales'],
          ['desbordado','Desbordados'],
          ['cerrado','Cerrados'],
        ].map(([v,l]) => (
          <button key={v} onClick={() => setFilter(v)} className={`filter-btn ${filter===v?'active':''}`}>{l}</button>
        ))}
      </div>

      {/* LIST */}
      {loading ? (
        [1,2,3].map(i => <div key={i} className="card" style={{ height:120, marginBottom:12, opacity:0.3 }} />)
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign:'center', padding:40, color:'#9A9490' }}>
          <div style={{ fontSize:32, marginBottom:8 }}>🔍</div>
          <div>No se encontraron hospitales</div>
          <button className="btn-outline" style={{ marginTop:12 }} onClick={() => { setFilter('all'); setSearch('') }}>Limpiar filtros</button>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {filtered.map(h => {
            const cfg  = STATUS_CFG[h.status] ?? STATUS_CFG.parcial
            const conf = CONF_CFG[h.confidence ?? 'baja']
            const isExpanded = expanded === h.id
            return (
              <div key={h.id} className="card" style={{ borderLeft:`3px solid ${cfg.dot}` }}>

                {/* TOP */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                  <div style={{ flex:1, paddingRight:8 }}>
                    <div style={{ fontWeight:700, fontSize:15, color:'#1A1714', marginBottom:4 }}>{h.name}</div>
                    <div style={{ fontSize:12, color:'#9A9490' }}>
                      📍 {h.city}{h.regions ? ` · ${(h.regions as any).name}` : ''}
                    </div>
                  </div>
                  <span style={{
                    background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.border}`,
                    padding:'3px 10px', borderRadius:4, fontSize:11, fontWeight:700,
                    flexShrink:0, letterSpacing:'0.04em',
                  }}>{cfg.label}</span>
                </div>

                {/* QUICK INFO */}
                <div style={{ display:'flex', gap:14, flexWrap:'wrap', marginBottom:10 }}>
                  <span style={{ fontSize:12, color: h.emergency_available ? '#14532D' : '#9F1239', fontWeight:600 }}>
                    {h.emergency_available ? '🚨 Emergencias: SÍ' : '❌ Emergencias: NO'}
                  </span>
                  {h.beds_available != null && (
                    <span style={{ fontSize:12, color: h.beds_available > 0 ? '#14532D' : '#9F1239', fontWeight:600 }}>
                      🛏 {h.beds_available > 0 ? `${h.beds_available} camas` : 'Sin camas'}
                    </span>
                  )}
                  {h.verified && <VerifiedBadge small />}
                </div>

                {/* SERVICES — acordeón */}
                {h.services && (
                  <div
                    onClick={() => setExpanded(isExpanded ? null : h.id)}
                    style={{ background:'#F7F6F3', border:'1px solid #E2DDD8', borderRadius:6, padding:'8px 12px', marginBottom:10, cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center' }}
                  >
                    <span style={{ fontSize:12, color:'#5C5650', fontWeight:600 }}>🏥 Servicios disponibles</span>
                    <span style={{ fontSize:12, color:'#9A9490' }}>{isExpanded ? '▲' : '▼'}</span>
                  </div>
                )}
                {isExpanded && h.services && (
                  <div style={{ background:'#F7F6F3', border:'1px solid #E2DDD8', borderRadius:6, padding:'10px 12px', marginBottom:10, marginTop:-8 }}>
                    <div style={{ fontSize:13, color:'#5C5650', lineHeight:1.6 }}>{h.services}</div>
                  </div>
                )}

                {/* DIRECCIÓN */}
                {h.address && (
                  <div style={{ fontSize:11, color:'#9A9490', marginBottom:8 }}>📍 {h.address}</div>
                )}

                {/* FOOTER */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:6, paddingTop:8, borderTop:'1px solid #E2DDD8' }}>
                  <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                    {h.source_name && (
                      <span style={{ fontSize:10, color:conf.color, fontWeight:600 }}>
                        📋 {h.source_name} · {conf.label}
                      </span>
                    )}
                    {h.last_updated && (
                      <span style={{ fontSize:10, color:'#9A9490' }}>
                        🕐 {new Date(h.last_updated).toLocaleDateString('es-VE', { day:'2-digit', month:'short', year:'numeric' })}
                      </span>
                    )}
                  </div>
                  {h.phone && (
                    <a href={`tel:${h.phone}`} style={{ fontSize:12, color:'#1B3A6B', textDecoration:'none', fontWeight:700 }}>
                      📞 {h.phone}
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* DISCLAIMER */}
      <div className="card" style={{ marginTop:20, background:'#EBF0F8', border:'1px solid #BFDBFE' }}>
        <div style={{ fontSize:12, color:'#1B3A6B', lineHeight:1.6 }}>
          ℹ️ La información hospitalaria proviene de OPS/PAHO, MinSalud Venezuela y medios verificados (Reuters, El Estímulo). Los estados cambian rápidamente — consulta siempre con las autoridades locales antes de trasladarte.
        </div>
      </div>
    </div>
  )
}
