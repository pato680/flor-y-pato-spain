import { useState, useEffect } from 'react'
import { ref, onValue, set, remove } from 'firebase/database'
import { db, PATHS } from '../lib/firebase'
import type { Expense, ExpenseCategory } from '../lib/types'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const expRef = ref(db, PATHS.expenses)
    const unsubscribe = onValue(expRef, (snap) => {
      const data = snap.val()
      if (data) {
        const list = Object.entries(data).map(([id, val]) => ({
          id,
          ...(val as Omit<Expense, 'id'>),
        }))
        list.sort((a, b) => b.fecha.localeCompare(a.fecha))
        setExpenses(list)
      } else {
        setExpenses([])
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const addExpense = async (data: Omit<Expense, 'id'>) => {
    const id = generateId()
    await set(ref(db, `${PATHS.expenses}/${id}`), data)
  }

  const deleteExpense = async (id: string) => {
    await remove(ref(db, `${PATHS.expenses}/${id}`))
  }

  const total = expenses.reduce((sum, e) => sum + e.monto, 0)

  const byCategory = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.categoria] = (acc[e.categoria] ?? 0) + e.monto
    return acc
  }, {})

  return { expenses, loading, addExpense, deleteExpense, total, byCategory }
}

export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  alojamiento: 'Alojamiento',
  comida: 'Comida',
  transporte: 'Transporte',
  actividades: 'Actividades',
  compras: 'Compras',
  otro: 'Otro',
}

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  alojamiento: '#6366f1',
  comida: '#f59e0b',
  transporte: '#3b82f6',
  actividades: '#10b981',
  compras: '#ec4899',
  otro: '#6b7280',
}
