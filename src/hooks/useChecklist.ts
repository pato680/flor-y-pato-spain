import { useState, useEffect } from 'react'
import { ref, onValue, set, remove } from 'firebase/database'
import { db, PATHS } from '../lib/firebase'
import type { ChecklistItem } from '../lib/types'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export function useChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ckRef = ref(db, PATHS.checklist)
    const unsubscribe = onValue(ckRef, (snap) => {
      const data = snap.val()
      if (data) {
        const list = Object.entries(data).map(([id, val]) => ({
          id,
          ...(val as Omit<ChecklistItem, 'id'>),
        }))
        setItems(list)
      } else {
        setItems([])
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const addItem = async (texto: string, categoria?: string) => {
    const id = generateId()
    const item: ChecklistItem = { id, texto, completado: false, categoria }
    await set(ref(db, `${PATHS.checklist}/${id}`), { texto, completado: false, categoria })
    return item
  }

  const toggleItem = async (id: string, completado: boolean) => {
    await set(ref(db, `${PATHS.checklist}/${id}/completado`), completado)
  }

  const deleteItem = async (id: string) => {
    await remove(ref(db, `${PATHS.checklist}/${id}`))
  }

  const completed = items.filter((i) => i.completado).length
  const total = items.length
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0

  return { items, loading, addItem, toggleItem, deleteItem, completed, total, progress }
}
