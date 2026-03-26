import { useState } from 'react'
import { inputStyle, labelStyle, btnPrimary, border, muted, red, amber, text } from '../theme'
import ModalHeader from '../components/ModalHeader'

export default function AdjustStockModal({ item, onSave, onClose, onDelete }) {
  const [tab,    setTab]    = useState('remove')
  const [qty,    setQty]    = useState(item.qty)
  const [minQty, setMinQty] = useState(item.minQty)
  const [remove, setRemove] = useState('')

  const handleRemove = () => {
    const n = Number(remove)
    if (!n || n <= 0) return alert('Insere uma quantidade válida')
    onSave({ ...item, qty: Math.max(0, item.qty - n), minQty: item.minQty })
  }

  const TABS = [['remove', '− Remover'], ['edit', '✏️ Editar']]

  return (
    <div>
      <ModalHeader title={item.name} onClose={onClose} />

      {/* Tab selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        {TABS.map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            flex: 1, padding: '10px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600,
            border: `2px solid ${tab === id ? (id === 'remove' ? red : '#3b82f6') : border}`,
            background: tab === id ? (id === 'remove' ? `${red}20` : '#3b82f620') : '#0d1f36',
            color: tab === id ? '#fff' : muted, transition: 'all 0.15s',
          }}>{label}</button>
        ))}
      </div>

      {tab === 'remove' && (
        <>
          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <div style={{ fontSize: 11, color: muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Stock atual</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: item.qty <= item.minQty ? amber : text, fontFamily: "'DM Mono', monospace", marginTop: 4 }}>
              {item.qty} <span style={{ fontSize: 16 }}>{item.unit}</span>
            </div>
          </div>

          <div style={{ marginBottom: 22 }}>
            <label style={labelStyle}>Quantidade a remover ({item.unit})</label>
            <input
              type="number" value={remove} onChange={e => setRemove(e.target.value)}
              placeholder="Ex: 2" inputMode="decimal" style={inputStyle}
              autoFocus
            />
          </div>

          {remove > 0 && (
            <div style={{ textAlign: 'center', fontSize: 13, color: muted, marginBottom: 14 }}>
              Ficará com <span style={{ color: text, fontWeight: 700 }}>{Math.max(0, item.qty - Number(remove))} {item.unit}</span>
            </div>
          )}

          <button onClick={handleRemove} style={{ ...btnPrimary, background: red }}>
            Remover do Stock
          </button>
        </>
      )}

      {tab === 'edit' && (
        <>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Quantidade total ({item.unit})</label>
            <input type="number" value={qty} onChange={e => setQty(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ marginBottom: 22 }}>
            <label style={labelStyle}>Alerta mínimo ({item.unit})</label>
            <input type="number" value={minQty} onChange={e => setMinQty(e.target.value)} style={inputStyle} />
          </div>

          <button onClick={() => onSave({ ...item, qty: Number(qty), minQty: Number(minQty) })} style={{ ...btnPrimary, marginBottom: 10 }}>
            Guardar
          </button>
          <button onClick={() => { if (confirm('Apagar este item do stock permanentemente?')) onDelete(item.id) }} style={{
            width: '100%', padding: '13px', borderRadius: 10, border: `1px solid ${red}`,
            background: 'transparent', color: red, fontSize: 15, fontWeight: 600, cursor: 'pointer',
          }}>
            🗑 Apagar do Stock
          </button>
        </>
      )}
    </div>
  )
}
