export default function VerifiedBadge({ small }: { small?: boolean }) {
  return (
    <span title="Información verificada por Venezuela Connect" style={{
      background: '#14532d', color: '#86efac',
      padding: small ? '1px 5px' : '2px 8px',
      borderRadius: 4, fontSize: small ? 9 : 11, fontWeight: 700,
    }}>
      ✓ VERIFICADO
    </span>
  )
}
