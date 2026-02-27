import { useState, useEffect, useCallback, useRef } from 'react'
import { ref, onValue, set } from 'firebase/database'
import { db, PATHS } from '../lib/firebase'

export function useNotes() {
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const notesRef = ref(db, PATHS.notes)
    const unsubscribe = onValue(notesRef, (snap) => {
      setNotes(snap.val() ?? '')
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const saveNotes = useCallback((value: string) => {
    setNotes(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSaving(true)
      await set(ref(db, PATHS.notes), value)
      setSaving(false)
    }, 800)
  }, [])

  return { notes, loading, saving, saveNotes }
}
