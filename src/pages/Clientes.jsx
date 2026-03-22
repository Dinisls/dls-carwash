import { useState } from 'react'
import { fmtMoney, fmtDate } from '../utils'
import { accent, green, muted, border, text, cardStyle, btnPrimary, inputStyle } from '../theme'

export default function Clientes({ clients, washes, setModal }) {
  const [search, setSearch] = useState('')

  const filtered = clients.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search) ||
    c.cars?.some(car => car.plate?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Pesquisar por nome ou matrícula..."
        style={{ ...inputStyle, marginBottom: 12 }}
      />

      <button onClick={() => setModal({ type: 'addClient' })} style={{ ...btnPrimary, marginBottom: 14 }}>
        + Novo Cliente
      </button>

      <div style={{ fontSize: 12, color: muted, marginBottom: 10 }}>
        {filtered.length} cliente{filtered.length !== 1 ? 's' : ''}
      </div>

      {filtered.map(c => {
        const cWashes  = washes.filter(w => w.clientId === c.id)
        const total    = cWashes.reduce((s, w) => s + (Number(w.price) || 0), 0)
        const lastWash = cWashes[0]
        return (
          <div key={c.id} style={cardStyle}>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, cursor: 'pointer' }}
              onClick={() => setModal({ type: 'viewClient', data: c })}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{c.name}</div>
                <div style={{ fontSize: 12, color: muted, marginTop: 4, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {c.cars?.filter(car => car.plate).map(car => (
                    <span key={car.id} style={{ background: '#1a3050', padding: '2px 8px', borderRadius: 4 }}>{car.plate}</span>
                  ))}
                  {c.phone && <span>📞 {c.phone}</span>}
                </div>
                <div style={{ fontSize: 11, color: muted, marginTop: 4 }}>
                  {c.cars?.length > 0 ? `${c.cars.length} carro${c.cars.length !== 1 ? 's' : ''}` : 'Sem carros'}
                  {lastWash && ` · Última: ${fmtDate(lastWash.date)}`}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: accent }}>{cWashes.length} lav.</div>
                <div style={{ fontSize: 13, color: green, fontWeight: 600 }}>{fmtMoney(total)}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: `1px solid ${border}` }}>
              <button onClick={() => setModal({ type: 'editClient', data: c })} style={{
                flex: 1, padding: '8px', borderRadius: 8, border: `1px solid ${border}`,
                background: 'transparent', color: text, cursor: 'pointer', fontSize: 13, fontWeight: 600,
              }}>✏️ Editar</button>
              <button onClick={() => setModal({ type: 'viewClient', data: c })} style={{
                flex: 1, padding: '8px', borderRadius: 8, border: `1px solid ${accent}44`,
                background: 'transparent', color: accent, cursor: 'pointer', fontSize: 13, fontWeight: 600,
              }}>📋 Ver historial</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
