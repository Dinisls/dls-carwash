import { useState } from 'react'
import { uid, todayStr } from '../utils'
import { WASH_SERVICES } from '../constants'
import { accent, green, border, muted, text, inputStyle, labelStyle, btnPrimary } from '../theme'
import ModalHeader from '../components/ModalHeader'
import CarPicker   from '../components/CarPicker'

export default function WashFormModal({ clients, onSave, onClose, onUpdateClient, initial }) {
  const isEdit = !!initial

  // ── Cliente principal ──────────────────────────────────────────────────────
  const [clientMode, setClientMode] = useState(() => {
    if (isEdit) return initial.clientId ? 'existing' : 'quick'
    return clients.length > 0 ? 'existing' : 'new'
  })
  const [clientId,  setClientId]  = useState(initial?.clientId   || '')
  const [carId,     setCarId]     = useState(initial?.carId      || '')
  const [search,    setSearch]    = useState('')
  const [newName,   setNewName]   = useState('')
  const [newPhone,  setNewPhone]  = useState('')
  const [newPlate,  setNewPlate]  = useState('')
  const [newModel,  setNewModel]  = useState('')
  const [quickName, setQuickName] = useState(initial?.clientName || '')

  // ── 2º Cliente (dono do carro) ─────────────────────────────────────────────
  const [showClient2,    setShowClient2]    = useState(!!(initial?.client2Id || initial?.client2Name))
  const [client2Mode,    setClient2Mode]    = useState(() => {
    if (initial?.client2Id) return 'existing'
    if (initial?.client2Name) return 'quick'
    return 'existing'
  })
  const [client2Id,      setClient2Id]      = useState(initial?.client2Id   || '')
  const [client2Search,  setClient2Search]  = useState('')
  const [client2Quick,   setClient2Quick]   = useState(initial?.client2Name || '')
  const [c2NewName,      setC2NewName]      = useState('')
  const [c2NewPhone,     setC2NewPhone]     = useState('')

  // ── Lavagem ────────────────────────────────────────────────────────────────
  const [type,  setType]  = useState(initial?.type  || '')
  const [price, setPrice] = useState(initial?.price ?? '')
  const [date,  setDate]  = useState(initial?.date  || todayStr())
  const [notes, setNotes] = useState(initial?.notes || '')
  const [paidTo, setPaidTo] = useState(initial?.paidTo || 'Dinis')

  const [localClients, setLocalClients] = useState(clients)

  // ── Derived ────────────────────────────────────────────────────────────────
  const filteredClients = localClients.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.cars?.some(car => car.plate?.toLowerCase().includes(search.toLowerCase()))
  )
  const filtered2Clients = localClients.filter(c =>
    c.id !== clientId && (
      c.name?.toLowerCase().includes(client2Search.toLowerCase()) ||
      c.cars?.some(car => car.plate?.toLowerCase().includes(client2Search.toLowerCase()))
    )
  )
  const selectedClient = localClients.find(c => c.id === clientId)

  const handleAddCarToClient = (car) => {
    const updated = localClients.map(c =>
      c.id === clientId ? { ...c, cars: [...(c.cars || []), car] } : c
    )
    setLocalClients(updated)
    onUpdateClient(updated.find(c => c.id === clientId))
  }

  // ── Guardar ────────────────────────────────────────────────────────────────
  const handleSave = () => {
    if (!type) return alert('Seleciona o serviço')
    if (clientMode === 'existing' && !clientId)       return alert('Seleciona um cliente')
    if (clientMode === 'new'      && !newName.trim()) return alert('Insere o nome do cliente')
    if (clientMode === 'quick'    && !quickName.trim()) return alert('Insere um nome')

    // ── Cliente principal
    let saveClientId   = null
    let saveClientName = ''
    let saveCarId      = carId || null

    if (clientMode === 'new') {
      const newCars = (newPlate || newModel)
        ? [{ id: uid(), plate: newPlate.toUpperCase().trim(), model: newModel.trim() }]
        : []
      const nc = { id: uid(), name: newName.trim(), phone: newPhone, cars: newCars, createdAt: todayStr() }
      onUpdateClient(nc, true)
      saveClientId = nc.id
      saveCarId    = newCars[0]?.id || null
    } else if (clientMode === 'existing') {
      saveClientId = clientId
    } else {
      saveClientName = quickName
    }

    // ── 2º Cliente (dono do carro)
    let saveClient2Id   = null
    let saveClient2Name = ''

    if (showClient2) {
      // Obter o carro atual para copiar para o 2º cliente
      const currentCar = localClients
        .find(c => c.id === saveClientId)?.cars
        .find(c => c.id === saveCarId)

      if (client2Mode === 'existing' && client2Id) {
        saveClient2Id = client2Id
        // Adicionar o carro ao 2º cliente se ainda não existir
        if (currentCar) {
          const c2 = localClients.find(c => c.id === client2Id)
          if (c2 && !c2.cars?.find(c => c.id === currentCar.id)) {
            const updated = { ...c2, cars: [...(c2.cars || []), currentCar] }
            setLocalClients(prev => prev.map(c => c.id === client2Id ? updated : c))
            onUpdateClient(updated)
          }
        }
      } else if (client2Mode === 'new' && c2NewName.trim()) {
        const nc2 = {
          id: uid(), name: c2NewName.trim(), phone: c2NewPhone,
          cars: currentCar ? [currentCar] : [],
          createdAt: todayStr(),
        }
        onUpdateClient(nc2, true)
        saveClient2Id = nc2.id
      } else if (client2Mode === 'quick' && client2Quick.trim()) {
        saveClient2Name = client2Quick.trim()
      }
    }

    onSave({
      ...(initial || {}),
      id:           initial?.id || uid(),
      clientId:     saveClientId,
      clientName:   saveClientName,
      client2Id:    saveClient2Id,
      client2Name:  saveClient2Name,
      carId:        saveCarId,
      type, price: Number(price), date, notes, paidTo,
    })
  }

  const modeBtn = (id, label, icon) => (
    <button
      onClick={() => { setClientMode(id); setClientId(''); setCarId(''); setSearch('') }}
      style={{
        flex: 1, padding: '10px 6px', borderRadius: 10, cursor: 'pointer', textAlign: 'center',
        border: `2px solid ${clientMode === id ? accent : border}`,
        background: clientMode === id ? `${accent}20` : '#0d1f36',
        color: clientMode === id ? '#fff' : muted,
        fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
      }}
    >
      <div style={{ fontSize: 18, marginBottom: 3 }}>{icon}</div>
      {label}
    </button>
  )

  const c2ModeBtn = (id, label, icon) => (
    <button
      onClick={() => { setClient2Mode(id); setClient2Id(''); setClient2Search('') }}
      style={{
        flex: 1, padding: '8px 4px', borderRadius: 10, cursor: 'pointer', textAlign: 'center',
        border: `2px solid ${client2Mode === id ? accent : border}`,
        background: client2Mode === id ? `${accent}20` : '#0d1f36',
        color: client2Mode === id ? '#fff' : muted,
        fontSize: 11, fontWeight: 600, transition: 'all 0.15s',
      }}
    >
      <div style={{ fontSize: 16, marginBottom: 2 }}>{icon}</div>
      {label}
    </button>
  )

  return (
    <div>
      <ModalHeader title={isEdit ? 'Editar Lavagem' : 'Nova Lavagem'} onClose={onClose} />

      {/* ── Cliente principal ── */}
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Cliente (quem paga)</label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {modeBtn('existing', 'Existente',   '👤')}
          {modeBtn('new',      'Novo cliente', '➕')}
          {modeBtn('quick',    'Nome rápido',  '⚡')}
        </div>

        {clientMode === 'existing' && (
          <div>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Pesquisar por nome ou matrícula..."
              style={{ ...inputStyle, marginBottom: 8 }}
            />
            <div style={{ maxHeight: 160, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6, marginBottom: selectedClient ? 12 : 0 }}>
              {filteredClients.map(c => (
                <button key={c.id} onClick={() => { setClientId(c.id); setCarId('') }} style={{
                  padding: '10px 12px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                  border: `2px solid ${clientId === c.id ? accent : border}`,
                  background: clientId === c.id ? `${accent}20` : '#0d1f36',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: clientId === c.id ? '#fff' : text }}>{c.name}</div>
                    {c.cars?.length > 0 && (
                      <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>
                        {c.cars.map(car => car.plate || car.model).filter(Boolean).join(' · ')}
                      </div>
                    )}
                  </div>
                  {clientId === c.id && <span style={{ color: accent }}>✓</span>}
                </button>
              ))}
            </div>
            {selectedClient && (
              <CarPicker
                client={selectedClient}
                selectedCarId={carId}
                onSelect={setCarId}
                onAddCar={handleAddCarToClient}
              />
            )}
          </div>
        )}

        {clientMode === 'new' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <label style={labelStyle}>Nome *</label>
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nome completo" style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={labelStyle}>Matrícula</label>
                <input value={newPlate} onChange={e => setNewPlate(e.target.value)} placeholder="AA-00-BB" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Modelo</label>
                <input value={newModel} onChange={e => setNewModel(e.target.value)} placeholder="Ex: BMW 320d" style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Telefone</label>
              <input value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="9XX XXX XXX" inputMode="tel" style={inputStyle} />
            </div>
          </div>
        )}

        {clientMode === 'quick' && (
          <input value={quickName} onChange={e => setQuickName(e.target.value)} placeholder="Ex: João Silva" style={inputStyle} />
        )}
      </div>

      {/* ── 2º Cliente (dono do carro) ── */}
      <div style={{ marginBottom: 14 }}>
        {!showClient2 ? (
          <button onClick={() => setShowClient2(true)} style={{
            width: '100%', padding: '10px', borderRadius: 10,
            border: `2px dashed ${border}`, background: 'transparent',
            color: muted, cursor: 'pointer', fontSize: 13, fontWeight: 600,
          }}>+ Adicionar dono do carro</button>
        ) : (
          <div style={{ background: '#0a1628', border: `1px solid ${border}`, borderRadius: 12, padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Dono do carro</label>
              <button onClick={() => { setShowClient2(false); setClient2Id(''); setClient2Quick(''); setC2NewName('') }} style={{
                background: 'none', border: 'none', color: muted, cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: 2,
              }}>×</button>
            </div>

            <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
              {c2ModeBtn('existing', 'Existente', '👤')}
              {c2ModeBtn('new',      'Novo',      '➕')}
              {c2ModeBtn('quick',    'Nome rápido','⚡')}
            </div>

            {client2Mode === 'existing' && (
              <div>
                <input
                  value={client2Search} onChange={e => setClient2Search(e.target.value)}
                  placeholder="Pesquisar cliente..."
                  style={{ ...inputStyle, marginBottom: 8, fontSize: 13 }}
                />
                <div style={{ maxHeight: 140, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {filtered2Clients.map(c => (
                    <button key={c.id} onClick={() => setClient2Id(c.id)} style={{
                      padding: '9px 12px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                      border: `2px solid ${client2Id === c.id ? accent : border}`,
                      background: client2Id === c.id ? `${accent}20` : '#0d1f36',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: client2Id === c.id ? '#fff' : text }}>{c.name}</div>
                        {c.phone && <div style={{ fontSize: 11, color: muted }}>{c.phone}</div>}
                      </div>
                      {client2Id === c.id && <span style={{ color: accent }}>✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {client2Mode === 'new' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div>
                  <label style={labelStyle}>Nome *</label>
                  <input value={c2NewName} onChange={e => setC2NewName(e.target.value)} placeholder="Nome completo" style={{ ...inputStyle, fontSize: 13 }} />
                </div>
                <div>
                  <label style={labelStyle}>Telefone</label>
                  <input value={c2NewPhone} onChange={e => setC2NewPhone(e.target.value)} placeholder="9XX XXX XXX" inputMode="tel" style={{ ...inputStyle, fontSize: 13 }} />
                </div>
                <div style={{ fontSize: 11, color: muted, fontStyle: 'italic' }}>
                  O carro selecionado será associado a este cliente.
                </div>
              </div>
            )}

            {client2Mode === 'quick' && (
              <input value={client2Quick} onChange={e => setClient2Quick(e.target.value)} placeholder="Ex: João Silva" style={{ ...inputStyle, fontSize: 13 }} />
            )}
          </div>
        )}
      </div>

      {/* ── Serviço ── */}
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Serviço</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {WASH_SERVICES.map((s, i) => {
            const selected = type === s.name
            const isLast   = i === WASH_SERVICES.length - 1
            const isOdd    = WASH_SERVICES.length % 2 !== 0
            return (
              <button key={s.name} onClick={() => { setType(s.name); setPrice(s.price) }} style={{
                padding: '12px 10px', borderRadius: 10, cursor: 'pointer', textAlign: 'center',
                border:      `2px solid ${selected ? accent : border}`,
                background:  selected ? `${accent}25` : '#0d1f36',
                gridColumn:  (isLast && isOdd) ? 'span 2' : undefined,
                transition: 'all 0.15s',
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: selected ? '#fff' : text, marginBottom: 4, lineHeight: 1.3 }}>
                  {s.name}
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "'DM Mono', monospace", color: selected ? accent : green }}>
                  {s.price > 0 ? `${s.price.toFixed(2).replace('.', ',')}€` : '—'}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Preço / Data ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        <div>
          <label style={labelStyle}>Preço (€)</label>
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Data</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Notas</label>
        <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Opcional" style={inputStyle} />
      </div>

      {/* ── Pago a ── */}
      <div style={{ marginBottom: 22 }}>
        <label style={labelStyle}>Pago a</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {['Dinis', 'AFP'].map(entity => (
            <button key={entity} onClick={() => setPaidTo(entity)} style={{
              flex: 1, padding: '12px 10px', borderRadius: 10, cursor: 'pointer',
              border: `2px solid ${paidTo === entity ? accent : border}`,
              background: paidTo === entity ? `${accent}25` : '#0d1f36',
              color: paidTo === entity ? '#fff' : muted,
              fontSize: 14, fontWeight: 700, transition: 'all 0.15s',
            }}>
              {entity === 'Dinis' ? '👤 Dinis' : '🏢 AFP'}
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleSave} style={btnPrimary}>
        {isEdit ? 'Guardar Alterações' : 'Guardar Lavagem'}
      </button>
    </div>
  )
}
