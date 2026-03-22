import { useState } from 'react'
import { inputStyle, labelStyle, btnPrimary } from '../theme'
import ModalHeader from '../components/ModalHeader'

export default function AdjustStockModal({ item, onSave, onClose }) {
  const [qty,    setQty]    = useState(item.qty)
  const [minQty, setMinQty] = useState(item.minQty)

  return (
    <div>
      <ModalHeader title={item.name} onClose={onClose} />

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Quantidade atual ({item.unit})</label>
        <input type="number" value={qty} onChange={e => setQty(e.target.value)} style={inputStyle} />
      </div>

      <div style={{ marginBottom: 22 }}>
        <label style={labelStyle}>Alerta mínimo ({item.unit})</label>
        <input type="number" value={minQty} onChange={e => setMinQty(e.target.value)} style={inputStyle} />
      </div>

      <button onClick={() => onSave({ ...item, qty: Number(qty), minQty: Number(minQty) })} style={btnPrimary}>
        Atualizar Stock
      </button>
    </div>
  )
}
