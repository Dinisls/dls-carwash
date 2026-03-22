import { useState } from 'react'
import { uid } from '../utils'
import { STOCK_UNITS } from '../constants'
import { inputStyle, labelStyle, btnPrimary } from '../theme'
import ModalHeader from '../components/ModalHeader'

export default function AddStockModal({ onSave, onClose }) {
  const [name,   setName]   = useState('')
  const [qty,    setQty]    = useState('')
  const [unit,   setUnit]   = useState('L')
  const [minQty, setMinQty] = useState('')

  const handleSave = () => {
    if (!name.trim()) return alert('Insere o nome do produto')
    onSave({ id: uid(), name: name.trim(), qty: Number(qty) || 0, unit, minQty: Number(minQty) || 1 })
  }

  return (
    <div>
      <ModalHeader title="Novo Produto" onClose={onClose} />

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Nome *</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Champô auto" style={inputStyle} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 14 }}>
        <div>
          <label style={labelStyle}>Quantidade inicial</label>
          <input type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="0" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Unidade</label>
          <select value={unit} onChange={e => setUnit(e.target.value)} style={inputStyle}>
            {STOCK_UNITS.map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 22 }}>
        <label style={labelStyle}>Alerta abaixo de</label>
        <input type="number" value={minQty} onChange={e => setMinQty(e.target.value)} placeholder="Ex: 2" style={inputStyle} />
      </div>

      <button onClick={handleSave} style={btnPrimary}>Guardar Produto</button>
    </div>
  )
}
