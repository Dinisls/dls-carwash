import { card, border } from '../theme'

export default function ModalOverlay({ children, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(6px)', zIndex: 50,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: card, borderRadius: '20px 20px 0 0', padding: '24px 20px',
        width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto',
        border: `1px solid ${border}`, borderBottom: 'none',
      }}>
        {children}
      </div>
    </div>
  )
}
