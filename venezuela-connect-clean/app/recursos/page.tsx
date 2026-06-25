'use client'
import { useState } from 'react'

const RECURSOS = [
  {
    id: 1,
    categoria: 'busqueda',
    icon: '🔍',
    nombre: 'Venezuela Te Busca',
    descripcion: 'Plataforma para buscar y reportar personas desaparecidas o desconectadas en Venezuela. Permite publicar búsquedas con foto, nombre y última ubicación conocida.',
    url: 'https://venezuelatebusca.com/',
    como_usar: [
      'Entra al sitio y selecciona "Buscar persona" o "Reportar desaparecido"',
      'Ingresa el nombre completo y la última ubicación conocida',
      'Agrega una foto si es posible para facilitar la identificación',
      'Comparte el enlace de búsqueda por WhatsApp con familiares',
    ],
    tags: ['personas', 'búsqueda', 'desaparecidos', 'familias'],
    gratuito: true,
    verificado: true,
  },
  {
    id: 2,
    categoria: 'comunicacion',
    icon: '📱',
    nombre: 'Rebtel',
    descripcion: 'Servicio para recargar el saldo del celular de familiares en Venezuela desde el extranjero. Compatible con Movistar, Digitel y Movilnet. Sin necesidad de que el receptor tenga cuenta.',
    url: 'https://www.rebtel.com/es/',
    como_usar: [
      'Entra al sitio y selecciona el país: Venezuela',
      'Ingresa el número de teléfono del familiar a recargar',
      'Elige el monto de recarga y el operador (Movistar, Digitel, Movilnet)',
      'Paga con tarjeta de crédito o débito internacional',
      'La recarga llega en minutos directamente al celular',
    ],
    tags: ['recarga', 'celular', 'comunicación', 'diáspora', 'saldo'],
    gratuito: false,
    verificado: true,
    nota: 'Aplican tarifas de servicio según el país de origen del pago.',
  },
]

const CATEGORIAS = [
  { id: 'all',          label: 'Todos',          icon: '🌐' },
  { id: 'busqueda',     label: 'Búsqueda',       icon: '🔍' },
  { id: 'comunicacion', label: 'Comunicación',   icon: '📱' },
  { id: 'donacion',     label: 'Donaciones',     icon: '💰' },
  { id: 'informacion',  label: 'Información',    icon: '📰' },
]

export default function RecursosPage() {
  const [filtro, setFiltro]       = useState('all')
  const [expandido, setExpandido] = useState<number | null>(null)

  const filtrados = RECURSOS.filter(r => filtro === 'all' || r.categoria === filtro)

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '20px 20px 80px' }}>

      {/* HEADER */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>🌐 Recursos y Herramientas</div>
        <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>
          Sitios web y aplicaciones verificadas que están ayudando a venezolanos dentro y fuera del país.
        </div>
      </div>

      {/* AVISO */}
      <div style={{ background: '#1e3a5f33', border: '1px solid #1e3a5f', borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: 12, color: '#93c5fd', lineHeight: 1.5 }}>
        ℹ️ Venezuela Connect no tiene relación comercial con estos sitios. Los listamos porque consideramos que son útiles y confiables para la comunidad venezolana.
      </div>

      {/* FILTROS */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
        {CATEGORIAS.map(c => (
          <button
            key={c.id}
            onClick={() => setFiltro(c.id)}
            className={`filter-btn ${filtro === c.id ? 'active' : ''}`}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {/* CONTADOR */}
      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>
        {filtrados.length} recurso{filtrados.length !== 1 ? 's' : ''} disponible{filtrados.length !== 1 ? 's' : ''}
      </div>

      {/* LISTA */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtrados.map(r => (
          <div key={r.id} className="card">

            {/* TOP ROW */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ fontSize: 28, flexShrink: 0 }}>{r.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 4, alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: 15 }}>{r.nombre}</span>
                  {r.verificado && (
                    <span style={{ background: '#14532d', color: '#86efac', padding: '1px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
                      ✓ VERIFICADO
                    </span>
                  )}
                  {r.gratuito ? (
                    <span style={{ background: '#14532d33', color: '#86efac', padding: '1px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
                      GRATIS
                    </span>
                  ) : (
                    <span style={{ background: '#78350f33', color: '#fde68a', padding: '1px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
                      DE PAGO
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>{r.descripcion}</div>
              </div>
            </div>

            {/* TAGS */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {r.tags.map(t => (
                <span key={t} style={{ background: '#1e293b', border: '1px solid #334155', color: '#64748b', padding: '2px 8px', borderRadius: 20, fontSize: 11 }}>
                  #{t}
                </span>
              ))}
            </div>

            {/* NOTA */}
            {r.nota && (
              <div style={{ background: '#78350f22', border: '1px solid #d9770633', borderRadius: 6, padding: '6px 10px', fontSize: 11, color: '#fde68a', marginBottom: 10 }}>
                ⚠️ {r.nota}
              </div>
            )}

            {/* CÓMO USAR — acordeón */}
            <div
              style={{ borderTop: '1px solid #334155', paddingTop: 10, marginBottom: 10, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              onClick={() => setExpandido(expandido === r.id ? null : r.id)}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8' }}>📋 Cómo usar este recurso</span>
              <span style={{ color: '#64748b', fontSize: 14 }}>{expandido === r.id ? '▲' : '▼'}</span>
            </div>

            {expandido === r.id && (
              <div style={{ marginBottom: 12 }}>
                {r.como_usar.map((paso, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
                    <div style={{ background: '#1e3a5f', color: '#93c5fd', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>{paso}</div>
                  </div>
                ))}
              </div>
            )}

            {/* ACTIONS */}
            <div style={{ display: 'flex', gap: 8 }}>
              <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ flex: 1 }}>
                <button className="btn-primary" style={{ width: '100%' }}>
                  Ir al sitio ↗
                </button>
              </a>
              <button
                className="btn-outline"
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`🔗 Recurso útil: ${r.nombre}\n${r.descripcion}\n\n${r.url}\n\nVía Venezuela Connect`)}`, '_blank')}
              >
                📤 Compartir
              </button>
            </div>
          </div>
        ))}

        {filtrados.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
            <div>No hay recursos en esta categoría todavía</div>
            <div style={{ fontSize: 12, marginTop: 6 }}>¿Conoces uno? Escríbenos para agregarlo</div>
          </div>
        )}
      </div>

      {/* SUGERIR RECURSO */}
      <div style={{ marginTop: 24, background: '#1e293b', border: '1px solid #334155', borderRadius: 10, padding: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>➕ ¿Conoces otro recurso útil?</div>
        <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 14, lineHeight: 1.5 }}>
          Si conoces una plataforma, app o sitio web que esté ayudando a venezolanos, escríbenos para evaluarlo y agregarlo.
        </div>
        <a href="mailto:recursos@venezuelaconnect.org">
          <button className="btn-outline" style={{ fontSize: 13 }}>
            ✉️ Sugerir recurso
          </button>
        </a>
      </div>

    </div>
  )
}
