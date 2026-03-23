import { useState } from 'react'
import { todayStr, thisMonth, fmtMoney, fmtDate } from '../utils'
import { accent, green, red, muted, border, text, cardStyle, btnPrimary } from '../theme'
import ConfirmDialog from '../components/ConfirmDialog'

const prevMonth = (m) => { const [y, mo] = m.split('-').map(Number); return mo === 1  ? `${y-1}-12` : `${y}-${String(mo-1).padStart(2,'0')}` }
const nextMonth = (m) => { const [y, mo] = m.split('-').map(Number); return mo === 12 ? `${y+1}-01` : `${y}-${String(mo+1).padStart(2,'0')}` }
const fmtMonth  = (m) => new Date(m + '-01T12:00:00').toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })

const exportCSV = (rows, clients, filename) => {
  const escape = v => `"${String(v ?? '').replace(/"/g, '""')}"`
  const headers = ['Data', 'Cliente', 'Dono do Carro', 'Matrícula', 'Modelo', 'Serviço', 'Preço (€)', 'Pago a', 'Notas']
  const lines = rows.map(w => {
    const client  = clients.find(c => c.id === w.clientId)
    const client2 = clients.find(c => c.id === w.client2Id)
    const car     = client?.cars?.find(c => c.id === w.carId) || client2?.cars?.find(c => c.id === w.carId)
    return [
      w.date,
      client?.name || w.clientName || '',
      client2?.name || w.client2Name || '',
      car?.plate || '',
      car?.model || '',
      w.type || '',
      String(Number(w.price) || 0).replace('.', ','),
      w.paidTo || 'Dinis',
      w.notes || '',
    ].map(escape).join(';')
  })
  const bom = '\uFEFF'
  const csv = bom + [headers.map(escape).join(';'), ...lines].join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}

export default function Lavagens({ washes, clients, setModal, onDeleteWash }) {
  const [filter,       setFilter]       = useState('month')
  const [selectedMonth, setSelectedMonth] = useState(thisMonth())
  const [confirm,      setConfirm]      = useState(null)

  const filtered = washes.filter(w => {
    if (filter === 'today') return w.date === todayStr()
    if (filter === 'month') return w.date?.startsWith(selectedMonth)
    return true
  })
  const total = filtered.reduce((s, w) => s + (Number(w.price) || 0), 0)

  const handleExport = () => {
    const label = filter === 'month' ? fmtMonth(selectedMonth) : filter === 'today' ? 'hoje' : 'todas'
    exportCSV(filtered, clients, `lavagens-${label}.csv`)
  }

  return (
    <div>
      {confirm && (
        <ConfirmDialog
          message="Apagar esta lavagem permanentemente?"
          onConfirm={() => { onDeleteWash(confirm); setConfirm(null) }}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
        <button onClick={() => setFilter('today')} style={{
          padding: '7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13,
          background: filter === 'today' ? accent : '#0d1f36',
          color: filter === 'today' ? '#fff' : muted, fontWeight: 500, whiteSpace: 'nowrap',
        }}>Hoje</button>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 0,
          background: filter === 'month' ? `${accent}20` : '#0d1f36',
          border: `1px solid ${filter === 'month' ? accent : border}`,
          borderRadius: 20, overflow: 'hidden', transition: 'all 0.15s',
        }}>
          <button onClick={() => { setFilter('month'); setSelectedMonth(prevMonth(selectedMonth)) }} style={{
            padding: '7px 12px', background: 'none', border: 'none', cursor: 'pointer',
            color: filter === 'month' ? '#fff' : muted, fontSize: 15, lineHeight: 1,
          }}>‹</button>
          <button onClick={() => setFilter('month')} style={{
            padding: '7px 4px', background: 'none', border: 'none', cursor: 'pointer',
            color: filter === 'month' ? '#fff' : muted, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
          }}>{fmtMonth(selectedMonth)}</button>
          <button onClick={() => { setFilter('month'); setSelectedMonth(nextMonth(selectedMonth)) }} style={{
            padding: '7px 12px', background: 'none', border: 'none', cursor: 'pointer',
            color: filter === 'month' ? '#fff' : muted, fontSize: 15, lineHeight: 1,
          }}>›</button>
        </div>

        <button onClick={() => setFilter('all')} style={{
          padding: '7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13,
          background: filter === 'all' ? accent : '#0d1f36',
          color: filter === 'all' ? '#fff' : muted, fontWeight: 500, whiteSpace: 'nowrap',
        }}>Todas</button>

        <div style={{ marginLeft: 'auto', fontSize: 14, fontWeight: 700, color: green, whiteSpace: 'nowrap' }}>
          {fmtMoney(total)}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <button onClick={() => setModal({ type: 'addWash' })} style={{ ...btnPrimary, flex: 1 }}>
          + Nova Lavagem
        </button>
        <button onClick={handleExport} disabled={filtered.length === 0} style={{
          padding: '13px 14px', borderRadius: 10, border: `1px solid ${border}`,
          background: 'transparent', color: filtered.length === 0 ? muted : green,
          cursor: filtered.length === 0 ? 'default' : 'pointer', fontSize: 18, lineHeight: 1,
        }} title="Exportar para Excel">⬇</button>
      </div>

      {filtered.length === 0
        ? <div style={{ textAlign: 'center', color: muted, padding: '32px 0', fontSize: 14 }}>Sem lavagens</div>
        : filtered.map(w => {
          const client  = clients.find(c => c.id === w.clientId)
          const client2 = clients.find(c => c.id === w.client2Id)
          const car     = client?.cars?.find(c => c.id === w.carId)
                       || client2?.cars?.find(c => c.id === w.carId)
          const owner2Name = client2?.name || w.client2Name || null
          return (
            <div key={w.id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{client?.name || w.clientName || '—'}</div>
                  {owner2Name && (
                    <div style={{ fontSize: 12, color: accent, marginTop: 1 }}>Dono: {owner2Name}</div>
                  )}
                  <div style={{ fontSize: 12, color: muted, marginTop: 3, display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                    {car?.plate && <span style={{ background: '#1a3050', padding: '2px 8px', borderRadius: 4 }}>{car.plate}</span>}
                    {car?.model && <span>{car.model}</span>}
                    <span style={{ background: '#0d1f36', padding: '2px 8px', borderRadius: 4 }}>{w.type}</span>
                  </div>
                  {w.notes && <div style={{ fontSize: 12, color: muted, marginTop: 5, fontStyle: 'italic' }}>"{w.notes}"</div>}
                </div>
                <div style={{ textAlign: 'right', marginLeft: 12 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: green }}>{fmtMoney(w.price)}</div>
                  <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>{fmtDate(w.date)}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${border}` }}>
                <button onClick={() => setModal({ type: 'editWash', data: w })} style={{
                  flex: 1, padding: '8px', borderRadius: 8, border: `1px solid ${border}`,
                  background: 'transparent', color: text, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                }}>✏️ Editar</button>
                <button onClick={() => setConfirm(w.id)} style={{
                  flex: 1, padding: '8px', borderRadius: 8, border: `1px solid ${red}22`,
                  background: 'transparent', color: red, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                }}>🗑 Apagar</button>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}
