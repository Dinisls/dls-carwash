import { fmtMoney, fmtDate } from '../utils'
import { amber, green, red, muted, purple, card, border, cardStyle, btnPrimary, labelStyle } from '../theme'

export default function AFP({ washes, purchases, afpWithdrawals, setModal, onDeleteWithdrawal }) {
  const afpWashes      = washes.filter(w => w.paidTo === 'AFP')
  const afpPurchases   = purchases.filter(p => p.paidBy === 'AFP')
  const totalReceived  = afpWashes.reduce((s, w) => s + (Number(w.price) || 0), 0)
  const totalWithdrawn = afpWithdrawals.reduce((s, w) => s + (Number(w.amount) || 0), 0)
  const totalAfpPaid   = afpPurchases.reduce((s, p) => s + (Number(p.amount) || 0), 0)
  const saldo          = totalReceived - totalWithdrawn - totalAfpPaid

  return (
    <div>
      {/* Saldo principal */}
      <div style={{
        background: saldo > 0 ? '#0a1a0a' : card,
        border: `1px solid ${saldo > 0 ? green + '50' : border}`,
        borderRadius: 16, padding: '20px 20px', marginBottom: 16, textAlign: 'center',
      }}>
        <div style={{ fontSize: 11, color: muted, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, marginBottom: 6 }}>
          AFP deve
        </div>
        <div style={{
          fontSize: 42, fontWeight: 800, fontFamily: "'DM Mono', monospace",
          color: saldo > 0 ? green : muted,
        }}>
          {fmtMoney(saldo)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 14, fontSize: 12, color: muted, flexWrap: 'wrap' }}>
          <div>Lavagens: <span style={{ color: purple }}>{fmtMoney(totalReceived)}</span></div>
          <div>Compras AFP: <span style={{ color: red }}>{fmtMoney(totalAfpPaid)}</span></div>
          <div>Levantado: <span style={{ color: amber }}>{fmtMoney(totalWithdrawn)}</span></div>
        </div>
      </div>

      <button onClick={() => setModal({ type: 'afpWithdrawal' })} style={{ ...btnPrimary, marginBottom: 20 }}>
        Levantar Dinheiro
      </button>

      {/* Histórico de levantamentos */}
      <div style={{ fontSize: 11, color: muted, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, marginBottom: 10 }}>
        Levantamentos
      </div>
      {afpWithdrawals.length === 0
        ? <div style={{ textAlign: 'center', color: muted, padding: '24px 0', fontSize: 14 }}>Sem levantamentos registados</div>
        : afpWithdrawals.map(w => (
          <div key={w.id} style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: amber }}>{fmtMoney(w.amount)}</div>
              <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>
                {fmtDate(w.date)}{w.notes ? ` · ${w.notes}` : ''}
              </div>
            </div>
            <button onClick={() => onDeleteWithdrawal(w.id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 16, color: muted, padding: 6,
            }}>🗑</button>
          </div>
        ))
      }

      {/* Lavagens AFP */}
      <div style={{ fontSize: 11, color: muted, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, margin: '20px 0 10px' }}>
        Lavagens AFP ({afpWashes.length})
      </div>
      {afpWashes.length === 0
        ? <div style={{ textAlign: 'center', color: muted, padding: '24px 0', fontSize: 14 }}>Sem lavagens AFP registadas</div>
        : afpWashes.map(w => (
          <div key={w.id} style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{w.clientName || '—'}</div>
              <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>{w.type} · {fmtDate(w.date)}</div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: purple }}>{fmtMoney(w.price)}</div>
          </div>
        ))
      }
    </div>
  )
}
