import { useState } from 'react'
import { Header } from '../components/Header'
import { Countdown } from '../components/Countdown'
import { Modal } from '../components/Modal'
import { useTrip, EVENT_ICONS, EVENT_COLORS } from '../hooks/useTrip'
import type { Day, TripEvent, EventType } from '../lib/types'

const EVENT_TYPES: EventType[] = ['vuelo', 'hotel', 'actividad', 'comida', 'transporte', 'otro']

function formatDate(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function ItinerarioPage() {
  const { days, loading, addEvent, deleteEvent, cities } = useTrip()
  const [cityFilter, setCityFilter] = useState<string>('Todos')
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set(['day1']))
  const [addModal, setAddModal] = useState<{ open: boolean; dayId: string } | null>(null)
  const [newEvent, setNewEvent] = useState<Omit<TripEvent, 'id'>>({
    hora: '10:00',
    titulo: '',
    detalle: '',
    tipo: 'actividad',
  })
  const [saving, setSaving] = useState(false)

  const filtered = cityFilter === 'Todos' ? days : days.filter((d) => d.ciudad === cityFilter)

  const toggleDay = (id: string) => {
    setExpandedDays((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const openAddModal = (dayId: string) => {
    setAddModal({ open: true, dayId })
    setNewEvent({ hora: '10:00', titulo: '', detalle: '', tipo: 'actividad' })
  }

  const handleAddEvent = async () => {
    if (!addModal || !newEvent.titulo.trim()) return
    setSaving(true)
    await addEvent(addModal.dayId, newEvent)
    setSaving(false)
    setAddModal(null)
  }

  // Group days by city for visual separation
  const groupedDays: { city: string; color: string; days: Day[] }[] = []
  for (const day of filtered) {
    const last = groupedDays[groupedDays.length - 1]
    if (last && last.city === day.ciudad) {
      last.days.push(day)
    } else {
      groupedDays.push({ city: day.ciudad, color: day.color, days: [day] })
    }
  }

  return (
    <div className="min-h-screen bg-app-bg">
      <Header title="Itinerario" subtitle="España — Junio 2026" />

      <div className="pt-header pb-nav px-4">
        <div className="mt-3">
          <Countdown />
        </div>

        {/* City filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-4 -mx-4 px-4 scrollbar-hide">
          {['Todos', ...cities].map((city) => (
            <button
              key={city}
              onClick={() => setCityFilter(city)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${
                cityFilter === city
                  ? 'bg-red-600 border-red-600 text-white'
                  : 'bg-transparent border-gray-800 text-gray-500'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <span className="text-gray-600 text-sm">Cargando…</span>
          </div>
        ) : (
          <div className="relative pl-8">
            {/* Timeline line */}
            <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-red-600 via-gray-800 to-red-600" />

            {groupedDays.map(({ city, color, days: cityDays }) => (
              <div key={city} className="mb-2">
                {/* City header */}
                <div className="relative mb-2 mt-4 first:mt-0">
                  <div
                    className="absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black border-2 border-app-bg z-10"
                    style={{ background: color }}
                  >
                    {city[0]}
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-black text-white uppercase tracking-wider">{city}</span>
                      <span className="text-xs text-gray-600 ml-2">{cityDays.length} día{cityDays.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>

                {/* Days */}
                {cityDays.map((day) => (
                  <DayRow
                    key={day.id}
                    day={day}
                    expanded={expandedDays.has(day.id)}
                    onToggle={() => toggleDay(day.id)}
                    onAddEvent={() => openAddModal(day.id)}
                    onDeleteEvent={(evId) => deleteEvent(day.id, evId)}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add event modal */}
      <Modal
        open={addModal?.open ?? false}
        onClose={() => setAddModal(null)}
        title="Agregar evento"
      >
        <div className="flex flex-col gap-3">
          <input
            type="time"
            value={newEvent.hora}
            onChange={(e) => setNewEvent({ ...newEvent, hora: e.target.value })}
            className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gray-500 w-full"
          />
          <input
            type="text"
            placeholder="Título del evento"
            value={newEvent.titulo}
            onChange={(e) => setNewEvent({ ...newEvent, titulo: e.target.value })}
            className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-500 w-full"
          />
          <input
            type="text"
            placeholder="Detalle (opcional)"
            value={newEvent.detalle ?? ''}
            onChange={(e) => setNewEvent({ ...newEvent, detalle: e.target.value })}
            className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-500 w-full"
          />
          <div className="grid grid-cols-3 gap-1.5">
            {EVENT_TYPES.map((tipo) => (
              <button
                key={tipo}
                onClick={() => setNewEvent({ ...newEvent, tipo })}
                className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1 ${
                  newEvent.tipo === tipo
                    ? 'border-white text-white bg-white/10'
                    : 'border-gray-700 text-gray-500 bg-transparent'
                }`}
              >
                <span>{EVENT_ICONS[tipo]}</span>
                <span className="capitalize">{tipo}</span>
              </button>
            ))}
          </div>
          <button
            onClick={handleAddEvent}
            disabled={saving || !newEvent.titulo.trim()}
            className="bg-red-600 text-white font-bold py-3 rounded-xl text-sm disabled:opacity-40 mt-1"
          >
            {saving ? 'Guardando…' : 'Agregar evento'}
          </button>
        </div>
      </Modal>
    </div>
  )
}

interface DayRowProps {
  day: Day
  expanded: boolean
  onToggle: () => void
  onAddEvent: () => void
  onDeleteEvent: (evId: string) => void
}

function DayRow({ day, expanded, onToggle, onAddEvent, onDeleteEvent }: DayRowProps) {
  return (
    <div className="relative mb-1.5">
      {/* Day dot */}
      <div
        className="absolute -left-8 top-4 w-2 h-2 rounded-full border border-app-bg z-10"
        style={{ background: day.color }}
      />

      {/* Day header - tappable */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-3 py-2.5 bg-gray-900/50 rounded-xl border border-gray-800/50 text-left"
      >
        <span className="text-sm font-black text-white">{formatDate(day.fecha)}</span>
        <span className="text-xs text-gray-600 ml-auto">{day.eventos.length} evento{day.eventos.length !== 1 ? 's' : ''}</span>
        <span className={`text-gray-600 text-xs transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* Events */}
      {expanded && (
        <div className="mt-1 flex flex-col gap-1 pl-0 animate-slide-up">
          {day.eventos
            .slice()
            .sort((a, b) => a.hora.localeCompare(b.hora))
            .map((ev) => (
              <EventRow key={ev.id} event={ev} onDelete={() => onDeleteEvent(ev.id)} />
            ))}
          <button
            onClick={onAddEvent}
            className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-800 rounded-xl text-xs text-gray-600 hover:text-gray-400 hover:border-gray-700 transition-colors"
          >
            <span>+</span>
            <span>Agregar evento</span>
          </button>
        </div>
      )}
    </div>
  )
}

interface EventRowProps {
  event: TripEvent
  onDelete: () => void
}

function EventRow({ event, onDelete }: EventRowProps) {
  return (
    <div className="flex items-start gap-2.5 px-3 py-2.5 bg-gray-900 border border-gray-800 rounded-xl group animate-card-in">
      <div
        className="w-1 self-stretch rounded-full flex-shrink-0 mt-0.5"
        style={{ background: EVENT_COLORS[event.tipo] }}
      />
      <span className="text-sm flex-shrink-0 mt-0.5">{EVENT_ICONS[event.tipo]}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{event.titulo}</p>
        {event.detalle && <p className="text-xs text-gray-600 mt-0.5">{event.detalle}</p>}
      </div>
      <span className="text-xs text-gray-600 font-mono flex-shrink-0 pt-0.5">{event.hora}</span>
      <button
        onClick={onDelete}
        className="text-gray-700 hover:text-red-500 transition-colors text-lg opacity-0 group-hover:opacity-100 focus:opacity-100"
      >
        ×
      </button>
    </div>
  )
}
