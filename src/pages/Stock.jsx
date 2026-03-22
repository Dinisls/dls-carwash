import { amber, muted, text, card, border, cardStyle, btnPrimary, labelStyle } from '../theme'

function Section({ items, title, color, setModal }) {
  if (items.length === 0) return null
  return (
    <>
      <div style={{ fontSize: 11, color: color || muted, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, marginBottom: 8 }}>
        {title}
      </div>
      {items.map(s => (
        <div
          key={s.id}
          onClick={() => setModal({ type: 'adjustStock', data: s })}
          style={{
            ...cardStyle,
            cursor: 'pointer',
            borderColor: s.qty <= s.minQty ? amber : border,
            background:  s.qty <= s.minQty ? '#130e00' : card,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{s.name}</div>
              <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>Mín: {s.minQty} {s.unit}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Syne',sans-serif", lineHeight: 1, color: s.qty <= s.minQty ? amber : text }}>
                {s.qty}
              </div>
              <div style={{ fontSize: 12, color: muted }}>{s.unit}</div>
            </div>
          </div>
          {s.qty <= s.minQty && (
            <div style={{ fontSize: 12, color: amber, marginTop: 8 }}>⚠️ Repor stock</div>
          )}
        </div>
      ))}
    </>
  )
}

export default function Stock({ stock, setModal }) {
  const low = stock.filter(s => s.qty <= s.minQty)
  const ok  = stock.filter(s => s.qty >  s.minQty)

  return (
    <div>
      <button onClick={() => setModal({ type: 'addStock' })} style={{ ...btnPrimary, marginBottom: 16 }}>
        + Novo Produto
      </button>

      {stock.length === 0
        ? <div style={{ textAlign: 'center', color: muted, padding: '32px 0', fontSize: 14 }}>Sem produtos em stock</div>
        : <>
          <Section items={low} title="Stock Baixo" color={amber} setModal={setModal} />
          <Section items={ok}  title="Em stock"               setModal={setModal} />
        </>
      }
    </div>
  )
}
