import { card, border, muted, red } from '../theme'

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div onClick={onCancel} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: card, border: `1px solid ${border}`, borderRadius: 16,
        padding: 24, width: '100%', maxWidth: 360,
      }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 8 }}>
          Tens a certeza?
        </div>
        <div style={{ fontSize: 14, color: muted, marginBottom: 24 }}>{message}</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '11px', borderRadius: 10, border: `1px solid ${border}`,
            background: 'transparent', color: muted, cursor: 'pointer', fontSize: 14, fontWeight: 600,
          }}>Cancelar</button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: '11px', borderRadius: 10, border: 'none',
            background: red, color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600,
          }}>Apagar</button>
        </div>
      </div>
    </div>
  )
}
