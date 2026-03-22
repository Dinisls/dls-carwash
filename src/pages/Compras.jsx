import { useState } from 'react'
import { thisMonth, fmtMoney, fmtDate } from '../utils'
import { red, purple, muted, border, text, cardStyle, btnPrimary, labelStyle } from '../theme'
import { PURCHASE_CATEGORIES } from '../constants'
import ConfirmDialog from '../components/ConfirmDialog'

const prevMonth = (m) => { const [y, mo] = m.split('-').map(Number); return mo === 1  ? `${y-1}-12` : `${y}-${String(mo-1).padStart(2,'0')}` }
const nextMonth = (m) => { const [y, mo] = m.split('-').map(Number); return mo === 12 ? `${y+1}-01` : `${y}-${String(mo+1).padStart(2,'0')}` }
const fmtMonth  = (m) => new Date(m + '-01T12:00:00').toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })

export default function Compras({ purchases, setModal, onDeletePurchase }) {
  const [filter,        setFilter]        = useState('month')
  const [selectedMonth, setSelectedMonth] = useState(thisMonth())
  const [confirm,       setConfirm]       = useState(null)

  const filtered = purchases.filter(p =>
    filter === 'month' ? p.date?.startsWith(selectedMonth) : true
  )
  const total = filtered.reduce((s, p) => s + (Number(p.amount) || 0), 0)

  const byCategory = PURCHASE_CATEGORIES
    .map(cat => ({
      cat,
      total: filtered
        .filter(p => p.category === cat)
        .reduce((s, p) => s + (Number(p.amount) || 0), 0),
    }))
    .filter(x => x.total > 0)

  return (
    <div>
      {confirm && (
        <ConfirmDialog
          message="Apagar esta despesa permanentemente?"
          onConfirm={() => { onDeletePurchase(confirm); setConfirm(null) }}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          background: filter === 'month' ? `${red}20` : '#0d1f36',
          border: `1px solid ${filter === 'month' ? red : border}`,
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
          background: filter === 'all' ? red : '#0d1f36',
          color: filter === 'all' ? '#fff' : muted, fontWeight: 500, whiteSpace: 'nowrap',
        }}>Todas</button>

        <div style={{ marginLeft: 'auto', fontSize: 14, fontWeight: 700, color: red, whiteSpace: 'nowrap' }}>
          {fmtMoney(total)}
        </div>
      </div>

      {/* Resumo por categoria */}
      {byCategory.length > 0 && (
        <div style={{ ...cardStyle, marginBottom: 14 }}>
          <div style={labelStyle}>Por categoria</div>
          {byCategory.map(x => (
            <div key={x.cat} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13 }}>
              <span style={{ color: muted }}>{x.cat}</span>
              <span style={{ color: red, fontWeight: 600 }}>{fmtMoney(x.total)}</span>
            </div>
          ))}
        </div>
      )}

      <button onClick={() => setModal({ type: 'addPurchase' })} style={{ ...btnPrimary, marginBottom: 14 }}>
        + Nova Despesa
      </button>

      {filtered.length === 0
        ? <div style={{ textAlign: 'center', color: muted, padding: '32px 0', fontSize: 14 }}>Sem despesas</div>
        : filtered.map(p => (
          <div key={p.id} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{p.description}</div>
                <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>
                  {p.supplier && `${p.supplier} · `}{fmtDate(p.date)}
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 5, flexWrap: 'wrap' }}>
                  {p.category && (
                    <span style={{ fontSize: 11, background: '#1a3050', padding: '2px 8px', borderRadius: 4, display: 'inline-block' }}>
                      {p.category}
                    </span>
                  )}
                  {p.paidBy === 'AFP' && (
                    <span style={{ fontSize: 11, background: `${purple}25`, color: purple, border: `1px solid ${purple}50`, padding: '2px 8px', borderRadius: 4, display: 'inline-block', fontWeight: 600 }}>
                      🏢 AFP
                    </span>
                  )}
                </div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: red, marginLeft: 12 }}>
                {fmtMoney(p.amount)}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: `1px solid ${border}` }}>
              <button onClick={() => setModal({ type: 'editPurchase', data: p })} style={{
                flex: 1, padding: '8px', borderRadius: 8, border: `1px solid ${border}`,
                background: 'transparent', color: text, cursor: 'pointer', fontSize: 13, fontWeight: 600,
              }}>✏️ Editar</button>
              <button onClick={() => setConfirm(p.id)} style={{
                flex: 1, padding: '8px', borderRadius: 8, border: `1px solid ${red}22`,
                background: 'transparent', color: red, cursor: 'pointer', fontSize: 13, fontWeight: 600,
              }}>🗑 Apagar</button>
            </div>
          </div>
        ))
      }
    </div>
  )
}
