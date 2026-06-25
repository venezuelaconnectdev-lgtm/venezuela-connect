'use client'
import { useState } from 'react'
import { DIASPORA_COUNTRIES } from '@/lib/constants'

const GUIDES: Record<string, { tips: string[], apps: string[], orgs: string[], consulate: string }> = {
  Chile:    { tips:['Red de venezolanos en Stgo tiene centros de acopio activos','La Cruz Roja Chile acepta donaciones en especie'], apps:['WhatsApp','Telegram','Signal'], orgs:['Venezolanos en Chile A.C.','Cruz Roja Chilena'], consulate:'Consulado VE en Santiago: +56 2 2223-8166' },
  Colombia: { tips:['Desde Cúcuta hay pasos para enviar ayuda directa','Coordinación activa en la frontera'], apps:['WhatsApp','Telegram'], orgs:['ACNUR Colombia','Cruz Roja Colombiana'], consulate:'Consulado VE en Bogotá: +57 1 640-2900' },
  España:   { tips:['Redes venezolanas en Madrid y Barcelona activas','Correos España tiene tarifas especiales para paquetes humanitarios'], apps:['WhatsApp','Telegram','Signal'], orgs:['CEAR','Cruz Roja Española'], consulate:'Embajada VE en Madrid: +34 91 598-1100' },
  USA:      { tips:['Zelle es el método más rápido y sin comisión para enviar dinero','Comunidades venezolanas en Miami, Houston y NYC muy organizadas'], apps:['WhatsApp','Zelle','Cash App'], orgs:['VENUSA','Venezuelan American Caucus'], consulate:'Embajada VE en Washington: +1 202 342-2214' },
  Perú:     { tips:['ACNUR Perú coordina asistencia para venezolanos y desde Perú','Lima tiene comunidad venezolana muy activa'], apps:['WhatsApp','Telegram'], orgs:['ACNUR Perú','Cáritas Perú'], consulate:'Consulado VE en Lima: +51 1 442-4238' },
}

export default function DiasporaPage() {
  const [selected, setSelected] = useState('')
  const guide = selected ? GUIDES[selected] : null

  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'20px 20px 80px' }}>
      <div style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>🌎 Guía para la Diáspora</div>
      <div style={{ fontSize:13, color:'#64748b', marginBottom:20 }}>Cómo ayudar a Venezuela desde tu país</div>

      {/* COUNTRY SELECTOR */}
      <div className="card" style={{ marginBottom:20 }}>
        <div style={{ fontSize:13, fontWeight:700, marginBottom:12, color:'#94a3b8' }}>¿Desde qué país quieres ayudar?</div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {DIASPORA_COUNTRIES.map(c => (
            <button key={c} onClick={() => setSelected(c)} style={{
              background:selected===c?'#3b82f6':'#1e293b', color:selected===c?'#fff':'#94a3b8',
              border:`1px solid ${selected===c?'#3b82f6':'#334155'}`, borderRadius:8,
              padding:'8px 14px', fontSize:13, fontWeight:600, cursor:'pointer',
            }}>{c}</button>
          ))}
        </div>
      </div>

      {guide ? (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <div className="card">
            <div style={{ fontSize:15, fontWeight:700, marginBottom:10 }}>💡 Tips clave para {selected}</div>
            {guide.tips.map((t,i) => <div key={i} style={{ fontSize:13, color:'#94a3b8', padding:'6px 0', borderBottom:'1px solid #334155', lineHeight:1.5 }}>• {t}</div>)}
          </div>
          <div className="card">
            <div style={{ fontSize:15, fontWeight:700, marginBottom:10 }}>📱 Apps que funcionan con poca señal</div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {guide.apps.map(a => <span key={a} style={{ background:'#1e293b', border:'1px solid #334155', borderRadius:6, padding:'4px 10px', fontSize:12, fontWeight:600 }}>{a}</span>)}
            </div>
          </div>
          <div className="card">
            <div style={{ fontSize:15, fontWeight:700, marginBottom:10 }}>🤝 Organizaciones en {selected}</div>
            {guide.orgs.map(o => <div key={o} style={{ fontSize:13, color:'#94a3b8', padding:'4px 0' }}>• {o}</div>)}
          </div>
          <div className="card" style={{ background:'#1e3a5f22', border:'1px solid #1e3a5f' }}>
            <div style={{ fontSize:12, color:'#93c5fd' }}>📞 {guide.consulate}</div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign:'center', padding:40, color:'#64748b' }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🗺️</div>
          <div style={{ fontSize:15, marginBottom:8 }}>Selecciona tu país arriba</div>
          <div style={{ fontSize:13 }}>Te mostraremos una guía personalizada</div>
        </div>
      )}

      {/* GENERAL TIPS */}
      <div className="card" style={{ marginTop:12 }}>
        <div style={{ fontSize:15, fontWeight:700, marginBottom:10 }}>⚠️ Cómo verificar si una colecta es real</div>
        {['Verifica que la ONG tenga RIF venezolano o registro oficial en su país','Desconfía de cuentas personales sin respaldo institucional','Busca el nombre de la organización en Supabase o registros públicos','Consulta siempre en fuentes verificadas como Venezuela Connect'].map((t,i) => (
          <div key={i} style={{ fontSize:12, color:'#94a3b8', padding:'5px 0', lineHeight:1.5 }}>✓ {t}</div>
        ))}
      </div>
    </div>
  )
}
