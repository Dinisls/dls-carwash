import { useState } from 'react'
import { todayStr, thisMonth, fmtMoney, fmtDate } from '../utils'
import { accent, amber, green, red, muted, purple, card, border, cardStyle, btnPrimary, labelStyle } from '../theme'

const prevMonth = (m) => { const [y, mo] = m.split('-').map(Number); return mo === 1  ? `${y-1}-12` : `${y}-${String(mo-1).padStart(2,'0')}` }
const nextMonth = (m) => { const [y, mo] = m.split('-').map(Number); return mo === 12 ? `${y+1}-01` : `${y}-${String(mo+1).padStart(2,'0')}` }
const fmtMonth  = (m) => new Date(m + '-01T12:00:00').toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })

export default function Dashboard({ washes, clients, stock, purchases, setModal }) {
  const [selectedMonth, setSelectedMonth] = useState(thisMonth())

  const todayWashes    = washes.filter(w => w.date === todayStr())
  const monthWashes    = washes.filter(w => w.date?.startsWith(selectedMonth))
  const todayRevenue   = todayWashes.reduce((s, w) => s + (Number(w.price) || 0), 0)
  const monthRevenue   = monthWashes.reduce((s, w) => s + (Number(w.price) || 0), 0)
  const monthExpenses  = purchases
    .filter(p => p.date?.startsWith(selectedMonth))
    .reduce((s, p) => s + (Number(p.amount) || 0), 0)
  const lowStock       = stock.filter(s => s.qty <= s.minQty)
  const paidDinis      = monthWashes.filter(w => (w.paidTo || 'Dinis') === 'Dinis').reduce((s, w) => s + (Number(w.price) || 0), 0)
  const paidAFP        = monthWashes.filter(w => w.paidTo === 'AFP').reduce((s, w) => s + (Number(w.price) || 0), 0)

  // ── Breakdown por serviço ──────────────────────────────────────────────────
  const serviceMap = {}
  monthWashes.forEach(w => {
    if (!w.type) return
    if (!serviceMap[w.type]) serviceMap[w.type] = { revenue: 0, count: 0 }
    serviceMap[w.type].revenue += Number(w.price) || 0
    serviceMap[w.type].count  += 1
  })
  const byService  = Object.entries(serviceMap)
    .map(([type, d]) => ({ type, ...d }))
    .sort((a, b) => b.revenue - a.revenue)
  const maxRevenue = Math.max(...byService.map(s => s.revenue), 1)
  const maxCount   = Math.max(...byService.map(s => s.count),   1)

  return (
    <div>
      {/* ── Navegador de mês ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          background: card, border: `1px solid ${border}`,
          borderRadius: 20, overflow: 'hidden',
        }}>
          <button onClick={() => setSelectedMonth(prevMonth(selectedMonth))} style={{
            padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer',
            color: muted, fontSize: 18, lineHeight: 1,
          }}>‹</button>
          <span style={{ padding: '8px 4px', fontSize: 13, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>
            {fmtMonth(selectedMonth)}
          </span>
          <button onClick={() => setSelectedMonth(nextMonth(selectedMonth))} style={{
            padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer',
            color: muted, fontSize: 18, lineHeight: 1,
          }}>›</button>
        </div>
      </div>

      {/* ── Stats grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Lavagens hoje', value: todayWashes.length,     sub: 'lavagens', color: accent  },
          { label: 'Receita hoje',  value: fmtMoney(todayRevenue),  sub: 'faturado', color: green   },
          { label: 'Este mês',      value: monthWashes.length,     sub: 'lavagens', color: amber   },
          { label: 'Receita mês',   value: fmtMoney(monthRevenue),  sub: 'faturado', color: purple  },
        ].map(s => (
          <div key={s.label} style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: muted, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: "'Syne',sans-serif", margin: '6px 0 2px' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: muted }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Pagamentos por entidade ── */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: muted, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 12 }}>
          Pagamentos este mês
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1, background: `${accent}15`, border: `1px solid ${accent}40`, borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 11, color: muted, fontWeight: 600, marginBottom: 4 }}>👤 Dinis</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: accent, fontFamily: "'Syne',sans-serif" }}>{fmtMoney(paidDinis)}</div>
          </div>
          <div style={{ flex: 1, background: `${purple}15`, border: `1px solid ${purple}40`, borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 11, color: muted, fontWeight: 600, marginBottom: 4 }}>🏢 AFP</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: purple, fontFamily: "'Syne',sans-serif" }}>{fmtMoney(paidAFP)}</div>
          </div>
        </div>
      </div>

      {/* ── Margem ── */}
      <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={labelStyle}>Margem este mês</div>
          <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Syne',sans-serif", color: monthRevenue - monthExpenses >= 0 ? green : red }}>
            {fmtMoney(monthRevenue - monthExpenses)}
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: 12, color: muted }}>
          <div>Receita: <span style={{ color: green }}>{fmtMoney(monthRevenue)}</span></div>
          <div>Despesas: <span style={{ color: red }}>{fmtMoney(monthExpenses)}</span></div>
        </div>
      </div>

      {/* ── Receita por serviço — gráfico de barras vertical ── */}
      {byService.length > 0 && (
        <div style={{ ...cardStyle, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: muted, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 16 }}>
            Receita por serviço
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140, paddingBottom: 28, position: 'relative' }}>
            {/* linhas de referência */}
            {[0.25, 0.5, 0.75, 1].map(f => (
              <div key={f} style={{
                position: 'absolute', left: 0, right: 0,
                bottom: 28 + (140 - 28) * f, borderTop: `1px dashed ${border}`,
                pointerEvents: 'none',
              }}>
                <span style={{ position: 'absolute', right: 0, top: -9, fontSize: 9, color: muted }}>
                  {fmtMoney(maxRevenue * f)}
                </span>
              </div>
            ))}
            {byService.map((s, i) => {
              const COLORS = [accent, '#22c55e', amber, purple, '#f43f5e', '#06b6d4', '#84cc16']
              const col = COLORS[i % COLORS.length]
              const pct = maxRevenue > 0 ? (s.revenue / maxRevenue) * 100 : 0
              return (
                <div key={s.type} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: 10, color: col, fontWeight: 700, marginBottom: 4 }}>{fmtMoney(s.revenue)}</div>
                  <div style={{
                    width: '100%', borderRadius: '4px 4px 0 0',
                    height: `${pct}%`, minHeight: 4,
                    background: col, opacity: 0.85,
                    transition: 'height 0.4s ease',
                  }} />
                  <div style={{
                    marginTop: 6, fontSize: 9, color: muted, textAlign: 'center',
                    transform: 'rotate(-35deg)', transformOrigin: 'top center',
                    whiteSpace: 'nowrap', width: 60, overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{s.type}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Resumo por serviço — lista com badge + count + total ── */}
      {byService.length > 0 && (
        <div style={{ ...cardStyle, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: muted, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 14 }}>
            Resumo por serviço
          </div>
          {[...byService].sort((a, b) => b.count - a.count).map((s, i) => {
            const COLORS = [accent, '#22c55e', amber, purple, '#f43f5e', '#06b6d4', '#84cc16']
            const col = COLORS[i % COLORS.length]
            return (
              <div key={s.type} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: '#0d1f36', borderRadius: 10, padding: '10px 14px', marginBottom: 8,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    background: col, color: '#fff', fontSize: 11, fontWeight: 700,
                    padding: '3px 10px', borderRadius: 6, whiteSpace: 'nowrap',
                  }}>{s.type}</span>
                  <span style={{ fontSize: 13, color: muted }}>×{s.count}</span>
                </div>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{fmtMoney(s.revenue)}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Alertas stock ── */}
      {lowStock.length > 0 && (
        <div style={{ ...cardStyle, borderColor: amber, background: '#130e00', marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: amber, fontWeight: 700, marginBottom: 10 }}>Alerta de Stock Baixo</div>
          {lowStock.map(s => (
            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #2a1e00', fontSize: 13 }}>
              <span>{s.name}</span>
              <span style={{ color: amber }}>{s.qty} {s.unit}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Últimas lavagens ── */}
      <div style={{ fontSize: 11, color: muted, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, marginBottom: 10 }}>
        Últimas Lavagens
        
      </div>
      {washes.slice(0, 5).length === 0
        ? <div style={{ textAlign: 'center', color: muted, padding: '24px 0', fontSize: 14 }}>Sem lavagens registadas</div>
        : washes.slice(0, 5).map(w => {
          const client = clients.find(c => c.id === w.clientId)
          const car    = client?.cars?.find(c => c.id === w.carId)
          return (
            <div key={w.id} style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{client?.name || w.clientName || '—'}</div>
                <div style={{ fontSize: 12, color: muted, marginTop: 2, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span>{w.type}</span>
                  {car?.plate && <span style={{ background: '#1a3050', padding: '1px 7px', borderRadius: 4 }}>{car.plate}</span>}
                  <span>{fmtDate(w.date)}</span>
                </div>
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: green }}>{fmtMoney(w.price)}</div>
            </div>
          )
        })
      }

      <button onClick={() => setModal({ type: 'addWash' })} style={{ ...btnPrimary, marginTop: 6 }}>
        + Registar Lavagem
      </button>
    </div>
  )
}
