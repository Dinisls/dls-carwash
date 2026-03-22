import { useState } from 'react'
import { uid } from '../utils'
import { accent, border, muted, inputStyle, labelStyle, btnPrimary } from '../theme'

export default function CarPicker({ client, selectedCarId, onSelect, onAddCar }) {
  const [addingCar, setAddingCar] = useState(false)
  const [newPlate, setNewPlate] = useState('')
  const [newModel, setNewModel] = useState('')

  const handleAdd = () => {
    if (!newPlate.trim() && !newModel.trim())
      return alert('Insere a matrícula ou modelo')
    const car = { id: uid(), plate: newPlate.toUpperCase().trim(), model: newModel.trim() }
    onAddCar(car)
    onSelect(car.id)
    setAddingCar(false)
    setNewPlate('')
    setNewModel('')
  }

  const carLabel = (car) => [car.plate, car.model].filter(Boolean).join(' · ') || 'Sem dados'

  return (
    <div style={{ marginBottom: 14 }}>
      <label style={labelStyle}>Carro</label>

      {client.cars.length > 0 && (
        <select
          value={selectedCarId}
          onChange={e => { onSelect(e.target.value); setAddingCar(false) }}
          style={{
            ...inputStyle, marginBottom: 8,
            appearance: 'none', WebkitAppearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%234a6683' d='M6 8L0 0h12z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 14px center',
            paddingRight: 36,
            cursor: 'pointer',
          }}
        >
          <option value="">— Selecionar carro —</option>
          {client.cars.map(car => (
            <option key={car.id} value={car.id}>{carLabel(car)}</option>
          ))}
        </select>
      )}

      {!addingCar ? (
        <button onClick={() => { setAddingCar(true); onSelect('') }} style={{
          width: '100%', padding: '10px', borderRadius: 10,
          border: `2px dashed ${border}`, background: 'transparent',
          color: muted, cursor: 'pointer', fontSize: 13, fontWeight: 600,
        }}>+ Adicionar outro carro</button>
      ) : (
        <div style={{ background: '#0d1f36', borderRadius: 10, padding: 12, border: `1px solid ${border}` }}>
          <div style={{ fontSize: 12, color: accent, fontWeight: 600, marginBottom: 10 }}>Novo carro</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <div>
              <label style={labelStyle}>Matrícula</label>
              <input value={newPlate} onChange={e => setNewPlate(e.target.value)} placeholder="AA-00-BB" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Modelo</label>
              <input value={newModel} onChange={e => setNewModel(e.target.value)} placeholder="Ex: BMW 320d" style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleAdd} style={{ ...btnPrimary, flex: 1, padding: '10px' }}>Guardar</button>
            <button onClick={() => setAddingCar(false)} style={{
              flex: 1, padding: '10px', borderRadius: 10, border: `1px solid ${border}`,
              background: 'transparent', color: muted, cursor: 'pointer', fontSize: 14,
            }}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  )
}
