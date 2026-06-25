'use client'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { NewsItem } from '@/lib/types'
import { SOURCE_STYLES } from '@/lib/constants'

export default function NoticiasPage() {
  const [news, setNews]         = useState<NewsItem[]>([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('all')
  const [newCount, setNewCount] = useState(0)

  const fetchNews = useCallback(async (isRefresh = false) => {
    const { data } = await supabase.from('news').select('*, regions(name)').order('priority', { ascending: false }).order('created_at', { ascending: false }).limit(30)
    if (isRefresh && data && news.length > 0) {
      const fresh = data.filter(n => !news.find(o => o.id === n.id))
      if (fresh.length > 0) setNewCount(fresh.length)
    } else {
      setNews(data ?? [])
      setLoading(false)
    }
  }, [news])

  useEffect(() => { fetchNews() }, [])
  useEffect(() => {
    const t = setInterval(() => fetchNews(true), 60000)
    return () => clearInterval(t)
  }, [fetchNews])

  const filtered = news.filter(n => filter === 'all' || n.source_type === filter)
  const urgent   = news.filter(n => n.priority === 2)

  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'20px 20px 80px' }}>
      <div style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>📢 Noticias verificadas</div>

      <div style={{ background:'#1e293b', border:'1px solid #334155', borderRadius:8, padding:'10px 14px', fontSize:12, color:'#94a3b8', marginBottom:16, lineHeight:1.5 }}>
        ✅ Solo publicamos información de <strong style={{ color:'#F1F5F9' }}>fuentes oficiales verificadas</strong>. No compartas información sin verificar.
      </div>

      {/* URGENT BANNER */}
      {urgent.length > 0 && (
        <div style={{ background:'#7f1d1d', border:'1px solid #dc262655', borderRadius:8, padding:'10px 14px', marginBottom:16 }}>
          <div style={{ fontSize:11, fontWeight:700, color:'#fca5a5', marginBottom:4 }}>🔴 {urgent.length} ALERTA(S) URGENTE(S)</div>
          {urgent.map(n => (
            <div key={n.id} style={{ fontSize:13, color:'#fecaca', lineHeight:1.4, marginBottom:4 }}>· {n.title}</div>
          ))}
        </div>
      )}

      {/* NEW COUNT TOAST */}
      {newCount > 0 && (
        <div onClick={() => { fetchNews(); setNewCount(0) }} style={{ background:'#1d4ed8', borderRadius:8, padding:'10px 14px', marginBottom:16, cursor:'pointer', fontSize:13, fontWeight:600 }}>
          🔄 {newCount} noticias nuevas · Toca para actualizar
        </div>
      )}

      {/* FILTERS */}
      <div style={{ display:'flex', gap:8, marginBottom:16, overflowX:'auto' }}>
        {[['all','Todas'],['gov','Gobierno'],['ngo','ONG'],['un','ONU'],['media','Medios']].map(([v,l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{
            background:filter===v?'#3b82f6':'#1e293b', color:filter===v?'#fff':'#94a3b8',
            border:`1px solid ${filter===v?'#3b82f6':'#334155'}`, borderRadius:20,
            padding:'6px 14px', fontSize:12, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap',
          }}>{l}</button>
        ))}
      </div>

      {loading ? (
        [1,2,3,4].map(i => <div key={i} className="card" style={{ height:110, marginBottom:10, opacity:0.4 }} />)
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {filtered.map(n => {
            const src = SOURCE_STYLES[n.source_type as keyof typeof SOURCE_STYLES]
            return (
              <div key={n.id} className="card">
                <div style={{ display:'flex', gap:6, marginBottom:8, flexWrap:'wrap' }}>
                  <span style={{ background:src.bg, color:src.color, padding:'2px 8px', borderRadius:4, fontSize:10, fontWeight:700 }}>{src.label}</span>
                  {n.priority === 2 && <span style={{ background:'#7f1d1d', color:'#fca5a5', padding:'2px 8px', borderRadius:4, fontSize:10, fontWeight:700 }}>🔴 URGENTE</span>}
                  {n.priority === 1 && <span style={{ background:'#78350f', color:'#fde68a', padding:'2px 8px', borderRadius:4, fontSize:10, fontWeight:700 }}>⚠️ IMPORTANTE</span>}
                  {n.regions && <span style={{ background:'#1e3a5f', color:'#93c5fd', padding:'2px 8px', borderRadius:4, fontSize:10, fontWeight:700 }}>{(n.regions as any).name}</span>}
                </div>
                <div style={{ fontWeight:700, fontSize:14, marginBottom:4, lineHeight:1.4 }}>{n.title}</div>
                {n.summary && <div style={{ fontSize:12, color:'#94a3b8', marginBottom:8, lineHeight:1.5 }}>{n.summary}</div>}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ fontSize:11, color:'#64748b' }}>{n.source} · {new Date(n.created_at).toLocaleDateString('es-VE')}</div>
                  {n.url && (
                    <a href={n.url} target="_blank" rel="noopener noreferrer" style={{ fontSize:12, color:'#3b82f6', fontWeight:600, textDecoration:'none' }}>
                      Leer nota ↗
                    </a>
                  )}
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div className="card" style={{ textAlign:'center', padding:40, color:'#64748b' }}>
              <div style={{ fontSize:32, marginBottom:8 }}>📰</div>
              <div>No hay noticias de esta fuente aún</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
