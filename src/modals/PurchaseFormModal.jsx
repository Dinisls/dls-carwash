import { useState } from 'react'
import { uid, todayStr } from '../utils'
import { PURCHASE_CATEGORIES } from '../constants'
import { accent, border, muted, inputStyle, labelStyle, btnPrimary } from '../theme'
import ModalHeader from '../components/ModalHeader'
import ChipGroup   from '../components/ChipGroup'

export default function PurchaseFormModal({ onSave, onClose, initial }) {
  const isEdit = !!initial

  const [description, setDescription] = useState(initial?.description || '')
  const [supplier,    setSupplier]    = useState(initial?.supplier    || '')
  const [amount,      setAmount]      = useState(initial?.amount      ?? '')
  const [date,        setDate]        = useState(initial?.date        || todayStr())
  const [category,    setCategory]    = useState(initial?.category    || 'Produtos')
  const [paidBy,      setPaidBy]      = useState(initial?.paidBy      || 'Dinis')

  const handleSave = () => {
    if (!description.trim()) return alert('Insere a descrição')
    if (!amount)             return alert('Insere o valor')
    onSave({
      ...(initial || {}),
      id:          initial?.id || uid(),
      description: description.trim(),
      supplier,
      amount:      Number(amount),
      date,
      category,
      paidBy,
    })
  }

  return (
    <div>
      <ModalHeader title={isEdit ? 'Editar Despesa' : 'Nova Despesa'} onClose={onClose} />

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Descrição *</label>
        <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Ex: Champô auto 5L" style={inputStyle} />
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Fornecedor</label>
        <input value={supplier} onChange={e => setSupplier(e.target.value)} placeholder="Ex: Makro" style={inputStyle} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        <div>
          <label style={labelStyle}>Valor (€)</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} inputMode="decimal" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Data</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Categoria</label>
        <ChipGroup options={PURCHASE_CATEGORIES} value={category} onChange={setCategory} />
      </div>

      <div style={{ marginBottom: 22 }}>
        <label style={labelStyle}>Pago por</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {['Dinis', 'AFP'].map(entity => (
            <button key={entity} onClick={() => setPaidBy(entity)} style={{
              flex: 1, padding: '12px 10px', borderRadius: 10, cursor: 'pointer',
              border: `2px solid ${paidBy === entity ? accent : border}`,
              background: paidBy === entity ? `${accent}25` : '#0d1f36',
              color: paidBy === entity ? '#fff' : muted,
              fontSize: 14, fontWeight: 700, transition: 'all 0.15s',
            }}>
              {entity === 'Dinis' ? '👤 Dinis' : '🏢 AFP'}
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleSave} style={btnPrimary}>
        {isEdit ? 'Guardar Alterações' : 'Guardar Despesa'}
      </button>
    </div>
  )
}
