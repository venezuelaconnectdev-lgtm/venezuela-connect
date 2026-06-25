import Link from 'next/link'

interface Props {
  title:       string
  value:       string | number
  status:      'normal' | 'warning' | 'danger' | 'info'
  icon:        string
  href:        string
  sub?:        string
}

const STATUS_COLORS = {
  normal:  { border: '#16A34A', value: '#86efac' },
  warning: { border: '#D97706', value: '#fde68a' },
  danger:  { border: '#DC2626', value: '#fca5a5' },
  info:    { border: '#3b82f6', value: '#93c5fd' },
}

export default function StatusCard({ title, value, status, icon, href, sub }: Props) {
  const c = STATUS_COLORS[status]
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{
        background: '#1E293B', border: '1px solid #334155', borderLeft: `3px solid ${c.border}`,
        borderRadius: 10, padding: 16, cursor: 'pointer', transition: 'background 0.15s',
      }}
        onMouseEnter={e => (e.currentTarget.style.background = '#243447')}
        onMouseLeave={e => (e.currentTarget.style.background = '#1E293B')}
      >
        <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
        <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: c.value, lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{sub}</div>}
      </div>
    </Link>
  )
}
