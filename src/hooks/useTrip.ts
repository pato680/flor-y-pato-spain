import { useState, useEffect } from 'react'
import { ref, onValue, set, remove, update } from 'firebase/database'
import { db, PATHS } from '../lib/firebase'
import type { Day, TripEvent, EventType } from '../lib/types'
import { generateId } from '../lib/utils'

export function useTrip() {
  const [days, setDays] = useState<Day[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const tripRef = ref(db, PATHS.trip)
    const unsubscribe = onValue(tripRef, (snap) => {
      const data = snap.val()
      if (data && data.days) {
        const list: Day[] = Object.entries(data.days)
          .filter(([, val]) => val != null && (val as Record<string, unknown>).fechaInicio)
          .map(([id, val]) => {
            const d = val as Omit<Day, 'id' | 'eventos'> & { eventos?: Record<string, Omit<TripEvent, 'id'>> }
            const eventos: TripEvent[] = d.eventos
              ? Object.entries(d.eventos).map(([eid, ev]) => ({ id: eid, ...ev }))
              : []
            return { id, ...d, eventos }
          })
        list.sort((a, b) => (a.fechaInicio ?? '').localeCompare(b.fechaInicio ?? ''))
        setDays(list)
      } else {
        setDays([])
      }
      setLoading(false)
    }, (error) => {
      console.error('useTrip:', error.message)
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

  const updateDay = async (dayId: string, data: Omit<Day, 'id' | 'eventos'>) => {
    await update(ref(db, `${PATHS.trip}/days/${dayId}`), data)
  }

  const deleteDay = async (dayId: string) => {
    await remove(ref(db, `${PATHS.trip}/days/${dayId}`))
  }

  const updateEvent = async (dayId: string, eventId: string, data: Omit<TripEvent, 'id'>) => {
    await set(ref(db, `${PATHS.trip}/days/${dayId}/eventos/${eventId}`), data)
  }

  const cities = [...new Set(days.map((d) => d.ciudad))]

  return { days, loading, addEvent, deleteEvent, addDay, updateDay, deleteDay, updateEvent, cities }
}

export const EVENT_COLORS: Record<EventType, string> = {
  vuelo: '#7838C8',
  hotel: '#0070C8',
  actividad: '#F09000',
  comida: '#F09000',
  transporte: '#00965E',
  otro: '#9A9A94',
  gp: '#E10600',
}
