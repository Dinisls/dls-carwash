import { muted } from '../theme'

export default function ModalHeader({ title, onClose }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', marginBottom: 22,
    }}>
      <div style={{
        fontFamily: "'Syne', sans-serif", fontSize: 20,
        fontWeight: 700, color: '#fff',
      }}>{title}</div>
      <button onClick={onClose} style={{
        background: 'none', border: 'none', color: muted,
        fontSize: 28, cursor: 'pointer', lineHeight: 1, padding: 0,
      }}>×</button>
    </div>
  )
}
