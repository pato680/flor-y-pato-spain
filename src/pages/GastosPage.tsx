import { useState } from 'react'
import { Header } from '../components/Header'
import { Modal } from '../components/Modal'
import { useExpenses, CATEGORY_LABELS, CATEGORY_COLORS } from '../hooks/useExpenses'
import type { Expense, ExpenseCategory } from '../lib/types'

const CATEGORIES: ExpenseCategory[] = ['alojamiento', 'comida', 'transporte', 'actividades', 'compras', 'otro']

function formatEUR(amount: number) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount)
}

export function GastosPage() {
  const { expenses, loading, addExpense, deleteExpense, total, byCategory } = useExpenses()
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<Omit<Expense, 'id'>>({
    descripcion: '',
    monto: 0,
    categoria: 'otro',
    fecha: new Date().toISOString().split('T')[0] ?? '',
    persona: 'ambos',
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    if (!form.descripcion.trim() || form.monto <= 0) return
    setSaving(true)
    await addExpense(form)
    setForm({ descripcion: '', monto: 0, categoria: 'otro', fecha: new Date().toISOString().split('T')[0] ?? '', persona: 'ambos' })
    setSaving(false)
    setModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-app-bg">
      <Header
        title="Gastos"
        subtitle={expenses.length > 0 ? `Total: ${formatEUR(total)}` : 'Registro de gastos'}
        right={
          <button
            onClick={() => setModalOpen(true)}
            className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg"
          >
            + Gasto
          </button>
        }
      />

      <div className="pt-header pb-nav px-4">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <span className="text-gray-600 text-sm">Cargando…</span>
          </div>
        ) : (
          <>
            {/* Summary by category */}
            {Object.keys(byCategory).length > 0 && (
              <div className="mt-3 mb-4 animate-card-in">
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">
                  Resumen por categoría
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(byCategory) as [ExpenseCategory, number][]).map(([cat, amount]) => (
                    <div key={cat} className="bg-gray-900 border border-gray-800 rounded-xl p-3 flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: CATEGORY_COLORS[cat] }}
                      />
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-500 font-semibold uppercase truncate">{CATEGORY_LABELS[cat]}</p>
                        <p className="text-sm font-bold text-white">{formatEUR(amount)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total */}
            {expenses.length > 0 && (
              <div className="bg-gray-900 border border-red-900/30 rounded-xl p-4 mb-4 animate-card-in">
                <p className="text-xs text-gray-500 font-semibold mb-1">Total gastado</p>
                <p className="text-3xl font-black text-white">{formatEUR(total)}</p>
              </div>
            )}

            {/* Expenses list */}
            {expenses.length === 0 ? (
              <div className="text-center py-16 animate-fade-in">
                <p className="text-4xl mb-3">💶</p>
                <p className="text-gray-500 text-sm">Registra tus gastos del viaje</p>
                <button
                  onClick={() => setModalOpen(true)}
                  className="mt-4 bg-gray-800 text-gray-300 text-sm font-semibold px-5 py-2.5 rounded-xl"
                >
                  Agregar primer gasto
                </button>
              </div>
            ) : (
              <div>
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">
                  Historial — {expenses.length}
                </p>
                <div className="flex flex-col gap-2">
                  {expenses.map((exp) => (
                    <ExpenseRow
                      key={exp.id}
                      expense={exp}
                      onDelete={() => deleteExpense(exp.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo gasto">
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-500 w-full"
          />
          <input
            type="number"
            placeholder="Monto (€)"
            value={form.monto || ''}
            onChange={(e) => setForm({ ...form, monto: parseFloat(e.target.value) || 0 })}
            className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-500 w-full"
            min="0"
            step="0.01"
          />
          <div className="grid grid-cols-3 gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setForm({ ...form, categoria: cat })}
                className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                  form.categoria === cat
                    ? 'border-white text-white bg-white/10'
                    : 'border-gray-700 text-gray-500 bg-transparent'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
          <input
            type="date"
            value={form.fecha}
            onChange={(e) => setForm({ ...form, fecha: e.target.value })}
            className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gray-500 w-full"
          />
          <button
            onClick={handleSubmit}
            disabled={saving || !form.descripcion.trim() || form.monto <= 0}
            className="bg-red-600 text-white font-bold py-3 rounded-xl text-sm disabled:opacity-40 mt-1"
          >
            {saving ? 'Guardando…' : 'Guardar gasto'}
          </button>
        </div>
      </Modal>
    </div>
  )
}

interface ExpenseRowProps {
  expense: Expense
  onDelete: () => void
}

function ExpenseRow({ expense, onDelete }: ExpenseRowProps) {
  return (
    <div className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 animate-card-in group">
      <div
        className="w-1.5 self-stretch rounded-full flex-shrink-0"
        style={{ background: CATEGORY_COLORS[expense.categoria] }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{expense.descripcion}</p>
        <p className="text-xs text-gray-600 mt-0.5">{CATEGORY_LABELS[expense.categoria]} · {expense.fecha}</p>
      </div>
      <span className="text-sm font-bold text-white flex-shrink-0">{formatEUR(expense.monto)}</span>
      <button
        onClick={onDelete}
        className="text-gray-700 hover:text-red-500 transition-colors text-lg opacity-0 group-hover:opacity-100 focus:opacity-100 ml-1"
      >
        ×
      </button>
    </div>
  )
}
