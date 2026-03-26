import { useState } from 'react'
import { amber, accent, muted, text, card, border, cardStyle, btnPrimary, labelStyle, inputStyle } from '../theme'

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
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{s.name}</div>
                {s.kind === 'produto' && s.dilution && (
                  <span style={{ fontSize: 11, background: `${accent}20`, color: accent, border: `1px solid ${accent}40`, padding: '1px 7px', borderRadius: 4, fontWeight: 600 }}>
                    {s.dilution}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>Mín: {s.minQty} {s.unit}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "'DM Mono', monospace", lineHeight: 1, color: s.qty <= s.minQty ? amber : text }}>
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

function DilutionCalculator() {
  const [ratioA,  setRatioA]  = useState('1')
  const [ratioB,  setRatioB]  = useState('10')
  const [volume,  setVolume]  = useState('')
  const [unit,    setUnit]    = useState('ml')

  const a = Number(ratioA) || 0
  const b = Number(ratioB) || 0
  const v = Number(volume) || 0
  const total = a + b
  const prodVol  = total > 0 && v > 0 ? (v * a / total) : null
  const waterVol = total > 0 && v > 0 ? (v * b / total) : null

  const fmt = n => Number.isInteger(n) ? n : n.toFixed(1)

  return (
    <div style={{ ...cardStyle, marginTop: 24 }}>
      <div style={{ fontSize: 11, color: muted, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, marginBottom: 14 }}>
        🧪 Calculadora de Diluição
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Rácio (produto : água)</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="number" value={ratioA} onChange={e => setRatioA(e.target.value)} inputMode="decimal"
            style={{ ...inputStyle, textAlign: 'center' }} />
          <span style={{ color: muted, fontSize: 18, fontWeight: 700 }}>:</span>
          <input type="number" value={ratioB} onChange={e => setRatioB(e.target.value)} inputMode="decimal"
            style={{ ...inputStyle, textAlign: 'center' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>Volume total desejado</label>
          <input type="number" value={volume} onChange={e => setVolume(e.target.value)} placeholder="Ex: 1000" inputMode="decimal" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Unidade</label>
          <select value={unit} onChange={e => setUnit(e.target.value)} style={inputStyle}>
            {['ml', 'L', 'cl'].map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
      </div>

      {prodVol !== null ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ background: `${accent}15`, border: `1px solid ${accent}40`, borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: muted, fontWeight: 600, marginBottom: 4 }}>🧴 Produto</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: accent, fontFamily: "'DM Mono', monospace" }}>{fmt(prodVol)}</div>
            <div style={{ fontSize: 12, color: muted }}>{unit}</div>
          </div>
          <div style={{ background: '#06b6d415', border: '1px solid #06b6d440', borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: muted, fontWeight: 600, marginBottom: 4 }}>💧 Água</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#06b6d4', fontFamily: "'DM Mono', monospace" }}>{fmt(waterVol)}</div>
            <div style={{ fontSize: 12, color: muted }}>{unit}</div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', color: muted, fontSize: 13, padding: '8px 0' }}>
          Preenche o volume para ver o resultado
        </div>
      )}
    </div>
  )
}

export default function Stock({ stock, setModal }) {
  const low = stock.filter(s => s.qty <= s.minQty)
  const ok  = stock.filter(s => s.qty >  s.minQty)

  return (
    <div>
      <button onClick={() => setModal({ type: 'addStock' })} style={{ ...btnPrimary, marginBottom: 16 }}>
        + Novo Item
      </button>

      {stock.length === 0
        ? <div style={{ textAlign: 'center', color: muted, padding: '32px 0', fontSize: 14 }}>Sem produtos em stock</div>
        : <>
          <Section items={low} title="Stock Baixo" color={amber} setModal={setModal} />
          <Section items={ok}  title="Em stock"               setModal={setModal} />
        </>
      }

      <DilutionCalculator />
    </div>
  )
}
