import { useState, useRef, useEffect } from 'react'
import { useExpenses, CATEGORY_LABELS, CATEGORY_COLORS } from '../hooks/useExpenses'
import type { Expense, ExpenseCategory } from '../lib/types'
import { Modal } from '../components/Modal'
import { ConfirmSheet } from '../components/ConfirmSheet'
import { formatFecha } from '../lib/utils'

// ── Constants ─────────────────────────────────────────────────────────────────

const PERSONA_COLOR: Record<string, string> = {
  flor: '#C8472A',
  pato: '#004D98',
  ambos: '#78716C',
}
const PERSONA_LABEL: Record<string, string> = {
  flor: 'Flor',
  pato: 'Pato',
  ambos: 'Compartido',
}
const CURRENCY_SYMBOL: Record<'EUR' | 'USD', string> = { EUR: '€', USD: '$' }

// ── Helpers ───────────────────────────────────────────────────────────────────

function todayISO(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// ── CategoryIcon ──────────────────────────────────────────────────────────────

function CategoryIcon({ categoria, size = 16, color: colorProp }: {
  categoria: ExpenseCategory; size?: number; color?: string
}) {
  const color = colorProp ?? CATEGORY_COLORS[categoria]
  const sp = {
    stroke: color, strokeWidth: 1.4,
    strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      {categoria === 'alojamiento' && <>
        <rect {...sp} x="2.5" y="2" width="11" height="12" rx="1" />
        <path {...sp} d="M2.5 8.5h11" />
        <rect {...sp} x="6.5" y="9.5" width="3" height="4.5" rx=".5" />
        <rect {...sp} x="4" y="3.5" width="2.5" height="2.5" rx=".3" />
        <rect {...sp} x="9.5" y="3.5" width="2.5" height="2.5" rx=".3" />
      </>}
      {categoria === 'comida' && <>
        <path {...sp} d="M6 2v3M8 2v3M6 5 A 1 1 0 0 1 8 5M7 6v8" />
        <path {...sp} d="M11.5 2L13 3V5.5H11.5V14" />
      </>}
      {categoria === 'transporte' && <>
        <rect {...sp} x="2.5" y="2.5" width="11" height="7" rx="1.5" />
        <path {...sp} d="M2.5 6.5h11" />
        <path {...sp} d="M5.5 9.5L4.5 13M10.5 9.5L11.5 13" />
        <circle cx="5.5" cy="11" r="1.2" stroke={color} strokeWidth="1.2" />
        <circle cx="10.5" cy="11" r="1.2" stroke={color} strokeWidth="1.2" />
        <path {...sp} d="M6.5 4.5h3" />
      </>}
      {categoria === 'actividades' && <>
        <rect {...sp} x="1.5" y="5.5" width="13" height="9" rx="1.5" />
        <path {...sp} d="M5.5 5.5V4.5A1 1 0 016.5 3.5h3a1 1 0 011 1V5.5" />
        <circle {...sp} cx="8" cy="10" r="2.5" />
        <circle cx="12" cy="7.5" r=".8" fill={color} />
      </>}
      {categoria === 'compras' && <>
        <path {...sp} d="M5.5 6V5a2.5 2.5 0 015 0v1" />
        <rect {...sp} x="3" y="6" width="10" height="8" rx="1.5" />
        <path {...sp} d="M5.5 10h5" />
      </>}
      {categoria === 'otro' && <>
        <path {...sp} d="M8 13.5C8 13.5 3 9 3 6A5 5 0 0113 6C13 9 8 13.5 8 13.5Z" />
        <circle {...sp} cx="8" cy="6" r="1.5" />
      </>}
    </svg>
  )
}

// ── ResumenCard ───────────────────────────────────────────────────────────────

type CurrencyData = { total: number; florTotal: number; patoTotal: number; ambosTotal: number }

function ResumenCard({ eurData, usdData }: { eurData: CurrencyData | null; usdData: CurrencyData | null }) {
  const mainData = eurData || usdData
  if (!mainData) return null
  const mainSym = eurData ? '€' : '$'

  // Dummy logic for a dynamic looking circular dash
  const strokeDasharray = 440
  const randomOffset = 440 * 0.35 // fixed visual representing spent budget

  return (
    <div className="card border border-border bg-surface shadow-md py-6 px-5 flex flex-col items-center mb-0">
      <h3 className="text-[18px] font-bold text-text mb-6 tracking-wide">Presupuesto Viaje</h3>

      {/* Circular Progress using SVG */}
      <div className="relative w-40 h-40 flex items-center justify-center mb-6">
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle cx="80" cy="80" r="70" fill="none" stroke="var(--color-bg)" strokeWidth="12" />
          <circle cx="80" cy="80" r="70" fill="none" stroke="var(--color-accent)" strokeWidth="12" strokeDasharray={strokeDasharray} strokeDashoffset={randomOffset} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
        </svg>
        <div className="text-center">
          <p className="text-[11px] font-bold text-text-sub uppercase tracking-wide mb-1">Total Gastado</p>
          <p className="text-[26px] font-black text-text leading-none mb-1">{mainSym}{mainData.total.toFixed(2)}</p>
          {eurData && usdData && <p className="text-[15px] font-bold text-text-sub leading-none">${usdData.total.toFixed(2)}</p>}
        </div>
      </div>

      <div className="w-full flex justify-between px-2">
        <div className="text-center">
          <p className="text-[11px] text-text-sub font-medium mb-1">Flor</p>
          <p className="text-[14px] font-bold text-text">{mainSym}{mainData.florTotal.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-[11px] text-text-sub font-medium mb-1">Ambos</p>
          <p className="text-[14px] font-bold text-text">{mainSym}{mainData.ambosTotal.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-[11px] text-text-sub font-medium mb-1">Pato</p>
          <p className="text-[14px] font-bold text-text">{mainSym}{mainData.patoTotal.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}

// ── CategoryBreakdown ─────────────────────────────────────────────────────────

function CategoryBreakdown({ byCatEUR, byCatUSD }: {
  byCatEUR: Record<string, number>
  byCatUSD: Record<string, number>
}) {
  const categories = (Object.keys(CATEGORY_LABELS) as ExpenseCategory[])
    .filter(c => (byCatEUR[c] ?? 0) > 0 || (byCatUSD[c] ?? 0) > 0)
  if (categories.length === 0) return null

  const totalRaw = categories.reduce((s, c) => s + (byCatEUR[c] ?? 0) + (byCatUSD[c] ?? 0), 0)

  return (
    <div className="card px-4 py-2 border border-border bg-surface shadow-sm mb-0">
      {categories.map((cat, i) => {
        const eur = byCatEUR[cat] ?? 0
        const usd = byCatUSD[cat] ?? 0
        const raw = eur + usd
        const pct = totalRaw > 0 ? Math.min((raw / totalRaw) * 100, 100) : 0
        const color = CATEGORY_COLORS[cat]
        const amtLabel =
          eur > 0 && usd > 0 ? `€${eur.toFixed(2)} · $${usd.toFixed(2)}` :
            eur > 0 ? `€${eur.toFixed(2)}` :
              `$${usd.toFixed(2)}`
        return (
          <div
            key={cat}
            className={`flex items-center gap-3 py-3${i > 0 ? ' border-t border-border' : ''}`}
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full" style={{ background: `${color}15` }}>
              <CategoryIcon categoria={cat} size={16} color={color} />
            </span>
            <span className="text-[13px] font-semibold text-text flex-1 min-w-0 truncate">
              {CATEGORY_LABELS[cat]}
            </span>
            <div style={{ width: 60, height: 6, borderRadius: 3, background: `${color}20`, flexShrink: 0, overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', borderRadius: 3, background: color }} />
            </div>
            <span className="text-[13px] font-bold text-text tabular-nums text-right min-w-[60px]">
              {amtLabel}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ── ExpenseRow ────────────────────────────────────────────────────────────────

function ExpenseRow({ expense, onDelete, onEdit }: { expense: Expense; onDelete: () => void; onEdit: () => void }) {
  const persona = expense.persona ?? 'ambos'
  const catColor = CATEGORY_COLORS[expense.categoria]
  const sym = CURRENCY_SYMBOL[expense.moneda ?? 'EUR']
  return (
    <div className="card flex items-center mb-2 px-3 py-3 gap-3 border border-border bg-surface shadow-sm hover:shadow-md transition-shadow">
      <span className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl" style={{ background: `${catColor}15` }}>
        <CategoryIcon categoria={expense.categoria} color={catColor} size={20} />
      </span>
      <div className="flex-1 min-w-0" onClick={onEdit}>
        <p className="text-[14px] font-semibold text-text leading-snug truncate">
          {expense.descripcion}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] font-medium text-text-sub">{formatFecha(expense.fecha)}</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-[15px] font-bold text-text tabular-nums">{sym}{expense.monto.toFixed(2)}</span>
        <span style={{
          background: PERSONA_COLOR[persona], color: '#fff',
          fontSize: 9, fontWeight: 700, letterSpacing: 0.5,
          textTransform: 'uppercase', padding: '2px 6px', borderRadius: 4,
        }}>
          {PERSONA_LABEL[persona]}
        </span>
      </div>
      <div className="border-l border-border pl-2 border-opacity-60 overflow-hidden flex flex-col items-center">
        <button
          onClick={onDelete}
          className="text-text-sub hover:text-accent opacity-50 block p-1 transition-opacity active:scale-90"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 2l8 8M10 2l-8 8" /></svg>
        </button>
      </div>
    </div>
  )
}

// ── AddExpenseModal ───────────────────────────────────────────────────────────

const CATEGORIES: ExpenseCategory[] = ['alojamiento', 'comida', 'transporte', 'actividades', 'compras', 'otro']

type ExpenseForm = {
  descripcion: string
  monto: string
  categoria: ExpenseCategory
  persona: 'flor' | 'pato' | 'ambos'
  fecha: string
  moneda: 'EUR' | 'USD'
}

function expenseToForm(e: Omit<Expense, 'id'>): ExpenseForm {
  return {
    descripcion: e.descripcion,
    monto: String(e.monto),
    categoria: e.categoria,
    persona: e.persona ?? 'ambos',
    fecha: e.fecha,
    moneda: e.moneda ?? 'EUR',
  }
}

function AddExpenseModal({ open, onClose, onSave, initialValues, mode = 'add' }: {
  open: boolean
  onClose: () => void
  onSave: (data: Omit<Expense, 'id'>) => void
  initialValues?: Omit<Expense, 'id'>
  mode?: 'add' | 'edit'
}) {
  const defaultForm: ExpenseForm = {
    descripcion: '',
    monto: '',
    categoria: 'comida',
    persona: 'ambos',
    fecha: todayISO(),
    moneda: 'EUR',
  }
  const [form, setForm] = useState<ExpenseForm>(defaultForm)
  const prevOpen = useRef(false)

  useEffect(() => {
    if (open && !prevOpen.current) {
      if (initialValues) {
        setForm(expenseToForm(initialValues))
      } else {
        setForm({ ...defaultForm, fecha: todayISO() })
      }
    }
    prevOpen.current = open
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const montoNum = parseFloat(form.monto)
  const isValid = form.descripcion.trim() !== '' && !isNaN(montoNum) && montoNum > 0

  function handleSave() {
    if (!isValid) return
    onSave({
      descripcion: form.descripcion.trim(),
      monto: montoNum,
      categoria: form.categoria,
      persona: form.persona,
      fecha: form.fecha,
      moneda: form.moneda,
    })
    onClose()
  }

  const modalTitle = mode === 'edit' ? 'Editar gasto' : 'Agregar gasto'
  const btnLabel = mode === 'edit' ? 'Guardar cambios' : 'Agregar gasto'

  return (
    <Modal open={open} onClose={onClose} title={modalTitle}>
      <div className="flex flex-col gap-4">

        {/* Descripción */}
        <div>
          <label className="text-[11px] font-medium text-text-sub block mb-1.5">Descripción</label>
          <input
            type="text"
            className="input"
            placeholder="ej. Cena en la Boqueria"
            value={form.descripcion}
            onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
          />
        </div>

        {/* Monto + moneda en la misma fila */}
        <div>
          <label className="text-[11px] font-medium text-text-sub block mb-1.5">Monto</label>
          <div className="flex gap-2">
            {/* EUR / USD toggle */}
            <div className="flex p-0.5 gap-0.5 rounded-[10px] shrink-0" style={{ background: '#EDEAE6' }}>
              {(['EUR', 'USD'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setForm(f => ({ ...f, moneda: m }))}
                  className="px-3 h-full rounded-[8px] text-[12px] font-bold transition-all duration-150 active:scale-95"
                  style={{
                    background: form.moneda === m ? '#fff' : 'transparent',
                    color: form.moneda === m ? '#1C1917' : '#A09890',
                    boxShadow: form.moneda === m ? '0 1px 3px rgba(28,25,23,0.10)' : 'none',
                  }}
                >
                  {m === 'EUR' ? '€ EUR' : '$ USD'}
                </button>
              ))}
            </div>
            {/* Amount input */}
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] font-medium text-text-sub pointer-events-none">
                {CURRENCY_SYMBOL[form.moneda]}
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                className="input"
                style={{ paddingLeft: 24 }}
                placeholder="0.00"
                value={form.monto}
                onChange={e => setForm(f => ({ ...f, monto: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className="-mx-5 h-px bg-border" />

        {/* Categoría */}
        <div>
          <p className="text-[11px] font-bold text-text-sub uppercase tracking-wider mb-2.5">Categoría</p>
          <div className="grid grid-cols-3 gap-1.5">
            {CATEGORIES.map(cat => {
              const selected = form.categoria === cat
              const color = CATEGORY_COLORS[cat]
              return (
                <button
                  key={cat}
                  onClick={() => setForm(f => ({ ...f, categoria: cat }))}
                  className="flex flex-col items-center gap-1 py-3 rounded-btn transition-all duration-150 active:scale-95"
                  style={{
                    backgroundColor: selected ? `${color}18` : '#F5F3F0',
                    border: `1.5px solid ${selected ? color : 'transparent'}`,
                  }}
                >
                  <CategoryIcon categoria={cat} size={18} color={selected ? color : '#A09890'} />
                  <span className="text-[10px] font-bold leading-none" style={{ color: selected ? color : '#A09890' }}>
                    {CATEGORY_LABELS[cat]}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="-mx-5 h-px bg-border" />

        {/* Quién pagó */}
        <div>
          <p className="text-[11px] font-bold text-text-sub uppercase tracking-wider mb-2.5">Quién pagó</p>
          <div className="flex p-1 gap-1 rounded-input" style={{ background: '#EDEAE6' }}>
            {(['flor', 'pato', 'ambos'] as const).map(p => (
              <button
                key={p}
                onClick={() => setForm(f => ({ ...f, persona: p }))}
                className="flex-1 h-11 rounded-[9px] text-[13px] font-semibold transition-all duration-200 active:scale-[0.97]"
                style={{
                  background: form.persona === p ? PERSONA_COLOR[p] : 'transparent',
                  color: form.persona === p ? '#fff' : '#A09890',
                  boxShadow: form.persona === p ? '0 1px 3px rgba(28,25,23,0.10)' : 'none',
                }}
              >
                {PERSONA_LABEL[p]}
              </button>
            ))}
          </div>
        </div>

        {/* Fecha */}
        <div>
          <label className="text-[11px] font-medium text-text-sub block mb-1.5">Fecha</label>
          <input
            type="date"
            className="input"
            value={form.fecha}
            onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!isValid}
          className="btn-primary disabled:opacity-40"
        >
          {btnLabel}
        </button>

      </div>
    </Modal>
  )
}

// ── GastosPage ────────────────────────────────────────────────────────────────

export function GastosPage({ fabTrigger }: { fabTrigger?: number }) {
  const { expenses, loading, addExpense, deleteExpense, updateExpense } = useExpenses()
  const [showAdd, setShowAdd] = useState(false)
  const [editExpense, setEditExpense] = useState<Expense | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [filterPersona, setFilterPersona] = useState<'todos' | 'flor' | 'pato' | 'ambos'>('todos')

  // FAB trigger → open AddExpenseModal (ignore mount value)
  const fabRef = useRef(fabTrigger)
  useEffect(() => {
    if (fabTrigger !== fabRef.current) {
      fabRef.current = fabTrigger
      setShowAdd(true)
    }
  }, [fabTrigger])

  const eurExpenses = expenses.filter(e => (e.moneda ?? 'EUR') === 'EUR')
  const usdExpenses = expenses.filter(e => e.moneda === 'USD')

  function currencyData(exps: Expense[]): CurrencyData {
    return {
      total: exps.reduce((s, e) => s + e.monto, 0),
      florTotal: exps.filter(e => e.persona === 'flor').reduce((s, e) => s + e.monto, 0),
      patoTotal: exps.filter(e => e.persona === 'pato').reduce((s, e) => s + e.monto, 0),
      ambosTotal: exps.filter(e => !e.persona || e.persona === 'ambos').reduce((s, e) => s + e.monto, 0),
    }
  }

  const eurData = eurExpenses.length > 0 ? currencyData(eurExpenses) : null
  const usdData = usdExpenses.length > 0 ? currencyData(usdExpenses) : null

  const byCatEUR = eurExpenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.categoria] = (acc[e.categoria] ?? 0) + e.monto
    return acc
  }, {})
  const byCatUSD = usdExpenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.categoria] = (acc[e.categoria] ?? 0) + e.monto
    return acc
  }, {})

  // Filtered list for display
  const filteredExpenses = filterPersona === 'todos'
    ? expenses
    : expenses.filter(e => (e.persona ?? 'ambos') === filterPersona)

  // Group by date desc
  const byDate = new Map<string, Expense[]>()
  for (const e of filteredExpenses) {
    if (!byDate.has(e.fecha)) byDate.set(e.fecha, [])
    byDate.get(e.fecha)!.push(e)
  }
  const groupedDates = [...byDate.entries()].sort(([a], [b]) => b.localeCompare(a))

  const hasExpenses = expenses.length > 0

  const FILTER_OPTIONS = [
    { value: 'todos' as const, label: 'Todos', color: '#C8472A' },
    { value: 'flor' as const, label: 'Flor', color: '#C8472A' },
    { value: 'pato' as const, label: 'Pato', color: '#004D98' },
    { value: 'ambos' as const, label: 'Compartido', color: '#78716C' },
  ]

  return (
    <div className="page flex flex-col gap-4">

      {/* ResumenCard */}
      {hasExpenses && (
        <div className="animate-card-enter card-stagger-1">
          <ResumenCard eurData={eurData} usdData={usdData} />
        </div>
      )}

      {/* CategoryBreakdown */}
      {hasExpenses && (
        <div className="animate-card-enter card-stagger-2">
          <CategoryBreakdown byCatEUR={byCatEUR} byCatUSD={byCatUSD} />
        </div>
      )}

      {/* Header + list */}
      <div className="animate-card-enter card-stagger-3 flex flex-col gap-3">

        <div className="page-title-row">
          <h2 className="page-title">Gastos</h2>
        </div>

        {/* Filter chips */}
        {hasExpenses && (
          <div className="flex gap-2 px-1">
            {FILTER_OPTIONS.map(({ value, label, color }) => {
              const active = filterPersona === value
              return (
                <button
                  key={value}
                  onClick={() => setFilterPersona(value)}
                  className="px-4 h-10 rounded-full text-[13px] font-semibold transition-all duration-150"
                  style={{
                    background: active ? color : 'transparent',
                    color: active ? '#FFFFFF' : '#78716C',
                    border: active ? 'none' : '1px solid #E7E2DC',
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && !hasExpenses && (
          <div className="flex flex-col items-center gap-2 py-8 rounded-card border border-dashed border-border bg-surface">
            <p className="text-[13px] text-text-sub text-center px-4">
              Registra los gastos del viaje para llevar el balance
            </p>
            <button
              onClick={() => setShowAdd(true)}
              className="btn-primary h-12 px-6 text-[15px] w-full"
            >
              + Gasto
            </button>
          </div>
        )}

        {/* Filtered empty */}
        {hasExpenses && filterPersona !== 'todos' && filteredExpenses.length === 0 && (
          <div className="py-6 text-center text-[13px] text-text-sub">
            Sin gastos de {filterPersona === 'flor' ? 'Flor' : filterPersona === 'pato' ? 'Pato' : 'compartidos'} aún
          </div>
        )}

        {/* Expense rows grouped by date */}
        {groupedDates.length > 0 && (
          <div className="flex flex-col gap-4">
            {groupedDates.map(([fecha, exps]) => (
              <div key={fecha}>
                <div className="flex items-center gap-3 mb-2 ml-1">
                  <span className="text-[12px] font-bold text-text bg-accent-light text-accent px-2.5 py-1 rounded-md">
                    {formatFecha(fecha)}
                  </span>
                </div>
                {exps.map(exp => (
                  <ExpenseRow
                    key={exp.id}
                    expense={exp}
                    onDelete={() => setConfirmDeleteId(exp.id)}
                    onEdit={() => setEditExpense(exp)}
                  />
                ))}
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Modal agregar */}
      <AddExpenseModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={addExpense}
      />

      {/* Modal editar */}
      <AddExpenseModal
        mode="edit"
        open={editExpense !== null}
        onClose={() => setEditExpense(null)}
        initialValues={editExpense ? {
          descripcion: editExpense.descripcion,
          monto: editExpense.monto,
          categoria: editExpense.categoria,
          persona: editExpense.persona,
          fecha: editExpense.fecha,
          moneda: editExpense.moneda,
        } : undefined}
        onSave={(data) => {
          if (editExpense) updateExpense(editExpense.id, data)
        }}
      />

      {/* Confirm delete */}
      <ConfirmSheet
        open={confirmDeleteId !== null}
        title="Eliminar gasto"
        message="¿Estás seguro? Esta acción no se puede deshacer."
        onConfirm={() => {
          if (confirmDeleteId) deleteExpense(confirmDeleteId)
          setConfirmDeleteId(null)
        }}
        onCancel={() => setConfirmDeleteId(null)}
      />

    </div>
  )
}
