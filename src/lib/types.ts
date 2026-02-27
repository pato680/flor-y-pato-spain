export type EventType = 'vuelo' | 'hotel' | 'actividad' | 'comida' | 'transporte' | 'otro'

export interface TripEvent {
  id: string
  hora: string
  titulo: string
  detalle?: string
  tipo: EventType
}

export interface Day {
  id: string
  fecha: string     // ISO date string, e.g. "2026-06-10"
  ciudad: string
  color: string
  eventos: TripEvent[]
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
