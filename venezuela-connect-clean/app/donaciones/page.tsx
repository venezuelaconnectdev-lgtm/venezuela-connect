'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Organization } from '@/lib/types'
import VerifiedBadge from '@/components/shared/VerifiedBadge'

export default function DonacionesPage() {
  const [orgs, setOrgs]     = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    supabase.from('organizations').select('*').eq('active', true).order('type').then(({ data }) => {
      setOrgs(data ?? [])
      setLoading(false)
    })
  }, [])

  const filtered = orgs.filter(o => filter === 'all' || o.type === filter)
  const typeInfo: Record<string,{label:string,bg:string,color:string}> = {
    ngo:   { label:'ONG',  bg:'#7f1d1d', color:'#fca5a5' },
    un:    { label:'ONU',  bg:'#0c4a6e', color:'#7dd3fc' },
    gov:   { label:'GOB',  bg:'#1e3a5f', color:'#93c5fd' },
    diaspora:{ label:'DIÁS', bg:'#4a1d96', color:'#c4b5fd' },
  }

  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'20px 20px 80px' }}>
      <div style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>💰 Cómo ayudar</div>
      <div style={{ fontSize:13, color:'#64748b', marginBottom:16 }}>Organizaciones verificadas para donar o colaborar</div>

      {/* DISCLAIMER */}
      <div style={{ background:'#1e3a5f33', border:'1px solid #1e3a5f', borderRadius:8, padding:14, marginBottom:20, fontSize:13, color:'#93c5fd', lineHeight:1.6 }}>
        ℹ️ <strong>Venezuela Connect no recibe ni gestiona dinero.</strong><br />
        Solo mostramos organizaciones verificadas. Dona directamente en sus sitios oficiales.
      </div>

      {/* FILTERS */}
      <div style={{ display:'flex', gap:8, marginBottom:20, overflowX:'auto' }}>
        {[['all','Todas'],['ngo','ONG'],['un','ONU'],['gov','Gobierno'],['diaspora','Diáspora']].map(([v,l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{
            background:filter===v?'#3b82f6':'#1e293b', color:filter===v?'#fff':'#94a3b8',
            border:`1px solid ${filter===v?'#3b82f6':'#334155'}`, borderRadius:20,
            padding:'6px 14px', fontSize:12, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap',
          }}>{l}</button>
        ))}
      </div>

      {loading ? (
        [1,2,3].map(i => <div key={i} className="card" style={{ height:120, marginBottom:12, opacity:0.4 }} />)
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {filtered.map(o => {
            const ti = typeInfo[o.type] ?? typeInfo.ngo
            return (
              <div key={o.id} className="card">
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                  <div style={{ fontWeight:700, fontSize:15 }}>{o.name}</div>
                  <span style={{ background:ti.bg, color:ti.color, padding:'2px 8px', borderRadius:4, fontSize:11, fontWeight:700, flexShrink:0, marginLeft:8 }}>{ti.label}</span>
                </div>
                {o.description && <div style={{ fontSize:13, color:'#94a3b8', marginBottom:12, lineHeight:1.5 }}>{o.description}</div>}
                <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                  {o.verified && <VerifiedBadge />}
                  <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
                    {o.donation_url && (
                      <a href={o.donation_url} target="_blank" rel="noopener noreferrer">
                        <button style={{ background:'#16A34A', color:'#fff', border:'none', borderRadius:8, padding:'8px 14px', fontSize:12, fontWeight:700, cursor:'pointer' }}>💚 Donar</button>
                      </a>
                    )}
                    {o.url && (
                      <a href={o.url} target="_blank" rel="noopener noreferrer">
                        <button style={{ background:'transparent', color:'#3b82f6', border:'1px solid #3b82f6', borderRadius:8, padding:'8px 14px', fontSize:12, fontWeight:700, cursor:'pointer' }}>Sitio oficial ↗</button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* DIASPORA TEASER */}
      <div style={{ marginTop:24, background:'#1e293b', border:'1px solid #334155', borderRadius:10, padding:20 }}>
        <div style={{ fontSize:17, fontWeight:700, marginBottom:6 }}>🌎 ¿Estás fuera de Venezuela?</div>
        <div style={{ fontSize:13, color:'#94a3b8', marginBottom:14 }}>Hay guías específicas por país con centros de acopio, organizaciones locales y formas de enviar apoyo.</div>
        <a href="/diaspora"><button className="btn-primary">Ver guía por país →</button></a>
      </div>
    </div>
  )
}
