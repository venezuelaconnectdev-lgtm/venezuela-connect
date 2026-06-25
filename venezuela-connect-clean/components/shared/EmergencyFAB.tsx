'use client'
import { useState } from 'react'
import { EMERGENCY_NUMBERS } from '@/lib/constants'

export default function EmergencyFAB() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        aria-label="¿Qué hago ahora? Guía de emergencia"
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed', bottom: 24, right: 20,
          background: '#DC2626', color: '#fff', border: 'none', borderRadius: '50%',
          width: 56, height: 56, fontSize: 22, cursor: 'pointer', zIndex: 200,
          boxShadow: '0 0 24px #DC262666', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >⚠️</button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, background: '#000000bb', zIndex: 300, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
        >
          <div onClick={e => e.stopPropagation()} style={{ background: '#1e293b', borderRadius: '16px 16px 0 0', padding: 24, width: '100%', maxWidth: 500 }}>
            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>⚠️ ¿Qué hago ahora?</div>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 20 }}>Guía rápida de emergencia</div>

            {[
              { n:'1', title:'Mantén la calma',          desc:'Aléjate de zonas de riesgo. Sigue instrucciones oficiales.',          color:'#16A34A' },
              { n:'2', title:'Busca un refugio cercano', desc:'Consulta la sección Refugios para encontrar el más próximo.',          color:'#3b82f6' },
              { n:'3', title:'Llama a emergencias',      desc:'Protección Civil: 0800-776-8324 · Cruz Roja: 0800-272-5572',          color:'#D97706' },
              { n:'4', title:'Avisa a tu familia',       desc:'Comparte tu ubicación. Usa WhatsApp o Telegram con poca señal.',       color:'#8b5cf6' },
              { n:'5', title:'Solo fuentes verificadas', desc:'No compartas info sin verificar. Revisa la sección Noticias.',         color:'#64748b' },
            ].map(s => (
              <div key={s.n} style={{ display:'flex', gap:12, marginBottom:14, alignItems:'flex-start' }}>
                <div style={{ background:`${s.color}33`, color:s.color, borderRadius:'50%', width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:13, flexShrink:0 }}>{s.n}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:13 }}>{s.title}</div>
                  <div style={{ fontSize:12, color:'#94a3b8', marginTop:2 }}>{s.desc}</div>
                </div>
              </div>
            ))}

            <div style={{ borderTop:'1px solid #334155', paddingTop:14, marginTop:4 }}>
              <div style={{ fontSize:11, color:'#64748b', fontWeight:600, marginBottom:8 }}>NÚMEROS DE EMERGENCIA</div>
              {EMERGENCY_NUMBERS.map(e => (
                <a key={e.number} href={`tel:${e.number}`} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', textDecoration:'none' }}>
                  <span style={{ fontSize:12, color:'#94a3b8' }}>{e.label}</span>
                  <span style={{ fontSize:12, color:'#3b82f6', fontWeight:700 }}>{e.number}</span>
                </a>
              ))}
            </div>

            <button onClick={() => setOpen(false)} className="btn-primary" style={{ width:'100%', marginTop:16, justifyContent:'center' }}>
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  )
}
