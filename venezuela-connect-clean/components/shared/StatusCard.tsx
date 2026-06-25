import Link from 'next/link'

interface Props {
  title:  string
  value:  string | number
  status: 'normal' | 'warning' | 'danger' | 'info'
  icon:   string
  href:   string
  sub?:   string
}

const COLORS = {
  normal:  { border: '#16A34A', value: '#86efac' },
  warning: { border: '#D97706', value: '#fde68a' },
  danger:  { border: '#DC2626', value: '#fca5a5' },
  info:    { border: '#3b82f6', value: '#93c5fd' },
}

export default function StatusCard({ title, value, status, icon, href, sub }: Props) {
  const c = COLORS[status]
  return (
    <Link href={href} className="card-status" style={{ borderLeft: `3px solid ${c.border}` }}>
      <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: c.value, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{sub}</div>}
    </Link>
  )
}
