'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Hospital } from '@/lib/types'
import VerifiedBadge from '@/components/shared/VerifiedBadge'

export default function HospitalesPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [loading, setLoading]     = useState(true)
  const [filter, setFilter]       = useState('all')
  const [search, setSearch]       = useState('')

  useEffect(() => {
    supabase.from('hospitals').select('*, regions(name,slug)').order('status').then(({ data }) => {
      setHospitals(data ?? [])
      setLoading(false)
    })
  }, [])

  const filtered = hospitals.filter(h => {
    const matchF = filter === 'all' || h.status === filter
    const matchS = h.name.toLowerCase().includes(search.toLowerCase()) || h.city.toLowerCase().includes(search.toLowerCase())
    return matchF && matchS
  })

  const counts = { operativo: hospitals.filter(h=>h.status==='operativo').length, parcial: hospitals.filter(h=>h.status==='parcial').length, cerrado: hospitals.filter(h=>h.status==='cerrado').length }
  const statusColor: Record<string,string> = { operativo:'#16A34A', parcial:'#D97706', cerrado:'#DC2626' }
  const statusLabel: Record<string,string> = { operativo:'🟢 Operativo', parcial:'🟡 Parcial', cerrado:'🔴 Cerrado' }

  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'20px 20px 80px' }}>
      <div style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>🏥 Hospitales</div>
      <div style={{ fontSize:13, color:'#64748b', marginBottom:16 }}>Estado actualizado de centros de salud</div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:16 }}>
        {[['Operativos',counts.operativo,'#86efac'],['Parciales',counts.parcial,'#fde68a'],['Cerrados',counts.cerrado,'#fca5a5']].map(([l,v,c]) => (
          <div key={String(l)} className="card" style={{ textAlign:'center', padding:'10px 8px' }}>
            <div style={{ fontSize:22, fontWeight:800, color:String(c), lineHeight:1 }}>{v}</div>
            <div style={{ fontSize:11, color:'#64748b', marginTop:4 }}>{l}</div>
          </div>
        ))}
      </div>

      <input
        style={{ background:'#1e293b', border:'1px solid #334155', borderRadius:8, padding:'10px 14px', color:'#F1F5F9', fontSize:14, width:'100%', outline:'none', marginBottom:12 }}
        placeholder="🔍 Buscar hospital o ciudad..."
        value={search} onChange={e => setSearch(e.target.value)}
      />

      <div style={{ display:'flex', gap:8, marginBottom:16, overflowX:'auto' }}>
        {[['all','Todos'],['operativo','Operativos'],['parcial','Parciales'],['cerrado','Cerrados']].map(([v,l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{
            background:filter===v?'#3b82f6':'#1e293b', color:filter===v?'#fff':'#94a3b8',
            border:`1px solid ${filter===v?'#3b82f6':'#334155'}`, borderRadius:20,
            padding:'6px 14px', fontSize:12, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap',
          }}>{l}</button>
        ))}
      </div>

      {loading ? (
        [1,2,3].map(i => <div key={i} className="card" style={{ height:100, marginBottom:12, opacity:0.4 }} />)
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {filtered.map(h => (
            <div key={h.id} className="card">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:14 }}>{h.name}</div>
                  <div style={{ fontSize:12, color:'#64748b' }}>{h.city}{h.regions ? ` · ${(h.regions as any).name}` : ''}</div>
                </div>
                <span style={{ color:statusColor[h.status], fontSize:12, fontWeight:700, flexShrink:0, marginLeft:8 }}>{statusLabel[h.status]}</span>
              </div>
              <div style={{ display:'flex', gap:16, fontSize:12, color:'#94a3b8', flexWrap:'wrap', alignItems:'center' }}>
                <span>{h.emergency_available ? '🚨 Emergencias: SÍ' : '❌ Emergencias: NO'}</span>
                {h.beds_available != null && h.beds_available > 0 && <span>🛏 {h.beds_available} camas</span>}
                {h.verified && <VerifiedBadge small />}
                {h.phone && <a href={`tel:${h.phone}`} style={{ marginLeft:'auto', color:'#3b82f6', textDecoration:'none', fontWeight:700 }}>📞 {h.phone}</a>}
              </div>
              {h.address && <div style={{ fontSize:11, color:'#475569', marginTop:8 }}>📍 {h.address}</div>}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="card" style={{ textAlign:'center', padding:40, color:'#64748b' }}>
              <div style={{ fontSize:32, marginBottom:8 }}>🔍</div>
              <div>No se encontraron hospitales</div>
              <button className="btn-outline" style={{ marginTop:12 }} onClick={() => { setFilter('all'); setSearch('') }}>Limpiar filtros</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
