const CFG = {
  0: { bg: '#F0FDF4', color: '#14532D', border: '#BBF7D0', label: 'NORMAL'     },
  1: { bg: '#FFFBEB', color: '#92400E', border: '#FDE68A', label: 'ALERTA'     },
  2: { bg: '#FEF2F2', color: '#B91C1C', border: '#FECACA', label: 'EMERGENCIA' },
  3: { bg: '#FEF2F2', color: '#7F1D1D', border: '#FCA5A5', label: 'CATÁSTROFE' },
} as Record<number,{bg:string;color:string;border:string;label:string}>

export default function RegionBadge({ level, small }: { level: 0|1|2|3; small?: boolean }) {
  const c = CFG[level] ?? CFG[0]
  return (
    <span style={{
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      padding: small ? '1px 6px' : '3px 10px',
      borderRadius: 4, fontSize: small ? 10 : 12, fontWeight: 700, letterSpacing: '0.04em',
    }}>{c.label}</span>
  )
}
