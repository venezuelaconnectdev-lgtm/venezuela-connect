import { ALERT_LEVELS } from '@/lib/constants'

interface Props { level: 0 | 1 | 2 | 3; small?: boolean }

export default function RegionBadge({ level, small }: Props) {
  const a = ALERT_LEVELS[level]
  return (
    <span style={{
      background: a.bg, color: a.color, border: `1px solid ${a.color}44`,
      padding: small ? '1px 6px' : '3px 10px',
      borderRadius: 4, fontSize: small ? 10 : 12, fontWeight: 700, letterSpacing: '0.05em',
    }}>
      {a.label}
    </span>
  )
}
