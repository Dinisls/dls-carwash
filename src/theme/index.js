// ── Cores ─────────────────────────────────────────────────────────────────────
export const bg     = '#060d1a'
export const card   = '#0b1628'
export const border = '#1a3050'
export const accent = '#3b82f6'
export const amber  = '#f59e0b'
export const green  = '#22c55e'
export const red    = '#ef4444'
export const text   = '#dbeafe'
export const muted  = '#4a6683'
export const purple = '#a855f7'

// ── Estilos partilhados ───────────────────────────────────────────────────────
export const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  background: '#0d1f36',
  border: `1px solid ${border}`,
  borderRadius: 8,
  color: text,
  fontSize: 15,
  outline: 'none',
  boxSizing: 'border-box',
  WebkitAppearance: 'none',
}

export const labelStyle = {
  fontSize: 11,
  color: muted,
  marginBottom: 5,
  display: 'block',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  fontWeight: 600,
}

export const btnPrimary = {
  padding: '13px 20px',
  background: accent,
  border: 'none',
  borderRadius: 10,
  color: '#fff',
  fontSize: 15,
  fontWeight: 600,
  cursor: 'pointer',
  width: '100%',
}

export const btnDanger = {
  padding: '13px 20px',
  background: 'transparent',
  border: `1px solid ${red}`,
  borderRadius: 10,
  color: red,
  fontSize: 15,
  fontWeight: 600,
  cursor: 'pointer',
  width: '100%',
}

export const cardStyle = {
  background: card,
  border: `1px solid ${border}`,
  borderRadius: 12,
  padding: 16,
  marginBottom: 10,
}
