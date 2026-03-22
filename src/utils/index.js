export const uid = () => Math.random().toString(36).slice(2, 9)

export const todayStr = () => new Date().toISOString().slice(0, 10)

export const thisMonth = () => new Date().toISOString().slice(0, 7)

export const fmtDate = (d) => {
  if (!d) return ''
  return new Date(d + 'T12:00:00').toLocaleDateString('pt-PT', {
    day: '2-digit', month: '2-digit', year: '2-digit',
  })
}

export const fmtMoney = (n) =>
  (Number(n) || 0).toFixed(2).replace('.', ',') + '€'

/** Migra clientes antigos (plate/carModel) para o novo formato (cars[]) */
export const migrateClient = (c) => {
  if (c.cars) return c
  const cars = []
  if (c.plate || c.carModel)
    cars.push({ id: uid(), plate: c.plate || '', model: c.carModel || '' })
  return { ...c, cars }
}
