import { useState, useEffect } from 'react'
import { ref, onValue, set, remove } from 'firebase/database'
import { db, PATHS } from '../lib/firebase'
import type { Day, TripEvent, EventType } from '../lib/types'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export function useTrip() {
  const [days, setDays] = useState<Day[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const tripRef = ref(db, PATHS.trip)
    const unsubscribe = onValue(tripRef, (snap) => {
      const data = snap.val()
      if (data && data.days) {
        const list: Day[] = Object.entries(data.days).map(([id, val]) => {
          const d = val as Omit<Day, 'id' | 'eventos'> & { eventos?: Record<string, Omit<TripEvent, 'id'>> }
          const eventos: TripEvent[] = d.eventos
            ? Object.entries(d.eventos).map(([eid, ev]) => ({ id: eid, ...ev }))
            : []
          return { id, ...d, eventos }
        })
        list.sort((a, b) => a.fecha.localeCompare(b.fecha))
        setDays(list)
      } else {
        setDays([])
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const addEvent = async (dayId: string, event: Omit<TripEvent, 'id'>) => {
    const id = generateId()
    await set(ref(db, `${PATHS.trip}/days/${dayId}/eventos/${id}`), event)
  }

  const deleteEvent = async (dayId: string, eventId: string) => {
    await remove(ref(db, `${PATHS.trip}/days/${dayId}/eventos/${eventId}`))
  }

  const addDay = async (day: Omit<Day, 'id' | 'eventos'>) => {
    const id = generateId()
    await set(ref(db, `${PATHS.trip}/days/${id}`), { ...day, eventos: {} })
  }

  const cities = [...new Set(days.map((d) => d.ciudad))]

  return { days, loading, addEvent, deleteEvent, addDay, cities }
}

export const EVENT_ICONS: Record<EventType, string> = {
  vuelo: '✈️',
  hotel: '🏨',
  actividad: '🎯',
  comida: '🍽️',
  transporte: '🚆',
  otro: '📌',
}

export const EVENT_COLORS: Record<EventType, string> = {
  vuelo: '#6366f1',
  hotel: '#f59e0b',
  actividad: '#10b981',
  comida: '#f97316',
  transporte: '#3b82f6',
  otro: '#6b7280',
}
