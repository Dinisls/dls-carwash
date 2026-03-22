import { accent, muted } from '../theme'

export default function ChipGroup({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(o => (
        <button key={o} onClick={() => onChange(o)} style={{
          padding: '7px 14px', borderRadius: 20, border: 'none',
          cursor: 'pointer', fontSize: 13, fontWeight: 500,
          background: value === o ? accent : '#0d1f36',
          color: value === o ? '#fff' : muted,
          transition: 'all 0.15s',
        }}>{o}</button>
      ))}
    </div>
  )
}
