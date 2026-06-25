export const ALERT_LEVELS = {
  0: { label: 'NORMAL',      color: '#16A34A', bg: '#14532d33', textColor: '#86efac' },
  1: { label: 'ALERTA',      color: '#D97706', bg: '#78350f33', textColor: '#fde68a' },
  2: { label: 'EMERGENCIA',  color: '#EA580C', bg: '#7c2d1233', textColor: '#fed7aa' },
  3: { label: 'CATÁSTROFE',  color: '#DC2626', bg: '#7f1d1d33', textColor: '#fca5a5' },
} as const

export const SERVICE_STATUS = {
  normal:       { dot: '🟢', color: '#16A34A', label: 'Normal'       },
  intermitente: { dot: '🟡', color: '#D97706', label: 'Intermitente' },
  sin_servicio: { dot: '🔴', color: '#DC2626', label: 'Sin servicio' },
  operativo:    { dot: '🟢', color: '#16A34A', label: 'Operativo'    },
  critico:      { dot: '🟡', color: '#D97706', label: 'Crítico'      },
  colapsado:    { dot: '🔴', color: '#DC2626', label: 'Colapsado'    },
  racionado:    { dot: '🟡', color: '#D97706', label: 'Racionado'    },
  activo:       { dot: '🟢', color: '#16A34A', label: 'Activo'       },
  parcial:      { dot: '🟡', color: '#D97706', label: 'Parcial'      },
  cerrado:      { dot: '🔴', color: '#DC2626', label: 'Cerrado'      },
  lleno:        { dot: '🟠', color: '#EA580C', label: 'Lleno'        },
} as const

export const SOURCE_STYLES = {
  gov:   { bg: '#1e3a5f', color: '#93c5fd', label: 'GOB'   },
  ngo:   { bg: '#7f1d1d', color: '#fca5a5', label: 'ONG'   },
  un:    { bg: '#0c4a6e', color: '#7dd3fc', label: 'ONU'   },
  media: { bg: '#1e293b', color: '#94a3b8', label: 'MEDIO' },
} as const

export const EMERGENCY_NUMBERS = [
  { label: 'Protección Civil',    number: '0800-776-8324', country: 'VE' },
  { label: 'Cruz Roja Venezolana',number: '0800-272-5572', country: 'VE' },
  { label: 'Bomberos',            number: '171',           country: 'VE' },
  { label: 'Defensa Civil',       number: '0800-333-3662', country: 'VE' },
]

export const DIASPORA_COUNTRIES = ['Chile','Colombia','España','USA','Perú','Argentina','Ecuador','Panamá','Trinidad','Brasil']
