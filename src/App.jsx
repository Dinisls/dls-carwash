import { useState, useEffect } from 'react'
import { loadAll, upsertRecord, deleteRecord } from './storage'
import { migrateClient } from './utils'
import { DEFAULT_CLIENTS, TABS, TAB_TITLES } from './constants'
import { bg, border, accent, muted } from './theme'

import ModalOverlay      from './components/ModalOverlay'
import Dashboard         from './pages/Dashboard'
import Lavagens          from './pages/Lavagens'
import Clientes          from './pages/Clientes'
import Stock             from './pages/Stock'
import Compras           from './pages/Compras'
import AFP               from './pages/AFP'
import WashFormModal        from './modals/WashFormModal'
import ClientFormModal      from './modals/ClientFormModal'
import ViewClientModal      from './modals/ViewClientModal'
import AddStockModal        from './modals/AddStockModal'
import AdjustStockModal     from './modals/AdjustStockModal'
import PurchaseFormModal    from './modals/PurchaseFormModal'
import AFPWithdrawalModal   from './modals/AFPWithdrawalModal'

export default function App() {
  const [tab,       setTab]       = useState('dashboard')
  const [modal,     setModal]     = useState(null)
  const [clients,         setClients]         = useState([])
  const [washes,          setWashes]          = useState([])
  const [stock,           setStock]           = useState([])
  const [purchases,       setPurchases]       = useState([])
  const [afpWithdrawals,  setAfpWithdrawals]  = useState([])
  const [loaded,          setLoaded]          = useState(false)

  // ── Carregar dados do Supabase ────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      const [rawClients, rawWashes, rawStock, rawPurchases, rawAfpWithdrawals] = await Promise.all([
        loadAll('clients'),
        loadAll('washes'),
        loadAll('stock'),
        loadAll('purchases'),
        loadAll('afp_withdrawals'),
      ])

      // Primeira vez (tabela vazia) → seed com clientes AFP
      let finalClients = rawClients.map(migrateClient)
      if (finalClients.length === 0) {
        for (const c of DEFAULT_CLIENTS) await upsertRecord('clients', c)
        finalClients = DEFAULT_CLIENTS
      }

      setClients(finalClients)
      setWashes(rawWashes)
      setStock(rawStock)
      setPurchases(rawPurchases)
      setAfpWithdrawals(rawAfpWithdrawals)
      setLoaded(true)
    }
    init()
  }, [])

  // ── Helpers — atualizam estado local E Supabase ───────────────────────────

  // Clientes
  const addClient    = (c) => { setClients(prev => [c, ...prev]);                          upsertRecord('clients', c) }
  const updateClient = (c) => { setClients(prev => prev.map(x => x.id === c.id ? c : x)); upsertRecord('clients', c) }
  const removeClient = (id) => { setClients(prev => prev.filter(x => x.id !== id));        deleteRecord('clients', id) }

  // Lavagens
  const addWash    = (w) => { setWashes(prev => [w, ...prev]);                          upsertRecord('washes', w) }
  const updateWash = (w) => { setWashes(prev => prev.map(x => x.id === w.id ? w : x)); upsertRecord('washes', w) }
  const removeWash = (id) => { setWashes(prev => prev.filter(x => x.id !== id));        deleteRecord('washes', id) }

  // Stock
  const addStock    = (s) => { setStock(prev => [s, ...prev]);                          upsertRecord('stock', s) }
  const updateStock = (s) => { setStock(prev => prev.map(x => x.id === s.id ? s : x)); upsertRecord('stock', s) }

  // Compras
  const addPurchase    = (p) => { setPurchases(prev => [p, ...prev]);                          upsertRecord('purchases', p) }
  const updatePurchase = (p) => { setPurchases(prev => prev.map(x => x.id === p.id ? p : x)); upsertRecord('purchases', p) }
  const removePurchase = (id) => { setPurchases(prev => prev.filter(x => x.id !== id));        deleteRecord('purchases', id) }

  // AFP Withdrawals
  const addAfpWithdrawal    = (w) => { setAfpWithdrawals(prev => [w, ...prev]);              upsertRecord('afp_withdrawals', w) }
  const removeAfpWithdrawal = (id) => { setAfpWithdrawals(prev => prev.filter(x => x.id !== id)); deleteRecord('afp_withdrawals', id) }

  // Usado por WashFormModal para criar/atualizar cliente on-the-fly
  const handleUpdateClient = (c, isNew = false) => isNew ? addClient(c) : updateClient(c)

  // ── Loading ───────────────────────────────────────────────────────────────
  if (!loaded) return (
    <div style={{
      minHeight: '100vh', background: bg, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', color: muted, gap: 12,
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        border: `3px solid ${border}`, borderTop: `3px solid ${accent}`,
        animation: 'spin 0.8s linear infinite',
      }} />
      <div style={{ fontSize: 14 }}>A carregar…</div>
    </div>
    
  )

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: bg, paddingBottom: 72 }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(180deg, #0b1628 0%, rgba(11,22,40,0.95) 100%)',
        borderBottom: `1px solid ${border}`, padding: '14px 20px',
        position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(10px)',
      }}>
        <div style={{ fontSize: 10, color: muted, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
          DLS Car Spa
        </div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 21, fontWeight: 800, color: '#fff', marginTop: 1, letterSpacing: '-0.02em' }}>
          {TAB_TITLES[tab]}
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ padding: '16px 16px 8px' }}>
        {tab === 'dashboard' && (
          <Dashboard washes={washes} clients={clients} stock={stock} purchases={purchases} setModal={setModal} />
        )}
        {tab === 'lavagens' && (
          <Lavagens washes={washes} clients={clients} setModal={setModal} onDeleteWash={removeWash} />
        )}
        {tab === 'clientes' && (
          <Clientes clients={clients} washes={washes} setModal={setModal} />
        )}
        {tab === 'stock' && (
          <Stock stock={stock} setModal={setModal} />
        )}
        {tab === 'compras' && (
          <Compras purchases={purchases} setModal={setModal} onDeletePurchase={removePurchase} />
        )}
        {tab === 'afp' && (
          <AFP washes={washes} purchases={purchases} afpWithdrawals={afpWithdrawals} setModal={setModal} onDeleteWithdrawal={removeAfpWithdrawal} />
        )}
      </div>

      {/* Bottom nav */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'rgba(11,22,40,0.97)', borderTop: `1px solid ${border}`,
        display: 'flex', zIndex: 20, backdropFilter: 'blur(12px)',
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: '10px 4px 14px', background: 'none', border: 'none',
            cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            color: tab === t.id ? accent : muted, transition: 'color 0.15s',
          }}>
            <span style={{ fontSize: 19 }}>{t.icon}</span>
            <span style={{ fontSize: 10, fontWeight: tab === t.id ? 700 : 400, letterSpacing: '0.02em' }}>
              {t.label}
            </span>
          </button>
        ))}
      </div>

      {/* Modais */}
      {modal && (
        <ModalOverlay onClose={() => setModal(null)}>

          {(modal.type === 'addWash' || modal.type === 'editWash') && (
            <WashFormModal
              clients={clients}
              initial={modal.type === 'editWash' ? modal.data : undefined}
              onClose={() => setModal(null)}
              onUpdateClient={handleUpdateClient}
              onSave={w => {
                modal.type === 'editWash' ? updateWash(w) : addWash(w)
                setModal(null)
              }}
            />
          )}

          {(modal.type === 'addClient' || modal.type === 'editClient') && (
            <ClientFormModal
              initial={modal.type === 'editClient' ? modal.data : undefined}
              onClose={() => setModal(null)}
              onDelete={id => { removeClient(id); setModal(null) }}
              onSave={c => {
                modal.type === 'editClient' ? updateClient(c) : addClient(c)
                setModal(null)
              }}
            />
          )}

          {modal.type === 'viewClient' && (
            <ViewClientModal
              client={clients.find(c => c.id === modal.data.id) || modal.data}
              washes={washes.filter(w => w.clientId === modal.data.id)}
              onClose={() => setModal(null)}
              setModal={setModal}
            />
          )}

          {modal.type === 'addStock' && (
            <AddStockModal
              onClose={() => setModal(null)}
              onSave={s => { addStock(s); setModal(null) }}
            />
          )}

          {modal.type === 'adjustStock' && (
            <AdjustStockModal
              item={modal.data}
              onClose={() => setModal(null)}
              onSave={s => { updateStock(s); setModal(null) }}
            />
          )}

          {modal.type === 'afpWithdrawal' && (
            <AFPWithdrawalModal
              onClose={() => setModal(null)}
              onSave={w => { addAfpWithdrawal(w); setModal(null) }}
            />
          )}

          {(modal.type === 'addPurchase' || modal.type === 'editPurchase') && (
            <PurchaseFormModal
              initial={modal.type === 'editPurchase' ? modal.data : undefined}
              onClose={() => setModal(null)}
              onSave={p => {
                modal.type === 'editPurchase' ? updatePurchase(p) : addPurchase(p)
                setModal(null)
              }}
            />
          )}

        </ModalOverlay>
      )}
    </div>
  )
}
