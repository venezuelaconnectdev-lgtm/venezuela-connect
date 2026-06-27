'use client'
import Link from 'next/link'
import { useLang } from '@/lib/i18n/LangContext'

interface Props {
  activeShelters:     number
  freePlaces:         number
  operativeHospitals: number
}

export default function QuickAccessCards({ activeShelters, freePlaces, operativeHospitals }: Props) {
  const { t } = useLang()
  const items = [
    { icon: '🏠', title: t.nav.shelters,   desc: `${activeShelters} ${t.home.active} · ${freePlaces} libres`, href: '/refugios',   color: '#1B3A6B' },
    { icon: '🏥', title: t.nav.hospitals,  desc: `${operativeHospitals} ${t.home.operative}`,                  href: '/hospitales', color: '#14532D' },
    { icon: '📢', title: t.nav.news,       desc: 'Fuentes verificadas',                                        href: '/noticias',   color: '#92400E' },
    { icon: '💰', title: t.nav.donate,     desc: 'ONGs verificadas',                                           href: '/donaciones', color: '#1B3A6B' },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
      {items.map(item => (
        <Link key={item.href} href={item.href} className="card-hover">
          <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#1A1714', marginBottom: 2 }}>{item.title}</div>
          <div style={{ fontSize: 12, color: item.color, fontWeight: 600 }}>{item.desc}</div>
        </Link>
      ))}
    </div>
  )
}
