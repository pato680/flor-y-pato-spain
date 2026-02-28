import { useState, useEffect } from 'react'
import { ref, onValue, set, remove, update } from 'firebase/database'
import { db, PATHS } from '../lib/firebase'
import type { Note } from '../lib/types'
import { generateId } from '../lib/utils'

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const notesRef = ref(db, PATHS.notes)
    const unsubscribe = onValue(notesRef, (snap) => {
      const data = snap.val()
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        const list = Object.entries(data).map(([id, val]) => ({
          id,
          ...(val as Omit<Note, 'id'>),
        }))
        list.sort((a, b) => b.creadoEn - a.creadoEn)
        setNotes(list)
      } else {
        setNotes([])
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const addNote = async (texto: string, titulo?: string) => {
    const id = generateId()
    const data: Record<string, unknown> = { texto, creadoEn: Date.now() }
    if (titulo?.trim()) data.titulo = titulo.trim()
    await set(ref(db, `${PATHS.notes}/${id}`), data)
  }

  const updateNote = async (id: string, texto: string, titulo?: string) => {
    await update(ref(db, `${PATHS.notes}/${id}`), {
      texto,
      titulo: titulo?.trim() || null,
    })
  }

  const deleteNote = async (id: string) => {
    await remove(ref(db, `${PATHS.notes}/${id}`))
  }

  return { notes, loading, addNote, updateNote, deleteNote }
}
