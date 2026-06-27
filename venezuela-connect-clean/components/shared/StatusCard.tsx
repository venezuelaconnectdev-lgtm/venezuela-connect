import Link from 'next/link'

interface Props {
  title:  string; value: string | number
  status: 'normal' | 'warning' | 'danger' | 'info'
  icon:   string;  href: string; sub?: string
}
const COLORS = {
  normal:  { border: '#16A34A', value: '#14532D' },
  warning: { border: '#D97706', value: '#92400E' },
  danger:  { border: '#B91C1C', value: '#B91C1C' },
  info:    { border: '#1B3A6B', value: '#1B3A6B' },
}
export default function StatusCard({ title, value, status, icon, href, sub }: Props) {
  const c = COLORS[status]
  return (
    <Link href={href} className="card-status" style={{ borderLeft: `3px solid ${c.border}` }}>
      <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 11, color: '#9A9490', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{title}</div>
      <div className="stat-num" style={{ color: c.value }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#9A9490', marginTop: 2 }}>{sub}</div>}
    </Link>
  )
}
