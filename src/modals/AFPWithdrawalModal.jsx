import { useState } from 'react'
import { uid, todayStr } from '../utils'
import { inputStyle, labelStyle, btnPrimary } from '../theme'
import ModalHeader from '../components/ModalHeader'

export default function AFPWithdrawalModal({ onSave, onClose }) {
  const [amount, setAmount] = useState('')
  const [date,   setDate]   = useState(todayStr())
  const [notes,  setNotes]  = useState('')

  const handleSave = () => {
    if (!amount || Number(amount) <= 0) return alert('Insere um valor válido')
    onSave({ id: uid(), amount: Number(amount), date, notes })
  }

  return (
    <div>
      <ModalHeader title="Levantar Dinheiro AFP" onClose={onClose} />

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Valor (€)</label>
        <input
          type="number" value={amount} onChange={e => setAmount(e.target.value)}
          placeholder="0,00" inputMode="decimal" style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Data</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
      </div>

      <div style={{ marginBottom: 22 }}>
        <label style={labelStyle}>Notas</label>
        <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Opcional" style={inputStyle} />
      </div>

      <button onClick={handleSave} style={btnPrimary}>Confirmar Levantamento</button>
    </div>
  )
}
