export type EventType = 'vuelo' | 'hotel' | 'actividad' | 'comida' | 'transporte' | 'otro' | 'gp'

export interface TripEvent {
  id: string
  fecha?: string   // ISO date string — en qué día ocurre el evento
  hora: string
  titulo: string
  detalle?: string
  tipo: EventType
}

export interface Day {
  id: string
  fechaInicio: string   // ISO date string, e.g. "2026-06-06"
  fechaFin: string      // ISO date string, e.g. "2026-06-09"
  ciudad: string
  color: string
  eventos: TripEvent[]
}

export interface Note {
  id: string
  titulo?: string
  texto: string
  creadoEn: number
}

export interface ChecklistItem {
  id: string
  texto: string
  completado: boolean
  categoria?: string
}

export interface Expense {
  id: string
  descripcion: string
  monto: number
  categoria: ExpenseCategory
  fecha: string
  persona?: 'flor' | 'pato' | 'ambos'
  moneda?: 'EUR' | 'USD'
}

export type ExpenseCategory =
  | 'alojamiento'
  | 'comida'
  | 'transporte'
  | 'actividades'
  | 'compras'
  | 'otro'

export interface TripData {
  days: Day[]
  updatedAt?: number
}
