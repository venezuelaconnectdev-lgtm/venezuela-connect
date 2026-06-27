'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import VerifiedBadge from '@/components/shared/VerifiedBadge'

const TYPE_CFG: Record<string,{label:string;bg:string;color:string;border:string}> = {
  ngo:      { label:'ONG',        bg:'#FEF2F2', color:'#B91C1C', border:'#FECACA' },
  un:       { label:'ONU',        bg:'#EFF6FF', color:'#1D4ED8', border:'#BFDBFE' },
  gov:      { label:'GOBIERNO',   bg:'#EBF0F8', color:'#1B3A6B', border:'#93C5FD' },
  diaspora: { label:'BANCO/LOCAL',bg:'#F0FDF4', color:'#14532D', border:'#BBF7D0' },
}

const COUNTRY_FLAG: Record<string,string> = {
  'Venezuela':     '🇻🇪',
  'Colombia':      '🇨🇴',
  'España':        '🇪🇸',
  'USA':           '🇺🇸',
  'Internacional': '🌐',
}

const FILTERS = [
  ['all',           'Todas'],
  ['ngo',           'ONG'],
  ['un',            'ONU'],
  ['diaspora',      'Banco/Local'],
  ['money',         '💰 Solo dinero'],
  ['items',         '📦 Acepta insumos'],
]

export default function DonacionesPage() {
  const [orgs, setOrgs]       = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('all')
  const [expanded, setExpanded] = useState<string|null>(null)

  useEffect(() => {
    supabase.from('organizations')
      .select('*')
      .eq('active', true)
      .order('type')
      .then(({ data }) => { setOrgs(data ?? []); setLoading(false) })
  }, [])

  const filtered = orgs.filter(o => {
    if (filter === 'all')   return true
    if (filter === 'money') return o.accepts_money && !o.accepts_items
    if (filter === 'items') return o.accepts_items
    return o.type === filter
  })

  return (
    <div style={{ maxWidth:720, margin:'0 auto', padding:'20px 20px 80px' }}>

      {/* HEADER */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:22, fontWeight:800, color:'#1A1714', marginBottom:4 }}>💰 Cómo ayudar</div>
        <div style={{ fontSize:13, color:'#9A9490' }}>
          Organizaciones verificadas · Fuente: sitios oficiales y medios acreditados
        </div>
      </div>

      {/* DISCLAIMER */}
      <div style={{ background:'#EBF0F8', border:'1px solid #BFDBFE', borderLeft:'4px solid #1B3A6B', borderRadius:8, padding:'12px 16px', marginBottom:20 }}>
        <div style={{ fontSize:12, color:'#1B3A6B', lineHeight:1.6 }}>
          ℹ️ <strong>Venezuela Connect no recibe ni gestiona dinero.</strong> Solo mostramos organizaciones verificadas. Dona directamente en sus sitios oficiales y verifica siempre el destino de tus fondos.
        </div>
      </div>

      {/* STATS */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:16 }}>
        {[
          [`${orgs.length}`,                                        'organizaciones',  '#1B3A6B','#EBF0F8','#BFDBFE'],
          [`${orgs.filter(o=>o.accepts_money).length}`,             'reciben dinero',  '#14532D','#F0FDF4','#BBF7D0'],
          [`${orgs.filter(o=>o.accepts_items).length}`,             'reciben insumos', '#92400E','#FFFBEB','#FDE68A'],
        ].map(([v,l,c,bg,border]) => (
          <div key={l} className="card" style={{ textAlign:'center', padding:'12px 8px', borderTop:`3px solid ${border}`, background:bg }}>
            <div style={{ fontSize:24, fontWeight:800, color:c }}>{loading ? '—' : v}</div>
            <div style={{ fontSize:11, color:c, fontWeight:600, marginTop:2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* FILTERS */}
      <div style={{ display:'flex', gap:8, marginBottom:20, overflowX:'auto', paddingBottom:4 }}>
        {FILTERS.map(([v,l]) => (
          <button key={v} onClick={() => setFilter(v)} className={`filter-btn ${filter===v?'active':''}`}>{l}</button>
        ))}
      </div>

      {/* LIST */}
      {loading ? (
        [1,2,3].map(i => <div key={i} className="card" style={{ height:140, marginBottom:12, opacity:0.3 }} />)
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {filtered.map(o => {
            const tc  = TYPE_CFG[o.type] ?? TYPE_CFG.ngo
            const flag = COUNTRY_FLAG[o.country] ?? '🌐'
            const isExp = expanded === o.id

            return (
              <div key={o.id} className="card">

                {/* TOP */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                  <div style={{ flex:1, paddingRight:8 }}>
                    <div style={{ fontWeight:800, fontSize:15, color:'#1A1714', marginBottom:4 }}>{o.name}</div>
                    <div style={{ display:'flex', gap:6, flexWrap:'wrap', alignItems:'center' }}>
                      <span style={{ background:tc.bg, color:tc.color, border:`1px solid ${tc.border}`, padding:'2px 8px', borderRadius:4, fontSize:10, fontWeight:700 }}>{tc.label}</span>
                      <span style={{ fontSize:12, color:'#9A9490' }}>{flag} {o.country}</span>
                      {o.verified && <VerifiedBadge small />}
                      {!o.campaign_active && (
                        <span style={{ background:'#F7F6F3', color:'#9A9490', border:'1px solid #E2DDD8', padding:'2px 8px', borderRadius:4, fontSize:10, fontWeight:700 }}>INACTIVA</span>
                      )}
                    </div>
                  </div>

                  {/* ACEPTA BADGES */}
                  <div style={{ display:'flex', flexDirection:'column', gap:4, flexShrink:0 }}>
                    {o.accepts_money && (
                      <span style={{ background:'#F0FDF4', color:'#14532D', border:'1px solid #BBF7D0', padding:'2px 8px', borderRadius:4, fontSize:10, fontWeight:700 }}>💰 DINERO</span>
                    )}
                    {o.accepts_items && (
                      <span style={{ background:'#FFFBEB', color:'#92400E', border:'1px solid #FDE68A', padding:'2px 8px', borderRadius:4, fontSize:10, fontWeight:700 }}>📦 INSUMOS</span>
                    )}
                  </div>
                </div>

                {/* DESCRIPCIÓN */}
                {o.description && (
                  <div style={{ fontSize:13, color:'#5C5650', lineHeight:1.6, marginBottom:10 }}>{o.description}</div>
                )}

                {/* INSUMOS ACEPTADOS */}
                {o.accepts_items && o.accepted_items && (
                  <div style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:6, padding:'8px 12px', marginBottom:10 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:'#92400E', marginBottom:4 }}>📦 Insumos aceptados</div>
                    <div style={{ fontSize:12, color:'#78350F', lineHeight:1.5 }}>{o.accepted_items}</div>
                  </div>
                )}

                {/* ACORDEÓN: MÉTODOS DE PAGO */}
                {o.payment_methods && (
                  <>
                    <div
                      onClick={() => setExpanded(isExp ? null : o.id)}
                      style={{ background:'#F7F6F3', border:'1px solid #E2DDD8', borderRadius:6, padding:'8px 12px', marginBottom: isExp ? 0 : 10, cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center' }}
                    >
                      <span style={{ fontSize:12, color:'#5C5650', fontWeight:600 }}>💳 Métodos de pago y datos bancarios</span>
                      <span style={{ fontSize:12, color:'#9A9490' }}>{isExp ? '▲' : '▼'}</span>
                    </div>
                    {isExp && (
                      <div style={{ background:'#F7F6F3', border:'1px solid #E2DDD8', borderTop:'none', borderRadius:'0 0 6px 6px', padding:'10px 12px', marginBottom:10 }}>
                        <div style={{ fontSize:13, color:'#5C5650', lineHeight:1.7, fontFamily:'monospace' }}>
                          {o.payment_methods.split(',').map((m: string, i: number) => (
                            <div key={i} style={{ padding:'3px 0', borderBottom:'1px solid #E2DDD8', fontFamily:'system-ui' }}>
                              · {m.trim()}
                            </div>
                          ))}
                        </div>
                        {o.registration_id && (
                          <div style={{ marginTop:8, fontSize:11, color:'#1B3A6B', fontWeight:600 }}>
                            📋 Registro: {o.registration_id}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* CONTACTO */}
                {(o.instagram || o.email || o.whatsapp) && (
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:10 }}>
                    {o.instagram && (
                      <span style={{ fontSize:12, color:'#9A9490' }}>📸 {o.instagram}</span>
                    )}
                    {o.email && (
                      <a href={`mailto:${o.email}`} style={{ fontSize:12, color:'#1B3A6B', textDecoration:'none', fontWeight:600 }}>
                        ✉️ {o.email}
                      </a>
                    )}
                    {o.whatsapp && (
                      <a href={`https://wa.me/${o.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" style={{ fontSize:12, color:'#16A34A', textDecoration:'none', fontWeight:600 }}>
                        💬 {o.whatsapp}
                      </a>
                    )}
                  </div>
                )}

                {/* NOTA */}
                {o.notes && (
                  <div style={{ fontSize:11, color:'#9A9490', lineHeight:1.5, marginBottom:10, fontStyle:'italic' }}>
                    ℹ️ {o.notes}
                  </div>
                )}

                {/* ACCIONES */}
                <div style={{ display:'flex', gap:8, paddingTop:10, borderTop:'1px solid #E2DDD8' }}>
                  {o.donation_url && (
                    <a href={o.donation_url} target="_blank" rel="noopener noreferrer" style={{ flex:1 }}>
                      <button className="btn-primary" style={{ width:'100%' }}>
                        {o.accepts_money ? '💚 Ir a donar' : '🔗 Ver más'} ↗
                      </button>
                    </a>
                  )}
                  {o.url && o.donation_url !== o.url && (
                    <a href={o.url} target="_blank" rel="noopener noreferrer">
                      <button className="btn-outline">Sitio oficial ↗</button>
                    </a>
                  )}
                  <button
                    className="btn-outline"
                    onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(
                      `💰 DONACIÓN VERIFICADA\n${o.name}\n${o.country} · ${TYPE_CFG[o.type]?.label}\n\n${o.description ?? ''}\n\n${o.donation_url ?? o.url ?? ''}\n\nVía Venezuela Connect`
                    )}`, '_blank')}
                  >📤</button>
                </div>
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div className="card" style={{ textAlign:'center', padding:40, color:'#9A9490' }}>
              <div style={{ fontSize:32, marginBottom:8 }}>🔍</div>
              <div>No hay organizaciones con ese filtro</div>
              <button className="btn-outline" style={{ marginTop:12 }} onClick={() => setFilter('all')}>Ver todas</button>
            </div>
          )}
        </div>
      )}

      {/* CÓMO VERIFICAR */}
      <div className="card" style={{ marginTop:20 }}>
        <div style={{ fontSize:14, fontWeight:700, color:'#1A1714', marginBottom:10 }}>
          ⚠️ Cómo verificar si una colecta es real
        </div>
        {[
          'Verifica que la organización tenga RIF, NIT o registro 501(c)(3) publicado',
          'Dona siempre directo al sitio oficial — desconfía de links en redes sociales',
          'Las organizaciones verificadas publican informes de uso de fondos',
          'Nunca envíes dinero a cuentas personales sin respaldo institucional',
          'Ante dudas, usa plataformas intermediarias como GlobalGiving o UN Crisis Relief',
        ].map((t,i) => (
          <div key={i} style={{ fontSize:12, color:'#5C5650', padding:'6px 0', borderBottom:'1px solid #E2DDD8', lineHeight:1.5 }}>
            ✓ {t}
          </div>
        ))}
      </div>
    </div>
  )
}
