import { todayStr } from '../utils'

export const DEFAULT_CLIENTS = [
  { id: 'afp-chapa',    name: 'AFP Chapa',    phone: '', cars: [], createdAt: todayStr() },
  { id: 'afp-mecanica', name: 'AFP Mecânica', phone: '', cars: [], createdAt: todayStr() },
]

export const WASH_SERVICES = [
  { name: 'Base Completa',            price: 25    },
  { name: 'Premium Completa',         price: 35    },
  { name: 'Banhoca',                  price: 12.50 },
  { name: 'Base Interior',            price: 20    },
  { name: 'Base Exterior',            price: 10    },
  { name: 'Premium Interior',         price: 30    },
  { name: 'Premium Exterior',         price: 15    },
  { name: 'Lavagem Bancos',           price: 25    },
  { name: 'Lavagem Bancos Individuais', price: 15  },
  { name: 'Outro',                    price: 0     },
]

export const PURCHASE_CATEGORIES = [
  'Produtos', 'Equipamento', 'Manutenção', 'Combustível', 'Outro',
]

export const STOCK_UNITS = ['L', 'ml', 'Kg', 'g', 'un', 'cx']

export const TABS = [
  { id: 'dashboard', icon: '⬡', label: 'Início'   },
  { id: 'lavagens',  icon: '🚗', label: 'Lavagens' },
  { id: 'clientes',  icon: '👤', label: 'Clientes' },
  { id: 'stock',     icon: '📦', label: 'Stock'    },
  { id: 'compras',   icon: '🛒', label: 'Compras'  },
  { id: 'afp',       icon: '🏢', label: 'AFP'      },
]

export const TAB_TITLES = {
  dashboard: 'DLS Car Spa',
  lavagens:  'Lavagens',
  clientes:  'Clientes',
  stock:     'Stock',
  compras:   'Compras & Despesas',
  afp:       'Conta AFP',
}
