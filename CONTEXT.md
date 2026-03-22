# DLS Car Spa — Contexto do Projeto

App de gestão para negócio de lavagem de automóveis (uso pessoal).

---

## Stack

- **React 18 + Vite** — frontend
- **Supabase** — base de dados online (PostgreSQL), sincroniza entre dispositivos
- **Netlify** — hosting/deploy gratuito
- **Sem autenticação** — app pessoal, sem login

---

## Deploy

- **URL:** link gerado pelo Netlify (ex: dls-carwash.netlify.app)
- **Variáveis de ambiente necessárias:**
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- **Para fazer build:** `npm run build` → arrasta pasta `dist/` para netlify.com/drop

---

## Estrutura do projeto

```
src/
├── constants/index.js        → Serviços/preços, categorias, tabs, clientes default
├── utils/index.js            → uid(), todayStr(), thisMonth(), fmtDate(), fmtMoney(), migrateClient()
├── storage/
│   ├── supabaseClient.js     → Inicialização do cliente Supabase
│   └── index.js              → loadAll(), upsertRecord(), deleteRecord() + mapeadores JS↔BD
├── theme/index.js            → Cores (bg, card, border, accent, amber, green, red, text, muted, purple)
│                               + estilos partilhados (inputStyle, labelStyle, btnPrimary, btnDanger, cardStyle)
├── components/
│   ├── ConfirmDialog.jsx     → Dialog de confirmação antes de apagar
│   ├── ModalOverlay.jsx      → Overlay de fundo + sheet que sobe do fundo
│   ├── ModalHeader.jsx       → Título + botão fechar (×)
│   ├── ChipGroup.jsx         → Grupo de botões tipo chip (ex: categorias)
│   └── CarPicker.jsx         → Selecionar carro existente ou adicionar novo
├── pages/
│   ├── Dashboard.jsx         → Stats do dia/mês, margem, alertas stock, últimas lavagens
│   ├── Lavagens.jsx          → Lista de lavagens com filtro hoje/mês/todas, editar/apagar
│   ├── Clientes.jsx          → Lista de clientes com pesquisa, editar/ver historial
│   ├── Stock.jsx             → Produtos com alertas de stock baixo, ajustar quantidades
│   └── Compras.jsx           → Despesas com filtro mensal, breakdown por categoria, editar/apagar
├── modals/
│   ├── WashFormModal.jsx     → Criar/editar lavagem (cliente existente/novo/rápido + grelha de serviços)
│   ├── ClientFormModal.jsx   → Criar/editar cliente (múltiplos carros, apagar cliente)
│   ├── ViewClientModal.jsx   → Ver historial completo de um cliente
│   ├── AddStockModal.jsx     → Adicionar produto ao stock
│   ├── AdjustStockModal.jsx  → Atualizar quantidade e mínimo de produto
│   └── PurchaseFormModal.jsx → Criar/editar despesa
├── App.jsx                   → Estado global, helpers CRUD, navegação, render de modais
└── main.jsx                  → Entrada da app (ReactDOM.createRoot)
```

---

## Base de dados Supabase

### Tabelas

| Tabela | Campos principais |
|---|---|
| `clients` | id, name, phone, cars (jsonb array), created_at |
| `washes` | id, client_id, client_name, car_id, type, price, date, notes |
| `stock` | id, name, qty, unit, min_qty |
| `purchases` | id, description, supplier, amount, date, category |

- RLS (Row Level Security) **desativado** em todas as tabelas — app pessoal sem auth
- `cars` é guardado como JSONB (array de objetos `{ id, plate, model }`)
- Mapeamento camelCase (JS) ↔ snake_case (BD) feito em `src/storage/index.js`

---

## Serviços e preços

| Serviço | Preço |
|---|---|
| Base Completa | 25€ |
| Premium Completa | 35€ |
| Banhoca | 12,50€ |
| Base Interior | 20€ |
| Base Exterior | 10€ |
| Premium Interior | 30€ |
| Premium Exterior | 15€ |
| Lavagem Bancos | 25€ |
| Lavagem Bancos Individuais | 15€ |
| Outro | 0€ (preço manual) |

---

## Clientes pré-definidos

- **AFP Chapa** — oficina de chapa (vários carros de clientes)
- **AFP Mecânica** — oficina de mecânica (vários carros de clientes)

Cada cliente pode ter **múltiplos carros** (matrícula + modelo).

---

## Funcionalidades implementadas

- Registo de lavagens com cliente, carro, serviço, preço, data e notas
- Gestão de clientes com múltiplos carros por cliente
- Ao registar lavagem: selecionar cliente existente (com pesquisa), criar novo cliente, ou nome rápido
- Ao selecionar cliente existente: escolher carro ou adicionar novo carro diretamente
- Editar e apagar lavagens, clientes e compras (com confirmação antes de apagar)
- Historial completo por cliente
- Gestão de stock com alertas de stock baixo
- Gestão de compras/despesas por categoria
- Dashboard com stats do dia, mês, margem de lucro e alertas
- Dados sincronizados entre iPhone e computador via Supabase

---

## Categorias de compras

Produtos, Equipamento, Manutenção, Combustível, Outro

## Unidades de stock

L, ml, Kg, g, un, cx

---

## Design

- Tema escuro — fundo `#060d1a`, cards `#0b1628`
- Accent azul `#3b82f6`, verde `#22c55e`, vermelho `#ef4444`, âmbar `#f59e0b`
- Fontes: **Syne** (títulos, números grandes) + **DM Sans** (corpo)
- Layout mobile-first com bottom navigation bar (5 tabs)
- Modais sobem do fundo do ecrã (sheet style)

---

## Pendente / ideias futuras

- Importação de dados do Base44 (app anterior)
- Relatórios exportáveis (PDF/Excel)
- Agendamentos