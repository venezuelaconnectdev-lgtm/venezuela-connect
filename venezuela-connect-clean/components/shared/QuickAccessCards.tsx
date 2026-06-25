import Link from 'next/link'

interface Props {
  activeShelters:     number
  freePlaces:         number
  operativeHospitals: number
}

export default function QuickAccessCards({ activeShelters, freePlaces, operativeHospitals }: Props) {
  const items = [
    { icon: '🏠', title: 'Refugios',   desc: `${activeShelters} activos · ${freePlaces} lugares libres`, href: '/refugios',   color: '#3b82f6' },
    { icon: '🏥', title: 'Hospitales', desc: `${operativeHospitals} operativos`,                          href: '/hospitales', color: '#16A34A' },
    { icon: '📢', title: 'Noticias',   desc: 'Solo fuentes verificadas',                                  href: '/noticias',   color: '#D97706' },
    { icon: '💰', title: 'Cómo donar', desc: 'Organizaciones verificadas',                                href: '/donaciones', color: '#8b5cf6' },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
      {items.map(item => (
        <Link key={item.href} href={item.href} className="card-hover">
          <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{item.title}</div>
          <div style={{ fontSize: 12, color: item.color, fontWeight: 600 }}>{item.desc}</div>
        </Link>
      ))}
    </div>
  )
}
