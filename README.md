# DLS Car Spa

Aplicação de gestão para lavagem de automóveis com dados sincronizados via Supabase.

## Configuração inicial

### 1. Instalar dependências
```bash
npm install
```

### 2. Criar ficheiro .env
Copia o ficheiro `.env.example` para `.env`:
```bash
cp .env.example .env
```
Abre o `.env` e substitui os valores com as tuas chaves do Supabase
(Project Settings → API → Project URL e anon public key).

### 3. Arrancar em desenvolvimento
```bash
npm run dev
```
Abre http://localhost:5173 no browser.

### 4. Build para deploy (Netlify)
```bash
npm run build
```
Arrasta a pasta `dist/` para netlify.com/drop.

## Variáveis de ambiente no Netlify

No Netlify, vai a:
**Site configuration → Environment variables → Add variable**

Adiciona as duas variáveis:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Estrutura do projeto

```
src/
├── constants/    → Serviços, preços, categorias, tabs
├── utils/        → Formatação de datas, dinheiro
├── storage/      → Cliente Supabase + CRUD (upsert, delete, loadAll)
├── theme/        → Cores e estilos partilhados
├── components/   → ModalOverlay, ModalHeader, ChipGroup, CarPicker, ConfirmDialog
├── pages/        → Dashboard, Lavagens, Clientes, Stock, Compras
├── modals/       → Formulários de criar/editar registos
├── App.jsx       → Estado global + navegação
└── main.jsx      → Entrada da app
```
