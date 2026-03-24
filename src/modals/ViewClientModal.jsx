import { fmtMoney, fmtDate } from '../utils'
import { accent, green, muted, border, text, cardStyle, labelStyle } from '../theme'
import ModalHeader from '../components/ModalHeader'

export default function ViewClientModal({ client, washes, onClose, setModal }) {
  const total = washes.reduce((s, w) => s + (Number(w.price) || 0), 0)

  return (
    <div>
      <ModalHeader title={client.name} onClose={onClose} />

      <div style={{ ...cardStyle, marginBottom: 16 }}>
        {/* Info + botão editar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div>
            {client.phone && <div style={{ fontSize: 14, color: muted }}>📞 {client.phone}</div>}
            <div style={{ fontSize: 12, color: muted, marginTop: 4 }}>
              Cliente desde {fmtDate(client.createdAt)}
            </div>
          </div>
          <button
            onClick={() => { onClose(); setTimeout(() => setModal({ type: 'editClient', data: client }), 50) }}
            style={{
              padding: '7px 14px', borderRadius: 8, border: `1px solid ${border}`,
              background: 'transparent', color: text, cursor: 'pointer', fontSize: 13, fontWeight: 600,
            }}
          >✏️ Editar</button>
        </div>

        {/* Carros */}
        {client.cars?.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={labelStyle}>Carros</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {client.cars.map(car => (
                <div key={car.id} style={{ background: '#0d1f36', borderRadius: 8, padding: '8px 12px', display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span>🚗</span>
                  {car.plate && (
                    <span style={{ background: '#1a3050', padding: '2px 8px', borderRadius: 4, fontSize: 13, fontWeight: 700 }}>
                      {car.plate}
                    </span>
                  )}
                  {car.model && <span style={{ fontSize: 13, color: muted }}>{car.model}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Totais */}
        <div style={{ borderTop: `1px solid ${border}`, paddingTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <div style={labelStyle}>Total lavagens</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: accent, fontFamily: "'DM Mono', monospace" }}>
              {washes.length}
            </div>
          </div>
          <div>
            <div style={labelStyle}>Total gasto</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: green, fontFamily: "'DM Mono', monospace" }}>
              {fmtMoney(total)}
            </div>
          </div>
        </div>
      </div>

      {/* Histórico */}
      <div style={{ fontSize: 11, color: muted, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, marginBottom: 10 }}>
        Histórico
      </div>

      {washes.length === 0
        ? <div style={{ textAlign: 'center', color: muted, padding: 20, fontSize: 14 }}>Sem lavagens</div>
        : washes.map(w => {
          const car = client.cars?.find(c => c.id === w.carId)
          return (
            <div key={w.id} style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{w.type}</div>
                <div style={{ fontSize: 12, color: muted, marginTop: 2, display: 'flex', gap: 6, alignItems: 'center' }}>
                  {car?.plate && (
                    <span style={{ background: '#1a3050', padding: '1px 7px', borderRadius: 4 }}>{car.plate}</span>
                  )}
                  <span>{fmtDate(w.date)}</span>
                </div>
                {w.notes && (
                  <div style={{ fontSize: 12, color: muted, fontStyle: 'italic', marginTop: 3 }}>"{w.notes}"</div>
                )}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: green }}>{fmtMoney(w.price)}</div>
            </div>
          )
        })
      }
    </div>
  )
}
