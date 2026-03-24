import { useState } from 'react'
import { uid } from '../utils'
import { STOCK_UNITS } from '../constants'
import { inputStyle, labelStyle, btnPrimary, border, muted, accent, green } from '../theme'
import ModalHeader from '../components/ModalHeader'

export default function AddStockModal({ onSave, onClose }) {
  const [tab, setTab] = useState('stock')

  // Stock fields
  const [name,   setName]   = useState('')
  const [qty,    setQty]    = useState('')
  const [unit,   setUnit]   = useState('L')
  const [minQty, setMinQty] = useState('')

  // Produto fields
  const [pTipo,      setPTipo]      = useState('')
  const [pDilution,  setPDilution]  = useState('1:10')
  const [pTotal,     setPTotal]     = useState('')
  const [pUnit,      setPUnit]      = useState('ml')

  // Cálculo automático
  const parseDilution = (d) => {
    const parts = d.split(':').map(Number)
    return parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) ? parts : null
  }
  const dilParts  = parseDilution(pDilution)
  const totalVol  = Number(pTotal) || 0
  const dilTotal  = dilParts ? dilParts[0] + dilParts[1] : 0
  const pProdQty  = dilTotal > 0 && totalVol > 0 ? +(totalVol * dilParts[0] / dilTotal).toFixed(2) : null
  const pWaterQty = dilTotal > 0 && totalVol > 0 ? +(totalVol * dilParts[1] / dilTotal).toFixed(2) : null

  const handleSaveStock = () => {
    if (!name.trim()) return alert('Insere o nome do produto')
    onSave({ id: uid(), name: name.trim(), qty: Number(qty) || 0, unit, minQty: Number(minQty) || 1, kind: 'stock' })
  }

  const handleSaveProduto = () => {
    if (!pTipo.trim()) return alert('Insere o tipo de produto')
    if (!pTotal)       return alert('Insere o volume total')
    onSave({
      id: uid(),
      name: pTipo.trim(),
      qty: totalVol,
      unit: pUnit,
      minQty: 1,
      kind: 'produto',
      dilution: pDilution,
      productQty: pProdQty ?? 0,
      waterQty:   pWaterQty ?? 0,
    })
  }

  const TABS = [['stock', '📦 Stock'], ['produto', '🧴 Produto']]

  return (
    <div>
      <ModalHeader title="Novo Item" onClose={onClose} />

      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        {TABS.map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            flex: 1, padding: '10px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600,
            border: `2px solid ${tab === id ? accent : border}`,
            background: tab === id ? `${accent}20` : '#0d1f36',
            color: tab === id ? '#fff' : muted, transition: 'all 0.15s',
          }}>{label}</button>
        ))}
      </div>

      {tab === 'stock' && (
        <>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Nome *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Champô auto" style={inputStyle} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>Quantidade inicial</label>
              <input type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="0" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Unidade</label>
              <select value={unit} onChange={e => setUnit(e.target.value)} style={inputStyle}>
                {STOCK_UNITS.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={labelStyle}>Alerta abaixo de</label>
            <input type="number" value={minQty} onChange={e => setMinQty(e.target.value)} placeholder="Ex: 2" style={inputStyle} />
          </div>
          <button onClick={handleSaveStock} style={btnPrimary}>Guardar Stock</button>
        </>
      )}

      {tab === 'produto' && (
        <>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Tipo de produto *</label>
            <input value={pTipo} onChange={e => setPTipo(e.target.value)} placeholder="Ex: Desengordurante, Cera..." style={inputStyle} />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Valor de diluição (produto:água)</label>
            <input value={pDilution} onChange={e => setPDilution(e.target.value)} placeholder="Ex: 1:10" style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>Volume total</label>
              <input type="number" value={pTotal} onChange={e => setPTotal(e.target.value)} placeholder="Ex: 1000" inputMode="decimal" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Unidade</label>
              <select value={pUnit} onChange={e => setPUnit(e.target.value)} style={inputStyle}>
                {STOCK_UNITS.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>

          {pProdQty !== null && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 }}>
              <div style={{ background: `${accent}15`, border: `1px solid ${accent}40`, borderRadius: 10, padding: '10px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: muted, fontWeight: 600, marginBottom: 4 }}>🧴 Produto</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: accent, fontFamily: "'DM Mono', monospace" }}>{pProdQty}</div>
                <div style={{ fontSize: 12, color: muted }}>{pUnit}</div>
              </div>
              <div style={{ background: '#06b6d415', border: '1px solid #06b6d440', borderRadius: 10, padding: '10px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: muted, fontWeight: 600, marginBottom: 4 }}>💧 Água</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#06b6d4', fontFamily: "'DM Mono', monospace" }}>{pWaterQty}</div>
                <div style={{ fontSize: 12, color: muted }}>{pUnit}</div>
              </div>
            </div>
          )}
          {pProdQty === null && pTotal && (
            <div style={{ fontSize: 12, color: muted, marginBottom: 22, textAlign: 'center' }}>
              Formato de diluição inválido — usa ex: <strong>1:10</strong>
            </div>
          )}
          {pProdQty === null && !pTotal && <div style={{ marginBottom: 22 }} />}

          <button onClick={handleSaveProduto} style={btnPrimary}>Guardar Produto</button>
        </>
      )}
    </div>
  )
}
