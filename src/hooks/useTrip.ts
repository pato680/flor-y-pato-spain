import { useState, useEffect } from 'react'
import { ref, onValue, set, remove } from 'firebase/database'
import { db, PATHS } from '../lib/firebase'
import type { Day, TripEvent, EventType } from '../lib/types'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

// Default trip data
const DEFAULT_DAYS: Day[] = [
  {
    id: 'day1',
    fecha: '2026-06-10',
    ciudad: 'Madrid',
    color: '#D71920',
    eventos: [
      { id: 'e1', hora: '09:00', titulo: 'Llegada al aeropuerto', detalle: 'Adolfo Suárez MAD', tipo: 'vuelo' },
      { id: 'e2', hora: '12:00', titulo: 'Check-in hotel', detalle: 'Centro de Madrid', tipo: 'hotel' },
      { id: 'e3', hora: '15:00', titulo: 'Gran Vía & Puerta del Sol', detalle: 'Paseo por el centro', tipo: 'actividad' },
    ],
  },
  {
    id: 'day2',
    fecha: '2026-06-11',
    ciudad: 'Madrid',
    color: '#D71920',
    eventos: [
      { id: 'e4', hora: '10:00', titulo: 'Museo del Prado', detalle: 'Arte clásico español', tipo: 'actividad' },
      { id: 'e5', hora: '14:00', titulo: 'Almuerzo en La Latina', detalle: 'Tapas típicas', tipo: 'comida' },
      { id: 'e6', hora: '20:00', titulo: 'Cena Flamenco', detalle: 'Tablao flamenco', tipo: 'actividad' },
    ],
  },
  {
    id: 'day3',
    fecha: '2026-06-12',
    ciudad: 'Barcelona',
    color: '#004D98',
    eventos: [
      { id: 'e7', hora: '08:30', titulo: 'Tren AVE Madrid-Barcelona', detalle: '2h 30min aprox', tipo: 'transporte' },
      { id: 'e8', hora: '12:00', titulo: 'La Sagrada Familia', detalle: 'Basílica de Gaudí', tipo: 'actividad' },
      { id: 'e9', hora: '19:00', titulo: 'Barceloneta', detalle: 'Playa y chiringuitos', tipo: 'actividad' },
    ],
  },
  {
    id: 'day4',
    fecha: '2026-06-13',
    ciudad: 'Barcelona',
    color: '#004D98',
    eventos: [
      { id: 'e10', hora: '10:00', titulo: 'Park Güell', detalle: 'Mosaicos de Gaudí', tipo: 'actividad' },
      { id: 'e11', hora: '14:00', titulo: 'Las Ramblas', detalle: 'Paseo y mercado La Boqueria', tipo: 'actividad' },
    ],
  },
  {
    id: 'day5',
    fecha: '2026-06-14',
    ciudad: 'Valencia',
    color: '#FF6B2B',
    eventos: [
      { id: 'e12', hora: '09:00', titulo: 'Tren a Valencia', detalle: '3h aprox', tipo: 'transporte' },
      { id: 'e13', hora: '13:00', titulo: 'Ciudad de las Artes y las Ciencias', detalle: 'Arquitectura futurista', tipo: 'actividad' },
      { id: 'e14', hora: '14:30', titulo: 'Paella valenciana', detalle: 'Restaurante típico', tipo: 'comida' },
    ],
  },
  {
    id: 'day6',
    fecha: '2026-06-15',
    ciudad: 'Valencia',
    color: '#FF6B2B',
    eventos: [
      { id: 'e15', hora: '10:00', titulo: 'Playa de la Malvarrosa', detalle: 'Mañana de playa', tipo: 'actividad' },
      { id: 'e16', hora: '20:00', titulo: 'Vuelo de regreso', detalle: 'VLC → Buenos Aires', tipo: 'vuelo' },
    ],
  },
]

export function useTrip() {
  const [days, setDays] = useState<Day[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const tripRef = ref(db, PATHS.trip)
    const unsubscribe = onValue(tripRef, async (snap) => {
      const data = snap.val()
      if (data && data.days) {
        const list: Day[] = Object.entries(data.days).map(([id, val]) => {
          const d = val as Omit<Day, 'id' | 'eventos'>  & { eventos?: Record<string, Omit<TripEvent, 'id'>> }
          const eventos: TripEvent[] = d.eventos
            ? Object.entries(d.eventos).map(([eid, ev]) => ({ id: eid, ...ev }))
            : []
          return { id, ...d, eventos }
        })
        list.sort((a, b) => a.fecha.localeCompare(b.fecha))
        setDays(list)
      } else {
        // Seed with default data
        const daysObj: Record<string, unknown> = {}
        for (const day of DEFAULT_DAYS) {
          const { id, eventos, ...dayData } = day
          const eventosObj: Record<string, unknown> = {}
          for (const ev of eventos) {
            const { id: eid, ...evData } = ev
            eventosObj[eid] = evData
          }
          daysObj[id] = { ...dayData, eventos: eventosObj }
        }
        await set(ref(db, PATHS.trip), { days: daysObj })
        setDays(DEFAULT_DAYS)
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

  const cities = [...new Set(days.map((d) => d.ciudad))]

  return { days, loading, addEvent, deleteEvent, cities }
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
