export default function VerifiedBadge({ small }: { small?: boolean }) {
  return (
    <span className="verified-badge" style={{ fontSize: small ? 9 : 11 }}>
      ✓ VERIFICADO
    </span>
  )
}
