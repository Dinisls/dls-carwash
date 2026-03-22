import { supabase } from './supabaseClient'

// ── Mapeadores JS (camelCase) <-> BD (snake_case) ─────────────────────────────

const toDb = {
  afp_withdrawals: (w) => ({
    id:     w.id,
    amount: w.amount,
    date:   w.date,
    notes:  w.notes || '',
  }),
  clients: (c) => ({
    id:         c.id,
    name:       c.name,
    phone:      c.phone       || '',
    cars:       c.cars        || [],
    created_at: c.createdAt   || '',
  }),
  washes: (w) => ({
    id:           w.id,
    client_id:    w.clientId    || null,
    client_name:  w.clientName  || '',
    client2_id:   w.client2Id   || null,
    client2_name: w.client2Name || '',
    car_id:       w.carId       || null,
    type:         w.type,
    price:        w.price,
    date:         w.date,
    notes:        w.notes       || '',
    paid_to:      w.paidTo      || 'Dinis',
  }),
  stock: (s) => ({
    id:      s.id,
    name:    s.name,
    qty:     s.qty,
    unit:    s.unit,
    min_qty: s.minQty,
  }),
  purchases: (p) => ({
    id:          p.id,
    description: p.description,
    supplier:    p.supplier || '',
    amount:      p.amount,
    date:        p.date,
    category:    p.category,
    paid_by:     p.paidBy || 'Dinis',
  }),
}

const fromDb = {
  afp_withdrawals: (r) => ({ id: r.id, amount: r.amount, date: r.date, notes: r.notes }),
  clients:   (r) => ({ id: r.id, name: r.name, phone: r.phone, cars: r.cars || [], createdAt: r.created_at }),
  washes:    (r) => ({ id: r.id, clientId: r.client_id, clientName: r.client_name, client2Id: r.client2_id, client2Name: r.client2_name, carId: r.car_id, type: r.type, price: r.price, date: r.date, notes: r.notes, paidTo: r.paid_to || 'Dinis' }),
  stock:     (r) => ({ id: r.id, name: r.name, qty: r.qty, unit: r.unit, minQty: r.min_qty }),
  purchases: (r) => ({ id: r.id, description: r.description, supplier: r.supplier, amount: r.amount, date: r.date, category: r.category, paidBy: r.paid_by || 'Dinis' }),
}

// ── Ordenação por tabela ──────────────────────────────────────────────────────
const orderBy = {
  afp_withdrawals: { column: 'date', ascending: false },
  clients:   { column: 'name',  ascending: true  },
  washes:    { column: 'date',  ascending: false },
  stock:     { column: 'name',  ascending: true  },
  purchases: { column: 'date',  ascending: false },
}

// ── API pública ───────────────────────────────────────────────────────────────

/** Carrega todos os registos de uma tabela */
export const loadAll = async (table) => {
  const { column, ascending } = orderBy[table]
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order(column, { ascending })

  if (error) { console.error('loadAll error:', table, error); return [] }
  return (data || []).map(fromDb[table])
}

/** Insere ou atualiza um registo (upsert) */
export const upsertRecord = async (table, record) => {
  const { error } = await supabase
    .from(table)
    .upsert(toDb[table](record))

  if (error) console.error('upsertRecord error:', table, error)
}

/** Apaga um registo pelo id */
export const deleteRecord = async (table, id) => {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id)

  if (error) console.error('deleteRecord error:', table, error)
}
