import { useState } from 'react'
import { uid, todayStr } from '../utils'
import { red, muted, border, inputStyle, labelStyle, btnPrimary, btnDanger } from '../theme'
import ModalHeader   from '../components/ModalHeader'
import ConfirmDialog from '../components/ConfirmDialog'

export default function ClientFormModal({ onSave, onClose, onDelete, initial }) {
  const isEdit = !!initial

  const [confirm, setConfirm] = useState(false)
  const [name,    setName]    = useState(initial?.name  || '')
  const [phone,   setPhone]   = useState(initial?.phone || '')
  const [cars,    setCars]    = useState(
    initial?.cars?.length > 0
      ? initial.cars.map(c => ({ ...c }))
      : [{ id: uid(), plate: '', model: '' }]
  )

  const updateCar = (idx, field, val) =>
    setCars(cars.map((c, i) => i === idx ? { ...c, [field]: val } : c))

  const removeCar = (idx) =>
    setCars(cars.filter((_, i) => i !== idx))

  const handleSave = () => {
    if (!name.trim()) return alert('Insere o nome do cliente')
    const validCars = cars
      .map(c => ({ ...c, plate: c.plate.toUpperCase().trim() }))
      .filter(c => c.plate || c.model)
    onSave({
      ...(initial || {}),
      id:        initial?.id || uid(),
      name:      name.trim(),
      phone,
      cars:      validCars,
      createdAt: initial?.createdAt || todayStr(),
    })
  }

  return (
    <div>
      {confirm && (
        <ConfirmDialog
          message={`Apagar "${initial?.name}" e todo o seu historial?`}
          onConfirm={() => { onDelete(initial.id); setConfirm(false) }}
          onCancel={() => setConfirm(false)}
        />
      )}

      <ModalHeader title={isEdit ? 'Editar Cliente' : 'Novo Cliente'} onClose={onClose} />

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Nome *</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome completo" style={inputStyle} />
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Telefone</label>
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="9XX XXX XXX" inputMode="tel" style={inputStyle} />
      </div>

      <label style={labelStyle}>Carros</label>
      {cars.map((car, idx) => (
        <div key={car.id} style={{ marginBottom: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ ...labelStyle, marginBottom: 3 }}>Matrícula</label>
              <input value={car.plate} onChange={e => updateCar(idx, 'plate', e.target.value)} placeholder="AA-00-BB" style={inputStyle} />
            </div>
            <div>
              <label style={{ ...labelStyle, marginBottom: 3 }}>Modelo</label>
              <input value={car.model} onChange={e => updateCar(idx, 'model', e.target.value)} placeholder="Ex: BMW 320d" style={inputStyle} />
            </div>
          </div>
          {cars.length > 1 && (
            <button onClick={() => removeCar(idx)} style={{
              marginTop: 6, padding: '5px 12px', borderRadius: 6, border: `1px solid ${red}33`,
              background: 'transparent', color: red, cursor: 'pointer', fontSize: 12,
            }}>− Remover carro</button>
          )}
        </div>
      ))}

      <button onClick={() => setCars([...cars, { id: uid(), plate: '', model: '' }])} style={{
        width: '100%', padding: 10, borderRadius: 10, border: `2px dashed ${border}`,
        background: 'transparent', color: muted, cursor: 'pointer', fontSize: 13, fontWeight: 600, marginBottom: 22,
      }}>+ Adicionar outro carro</button>

      <button onClick={handleSave} style={{ ...btnPrimary, marginBottom: 10 }}>
        {isEdit ? 'Guardar Alterações' : 'Guardar Cliente'}
      </button>

      {isEdit && (
        <button onClick={() => setConfirm(true)} style={btnDanger}>
          Apagar Cliente
        </button>
      )}
    </div>
  )
}
