'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const PAISES = [
  { code: 'Venezuela', flag: '🇻🇪', label: 'Venezuela'  },
  { code: 'Colombia',  flag: '🇨🇴', label: 'Colombia'   },
  { code: 'Chile',     flag: '🇨🇱', label: 'Chile'      },
  { code: 'Ecuador',   flag: '🇪🇨', label: 'Ecuador'    },
  { code: 'Uruguay',   flag: '🇺🇾', label: 'Uruguay'    },
  { code: 'Panamá',    flag: '🇵🇦', label: 'Panamá'     },
  { code: 'España',    flag: '🇪🇸', label: 'España'     },
  { code: 'USA',       flag: '🇺🇸', label: 'EE.UU'      },
  { code: 'México',    flag: '🇲🇽', label: 'México'     },
  { code: 'Perú',      flag: '🇵🇪', label: 'Perú'       },
  { code: 'Argentina', flag: '🇦🇷', label: 'Argentina'  },
]

export default function DiasporaPage() {
  const [pais, setPais]       = useState('')
  const [puntos, setPuntos]   = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [filtro, setFiltro]   = useState('all')

  useEffect(() => {
    if (!pais) return
    setLoading(true)
    supabase
      .from('diaspora_resources')
      .select('*')
      .eq('country', pais)
      .eq('active', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setPuntos(data ?? [])
        setLoading(false)
        setFiltro('all')
      })
  }, [pais])

  const filtered = puntos.filter(p => filtro === 'all' || p.resource_type === filtro)
  const acopioCount = puntos.filter(p => p.resource_type === 'acopio').length
  const selectedFlag = PAISES.find(p => p.code === pais)?.flag ?? ''

  const typeLabel: Record<string, string> = {
    acopio: '📦 Centro de Acopio',
    donacion: '💰 Donación',
    voluntariado: '🤝 Voluntariado',
    informacion: 'ℹ️ Información',
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '20px 20px 80px' }}>

      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>🌎 Guía para la Diáspora</div>
      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>
        Puntos de acopio y recursos verificados por país
      </div>

      {/* SELECTOR DE PAÍS */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
          Selecciona tu país
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {PAISES.map(p => (
            <button
              key={p.code}
              onClick={() => setPais(p.code)}
              style={{
                background: pais === p.code ? '#3b82f6' : '#0F172A',
                color: pais === p.code ? '#fff' : '#94a3b8',
                border: `1px solid ${pais === p.code ? '#3b82f6' : '#334155'}`,
                borderRadius: 8, padding: '8px 12px',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <span>{p.flag}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CONTENIDO DEL PAÍS */}
      {pais && (
        <>
          {/* STATS */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <div className="card" style={{ flex: 1, textAlign: 'center', padding: '10px 8px' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#93c5fd' }}>{acopioCount}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>centros de acopio</div>
            </div>
            <div className="card" style={{ flex: 1, textAlign: 'center', padding: '10px 8px' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#86efac' }}>{puntos.length}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>recursos totales</div>
            </div>
          </div>

          {/* FILTROS */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto' }}>
            {[['all','Todos'],['acopio','Acopios'],['donacion','Donaciones'],['voluntariado','Voluntariado'],['informacion','Información']].map(([v,l]) => (
              <button key={v} onClick={() => setFiltro(v)}
                className={`filter-btn ${filtro === v ? 'active' : ''}`}
              >{l}</button>
            ))}
          </div>

          {/* LISTA */}
          {loading ? (
            [1,2,3].map(i => <div key={i} className="card" style={{ height: 100, marginBottom: 12, opacity: 0.4 }} />)
          ) : filtered.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{selectedFlag}</div>
              <div>No hay recursos registrados aún para {pais}</div>
              <div style={{ fontSize: 12, marginTop: 6 }}>Si conoces alguno, escríbenos para agregarlo</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filtered.map(p => {
                const isExpiring = p.expires_at && new Date(p.expires_at) > new Date()
                const isExpired  = p.expires_at && new Date(p.expires_at) < new Date()
                return (
                  <div key={p.id} className="card" style={{ opacity: isExpired ? 0.5 : 1 }}>

                    {/* HEADER */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{p.title}</div>
                        <span style={{ background: '#1e3a5f', color: '#93c5fd', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
                          {typeLabel[p.resource_type] ?? p.resource_type}
                        </span>
                      </div>
                      {isExpiring && (
                        <span style={{ background: '#78350f', color: '#fde68a', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, flexShrink: 0, marginLeft: 8 }}>
                          ⏰ TEMPORAL
                        </span>
                      )}
                      {isExpired && (
                        <span style={{ background: '#1e293b', color: '#64748b', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, flexShrink: 0, marginLeft: 8 }}>
                          FINALIZADO
                        </span>
                      )}
                    </div>

                    {/* DESCRIPCIÓN */}
                    <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, marginBottom: 10 }}>
                      {p.description}
                    </div>

                    {/* QUÉ RECIBEN */}
                    {p.accepted_items && (
                      <div style={{ background: '#14532d22', border: '1px solid #16A34A33', borderRadius: 6, padding: '8px 10px', marginBottom: 10 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#86efac', marginBottom: 4 }}>✅ Qué reciben</div>
                        <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>{p.accepted_items}</div>
                      </div>
                    )}

                    {/* VIGENCIA */}
                    {p.expires_at && (
                      <div style={{ fontSize: 11, color: '#fde68a', marginBottom: 10 }}>
                        ⏰ Válido hasta: {new Date(p.expires_at).toLocaleString('es', { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    )}

                    {/* ACCIONES */}
                    <div style={{ display: 'flex', gap: 8 }}>
                      {p.url && (
                        <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ flex: 1 }}>
                          <button className="btn-primary" style={{ width: '100%' }}>Ver más ↗</button>
                        </a>
                      )}
                      <button
                        className="btn-outline"
                        style={{ flex: p.url ? '0 0 auto' : 1 }}
                        onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`📦 PUNTO DE ACOPIO ${selectedFlag}\n${p.title}\n\n${p.description}\n\nVía Venezuela Connect`)}`, '_blank')}
                      >
                        📤 Compartir
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* ESTADO INICIAL */}
      {!pais && (
        <div className="card" style={{ textAlign: 'center', padding: 48, color: '#64748b' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🗺️</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Selecciona tu país arriba</div>
          <div style={{ fontSize: 13 }}>Mostramos puntos de acopio y recursos verificados por país</div>
        </div>
      )}

      {/* TIPS GENERALES */}
      <div className="card" style={{ marginTop: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>⚠️ Cómo verificar si una colecta es real</div>
        {[
          'Verifica que el punto tenga dirección física y horario confirmado',
          'Desconfía de cuentas personales sin respaldo institucional',
          'Busca el nombre de la organización en registros públicos',
          'Consulta siempre fuentes verificadas como Venezuela Connect',
        ].map((t, i) => (
          <div key={i} style={{ fontSize: 12, color: '#94a3b8', padding: '5px 0', borderBottom: '1px solid #1e293b', lineHeight: 1.5 }}>
            ✓ {t}
          </div>
        ))}
      </div>

      {/* SUGERIR */}
      <div className="card" style={{ marginTop: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>➕ ¿Conoces otro punto de acopio?</div>
        <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12 }}>
          Escríbenos para evaluarlo y agregarlo a la plataforma.
        </div>
        <a href="mailto:puntos@venezuelaconnect.org">
          <button className="btn-outline">✉️ Sugerir punto</button>
        </a>
      </div>
    </div>
  )
}
