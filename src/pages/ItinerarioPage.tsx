import { useState, useEffect, useRef } from 'react'
import { useTrip, EVENT_COLORS } from '../hooks/useTrip'
import type { Day, TripEvent, EventType } from '../lib/types'
import { Modal } from '../components/Modal'
import { ConfirmSheet } from '../components/ConfirmSheet'
import { Countdown } from '../components/Countdown'
import { parseDate, formatFecha } from '../lib/utils'

// ── EventIcon ─────────────────────────────────────────────────────────────────

function EventIcon({ tipo, size = 16, color: colorProp }: {
  tipo: EventType; size?: number; color?: string
}) {
  const color = colorProp ?? EVENT_COLORS[tipo]
  const sp = {
    stroke: color, strokeWidth: 1.4,
    strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      {tipo === 'vuelo' && <>
        <path {...sp} d="M13.5 2L2 9L6.5 10.5L8.5 14L10 11L13.5 2Z" fill={`${color}20`} />
        <path {...sp} d="M6.5 10.5L10 7" />
      </>}
      {tipo === 'hotel' && <>
        <rect {...sp} x="2.5" y="2" width="11" height="12" rx="1" />
        <path {...sp} d="M2.5 8.5h11" />
        <rect {...sp} x="6.5" y="9.5" width="3" height="4.5" rx=".5" />
        <rect {...sp} x="4" y="3.5" width="2.5" height="2.5" rx=".3" />
        <rect {...sp} x="9.5" y="3.5" width="2.5" height="2.5" rx=".3" />
      </>}
      {tipo === 'actividad' && <>
        <rect {...sp} x="1.5" y="5.5" width="13" height="9" rx="1.5" />
        <path {...sp} d="M5.5 5.5V4.5A1 1 0 016.5 3.5h3a1 1 0 011 1V5.5" />
        <circle {...sp} cx="8" cy="10" r="2.5" />
        <circle cx="12" cy="7.5" r=".8" fill={color} />
      </>}
      {tipo === 'comida' && <>
        <path {...sp} d="M6 2v3M8 2v3M6 5 A 1 1 0 0 1 8 5M7 6v8" />
        <path {...sp} d="M11.5 2L13 3V5.5H11.5V14" />
      </>}
      {tipo === 'transporte' && <>
        <rect {...sp} x="2.5" y="2.5" width="11" height="7" rx="1.5" />
        <path {...sp} d="M2.5 6.5h11" />
        <path {...sp} d="M5.5 9.5L4.5 13M10.5 9.5L11.5 13" />
        <circle cx="5.5" cy="11" r="1.2" stroke={color} strokeWidth="1.2" />
        <circle cx="10.5" cy="11" r="1.2" stroke={color} strokeWidth="1.2" />
        <path {...sp} d="M6.5 4.5h3" />
      </>}
      {tipo === 'otro' && <>
        <path {...sp} d="M8 13.5C8 13.5 3 9 3 6A5 5 0 0113 6C13 9 8 13.5 8 13.5Z" />
        <circle {...sp} cx="8" cy="6" r="1.5" />
      </>}
      {tipo === 'gp' && <>
        <path {...sp} d="M3.5 2v12" />
        <path {...sp} d="M3.5 2H12L10.5 6H14L12 10H3.5" fill={`${color}15`} />
        <rect x="3.5" y="2" width="2.25" height="2.25" fill={color} />
        <rect x="8" y="2" width="2.25" height="2.25" fill={color} />
        <rect x="5.75" y="4.25" width="2.25" height="2.25" fill={color} />
      </>}
    </svg>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatRango(fechaInicio: string, fechaFin: string): string {
  if (!fechaInicio) return ''
  if (fechaInicio === fechaFin) return formatFecha(fechaInicio)
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
  const d1 = parseDate(fechaInicio)
  const d2 = parseDate(fechaFin)
  const wd1 = cap(d1.toLocaleDateString('es-ES', { weekday: 'short' }).replace(/[.,]/g, '').trim())
  const wd2 = cap(d2.toLocaleDateString('es-ES', { weekday: 'short' }).replace(/[.,]/g, '').trim())
  const mo2 = cap(d2.toLocaleDateString('es-ES', { month: 'short' }).replace(/[.,]/g, '').trim())
  if (d1.getMonth() === d2.getMonth()) {
    return `${wd1} ${d1.getDate()} – ${wd2} ${d2.getDate()} ${mo2}`
  }
  const mo1 = cap(d1.toLocaleDateString('es-ES', { month: 'short' }).replace(/[.,]/g, '').trim())
  return `${wd1} ${d1.getDate()} ${mo1} – ${wd2} ${d2.getDate()} ${mo2}`
}

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  vuelo: 'VUELO',
  hotel: 'HOTEL',
  actividad: 'ACTIVIDAD',
  comida: 'COMIDA',
  transporte: 'TRANSPORTE',
  otro: 'OTRO',
  gp: 'GP F1',
}

function getDayLabel(fecha: string, tripStart: string): { dayNum: number; weekday: string } {
  const d = parseDate(fecha)
  const s = parseDate(tripStart)
  const dayNum = Math.floor((d.getTime() - s.getTime()) / 86400000) + 1
  const cap = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
  const weekday = cap(d.toLocaleDateString('es-ES', { weekday: 'short' }).replace(/[.,]/g, '').trim())
  return { dayNum, weekday }
}

// ── CitySection (timeline) ───────────────────────────────────────────────────

interface CitySectionProps {
  day: Day
  cityIndex: number
  onAddEvent: () => void
  onDeleteEvent: (eventId: string) => void
  onEditEvent: (event: TripEvent) => void
  onEditCity: () => void
}

function CitySection({ day, cityIndex, onAddEvent, onDeleteEvent, onEditEvent, onEditCity }: CitySectionProps) {
  const sortedEvents = [...day.eventos].sort((a, b) => {
    if (a.fecha && b.fecha && a.fecha !== b.fecha) return a.fecha.localeCompare(b.fecha)
    return a.hora.localeCompare(b.hora)
  })

  // Group events by date
  const byDate = new Map<string, TripEvent[]>()
  for (const ev of sortedEvents) {
    const key = ev.fecha || day.fechaInicio
    if (!byDate.has(key)) byDate.set(key, [])
    byDate.get(key)!.push(ev)
  }
  const groupedDates = [...byDate.entries()].sort(([a], [b]) => a.localeCompare(b))

  const hasEvents = sortedEvents.length > 0
  let dateGroupIndex = 0

  return (
    <div
      style={{ animation: `card-enter 350ms cubic-bezier(.32,.72,0,1) ${80 + cityIndex * 60}ms both` }}
    >
      {/* City node + header */}
      <div style={{ position: 'relative', paddingLeft: 36, marginBottom: 12, minHeight: 28 }}>
        {/* City dot */}
        <div style={{
          position: 'absolute',
          left: -8,
          top: 2,
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: day.color,
          border: '3px solid #F5F5F3',
          boxShadow: `0 0 0 2px ${day.color}40`,
          animation: `dot-pop 400ms cubic-bezier(.32,.72,0,1) ${100 + cityIndex * 80}ms both`,
          zIndex: 2,
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 17,
                fontWeight: 700,
                color: '#0F0F0F',
              }}>
                {day.ciudad}
              </span>
              {day.eventos.some(e => e.tipo === 'gp') && (
                <span style={{
                  fontFamily: '"Azeret Mono", monospace',
                  fontSize: 9,
                  fontWeight: 700,
                  color: '#FFF',
                  background: '#E10600',
                  padding: '3px 8px',
                  borderRadius: 4,
                }}>
                  GP F1
                </span>
              )}
            </div>
            <span style={{
              fontFamily: '"Azeret Mono", monospace',
              fontSize: 10,
              color: '#9A9A94',
              marginTop: 2,
              display: 'block',
            }}>
              {formatRango(day.fechaInicio, day.fechaFin)}
            </span>
          </div>
          <button
            onClick={onEditCity}
            style={{
              opacity: 0.5,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              marginTop: 2,
            }}
            aria-label="Editar ciudad"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M8.5 1.5L10.5 3.5M1 11H3L9.5 4.5L7.5 2.5L1 9V11Z" stroke="#9A9A94" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Events grouped by date */}
      {hasEvents && groupedDates.map(([fecha, events]) => {
        const { dayNum, weekday } = getDayLabel(fecha, '2026-06-05')
        const currentIdx = dateGroupIndex++
        return (
          <div
            key={fecha}
            style={{
              paddingLeft: 36,
              marginBottom: 12,
              animation: `card-enter 350ms cubic-bezier(.32,.72,0,1) ${120 + cityIndex * 60 + currentIdx * 40}ms both`,
            }}
          >
            {/* Day node */}
            <div style={{ position: 'relative', marginBottom: 8 }}>
              <div style={{
                position: 'absolute',
                left: -36 - 4,
                top: 3,
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#F5F5F3',
                border: `2.5px solid ${day.color}`,
                zIndex: 2,
                animation: `dot-pop 300ms cubic-bezier(.32,.72,0,1) ${140 + currentIdx * 50}ms both`,
              }} />

              {/* Day header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontFamily: '"Azeret Mono", monospace',
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#E10600',
                }}>
                  D{dayNum}
                </span>
                <span style={{
                  fontFamily: '"Azeret Mono", monospace',
                  fontSize: 10,
                  color: '#5A5A56',
                  textTransform: 'uppercase',
                }}>
                  {weekday}
                </span>
                <div style={{ flex: 1, height: 1, background: '#DDDDD8', opacity: 0.5 }} />
                <span style={{
                  fontFamily: '"Azeret Mono", monospace',
                  fontSize: 9,
                  color: '#9A9A94',
                }}>
                  {events.length}
                </span>
              </div>
            </div>

            {/* Event rows */}
            {events.map((ev, i) => {
              const evColor = EVENT_COLORS[ev.tipo] || '#9A9A94'
              const isLast = i === events.length - 1
              return (
                <div
                  key={ev.id}
                  onClick={() => onEditEvent(ev)}
                  style={{
                    position: 'relative',
                    padding: '6px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    borderBottom: isLast ? 'none' : '1px solid #EAEAE6',
                  }}
                >
                  {/* Tick mark */}
                  <div style={{
                    position: 'absolute',
                    left: -36 + 1,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 6,
                    height: 2,
                    background: day.color,
                    opacity: 0.3,
                  }} />

                  {/* Time */}
                  <span style={{
                    fontFamily: '"Azeret Mono", monospace',
                    fontSize: 10,
                    fontWeight: 600,
                    color: evColor,
                    width: 34,
                    flexShrink: 0,
                  }}>
                    {ev.hora || '—'}
                  </span>

                  {/* Name */}
                  <span style={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: 12,
                    fontWeight: 500,
                    color: '#0F0F0F',
                    flex: 1,
                    minWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {ev.titulo}
                  </span>

                  {/* Type tag */}
                  <span style={{
                    fontFamily: '"Azeret Mono", monospace',
                    fontSize: 8,
                    color: '#9A9A94',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    flexShrink: 0,
                  }}>
                    {EVENT_TYPE_LABELS[ev.tipo]}
                  </span>

                  {/* Delete */}
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteEvent(ev.id) }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0 2px',
                      color: '#9A9A94',
                      fontSize: 10,
                      opacity: 0.5,
                      flexShrink: 0,
                    }}
                    aria-label="Eliminar evento"
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>
        )
      })}

      {/* Empty state */}
      {!hasEvents && (
        <div style={{ paddingLeft: 36, marginBottom: 12 }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: -36 - 4,
              top: 8,
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#F5F5F3',
              border: '2px dashed #DDDDD8',
              zIndex: 2,
            }} />
            <div style={{
              fontFamily: '"Azeret Mono", monospace',
              fontSize: 10,
              color: '#9A9A94',
              border: '1px dashed #DDDDD8',
              borderRadius: 8,
              padding: '10px 14px',
            }}>
              Sin planes
            </div>
          </div>
        </div>
      )}

      {/* Add event button */}
      <div style={{ paddingLeft: 36, marginBottom: 20 }}>
        <button
          onClick={onAddEvent}
          style={{
            fontFamily: '"Azeret Mono", monospace',
            fontSize: 10,
            color: '#9A9A94',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          + Agregar evento
        </button>
      </div>
    </div>
  )
}

// ── AddDayModal ───────────────────────────────────────────────────────────────

const SPAIN_CITIES = [
  { nombre: 'Madrid', color: '#D71920' },
  { nombre: 'Barcelona', color: '#004D98' },
  { nombre: 'Valencia', color: '#FF6B2B' },
  { nombre: 'Sevilla', color: '#C8972A' },
  { nombre: 'Granada', color: '#8B6914' },
  { nombre: 'Toledo', color: '#7C6F5B' },
  { nombre: 'Córdoba', color: '#A93226' },
  { nombre: 'Málaga', color: '#E67E22' },
  { nombre: 'Bilbao', color: '#006B3C' },
  { nombre: 'San Sebastián', color: '#1A5276' },
  { nombre: 'Zaragoza', color: '#7D3C98' },
  { nombre: 'Salamanca', color: '#B7950B' },
]

type DayFormData = { fechaInicio: string; fechaFin: string; ciudad: string; color: string }

interface AddDayModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: DayFormData) => void
  onDelete?: () => void
  initialValues?: DayFormData
  mode?: 'add' | 'edit'
}

function AddDayModal({ open, onClose, onSave, onDelete, initialValues, mode = 'add' }: AddDayModalProps) {
  const defaultForm = { fechaInicio: '2026-06-06', fechaFin: '2026-06-06', ciudad: '', color: '' }
  const [form, setForm] = useState<DayFormData>(initialValues ?? defaultForm)
  const prevOpen = useRef(false)

  useEffect(() => {
    if (open && !prevOpen.current) {
      setForm(initialValues ?? defaultForm)
    }
    prevOpen.current = open
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSave() {
    if (!form.fechaInicio || !form.fechaFin || !form.ciudad) return
    onSave(form)
    onClose()
  }

  const title = mode === 'edit' ? 'Editar ciudad' : 'Agregar ciudad'
  const btnLabel = mode === 'edit' ? 'Guardar cambios' : 'Agregar ciudad'

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="flex flex-col gap-4">

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-label text-text-sub block mb-1.5">Llegada</label>
            <input
              type="date"
              className="input"
              min="2026-06-06"
              max="2026-06-19"
              value={form.fechaInicio}
              onChange={e => setForm(f => ({
                ...f,
                fechaInicio: e.target.value,
                fechaFin: f.fechaFin < e.target.value ? e.target.value : f.fechaFin,
              }))}
            />
          </div>
          <div className="flex-1">
            <label className="text-label text-text-sub block mb-1.5">Salida</label>
            <input
              type="date"
              className="input"
              min={form.fechaInicio}
              max="2026-06-19"
              value={form.fechaFin}
              onChange={e => setForm(f => ({ ...f, fechaFin: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <label className="text-label text-text-sub block mb-2">Ciudad</label>
          <div className="grid grid-cols-3 gap-2">
            {SPAIN_CITIES.map(({ nombre, color }) => {
              const selected = form.ciudad === nombre
              return (
                <button
                  key={nombre}
                  onClick={() => setForm(f => ({ ...f, ciudad: nombre, color }))}
                  className="flex items-center gap-2 px-3 h-11 rounded-btn transition-all duration-150"
                  style={{
                    backgroundColor: selected ? color : '#EAEAE6',
                    color: selected ? '#fff' : '#0F0F0F',
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: selected ? '#ffffff88' : color }}
                  />
                  <span className="text-[12px] font-semibold truncate">{nombre}</span>
                </button>
              )
            })}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!form.ciudad}
          className="btn-primary mt-1 disabled:opacity-40"
        >
          {btnLabel}
        </button>

        {mode === 'edit' && onDelete && (
          <button
            onClick={onDelete}
            className="w-full text-[14px] font-semibold py-2 transition-opacity active:opacity-60"
            style={{ color: '#E10600' }}
          >
            Eliminar ciudad
          </button>
        )}

      </div>
    </Modal>
  )
}

// ── AddEventModal ─────────────────────────────────────────────────────────────

const EVENT_TYPES: { tipo: EventType; label: string }[] = [
  { tipo: 'gp', label: 'GP F1' },
  { tipo: 'vuelo', label: 'Vuelo' },
  { tipo: 'hotel', label: 'Hotel' },
  { tipo: 'actividad', label: 'Actividad' },
  { tipo: 'comida', label: 'Comida' },
  { tipo: 'transporte', label: 'Transporte' },
  { tipo: 'otro', label: 'Otro' },
]

type EventFormValues = {
  tipo: EventType; fecha: string; allDay: boolean; hora: string; titulo: string; detalle: string
}

interface AddEventModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: Omit<TripEvent, 'id'>) => void
  fechaInicio: string
  fechaFin: string
  initialValues?: EventFormValues
  mode?: 'add' | 'edit'
}

function AddEventModal({ open, onClose, onSave, fechaInicio, fechaFin, initialValues, mode = 'add' }: AddEventModalProps) {
  const [form, setForm] = useState<EventFormValues>(
    initialValues ?? { tipo: 'actividad', fecha: '', allDay: false, hora: '', titulo: '', detalle: '' }
  )
  const prevOpen = useRef(false)

  useEffect(() => {
    if (open && !prevOpen.current) {
      if (initialValues) {
        setForm(initialValues)
      } else {
        setForm(f => ({ ...f, fecha: fechaInicio, allDay: false, hora: '', titulo: '', detalle: '', tipo: 'actividad' }))
      }
    }
    prevOpen.current = open
  }, [open, fechaInicio]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSave() {
    if (!form.titulo.trim()) return
    if (!form.allDay && !form.hora) return
    const payload: Omit<TripEvent, 'id'> = {
      tipo: form.tipo,
      fecha: form.fecha || fechaInicio,
      hora: form.allDay ? '' : form.hora,
      titulo: form.titulo.trim(),
    }
    if (form.detalle.trim()) payload.detalle = form.detalle.trim()
    onSave(payload)
    onClose()
  }

  const multiDay = fechaInicio !== fechaFin
  const modalTitle = mode === 'edit' ? 'Editar evento' : 'Agregar evento'
  const btnLabel = mode === 'edit' ? 'Guardar cambios' : 'Agregar evento'

  return (
    <Modal open={open} onClose={onClose} title={modalTitle}>
      <div className="flex flex-col gap-4">

        {/* ── Tipo ── */}
        <div>
          <p style={{ fontFamily: '"Azeret Mono", monospace', fontSize: 9, fontWeight: 700, color: '#5A5A56', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Tipo</p>
          <div className="grid grid-cols-4 gap-1.5">
            {EVENT_TYPES.map(({ tipo, label }) => {
              const selected = form.tipo === tipo
              const evColor = EVENT_COLORS[tipo]
              const bg = selected ? `${evColor}15` : '#EAEAE6'
              const borderColor = selected ? evColor : 'transparent'
              const labelColor = selected ? evColor : '#9A9A94'
              return (
                <button
                  key={tipo}
                  onClick={() => setForm(f => ({ ...f, tipo }))}
                  className="flex flex-col items-center gap-1 py-3 rounded-btn transition-all duration-150 active:scale-95"
                  style={{ backgroundColor: bg, border: `1.5px solid ${borderColor}` }}
                >
                  <EventIcon tipo={tipo} size={20} color={labelColor} />
                  <span style={{ fontFamily: '"Azeret Mono", monospace', fontSize: 9, fontWeight: 600, color: labelColor }}>{label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="-mx-5 h-px bg-border" />

        {/* ── Cuándo ── */}
        <div className="flex flex-col gap-3">
          <p style={{ fontFamily: '"Azeret Mono", monospace', fontSize: 9, fontWeight: 700, color: '#5A5A56', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Cuándo</p>

          {/* All-day segmented control */}
          <div className="flex p-1 gap-1 rounded-input" style={{ background: '#EAEAE6' }}>
            <button
              onClick={() => setForm(f => ({ ...f, allDay: false }))}
              className="flex-1 h-11 rounded-[5px] text-[13px] font-semibold transition-all duration-200 active:scale-[0.97]"
              style={{
                background: !form.allDay ? '#FFFFFF' : 'transparent',
                color: !form.allDay ? '#0F0F0F' : '#9A9A94',
                boxShadow: !form.allDay ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              Hora
            </button>
            <button
              onClick={() => setForm(f => ({ ...f, allDay: true, hora: '' }))}
              className="flex-1 h-11 rounded-[5px] text-[13px] font-semibold transition-all duration-200 active:scale-[0.97]"
              style={{
                background: form.allDay ? '#FFFFFF' : 'transparent',
                color: form.allDay ? '#0F0F0F' : '#9A9A94',
                boxShadow: form.allDay ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              Todo el día
            </button>
          </div>

          {/* Día + Hora side by side (conditional) */}
          {(multiDay || !form.allDay) && (
            <div className="flex gap-3">
              {multiDay && (
                <div className="flex-1">
                  <label className="text-[11px] font-medium text-text-sub block mb-1.5">Día</label>
                  <input
                    type="date"
                    className="input"
                    min={fechaInicio}
                    max={fechaFin}
                    value={form.fecha}
                    onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))}
                  />
                </div>
              )}
              {!form.allDay && (
                <div className="flex-1">
                  <label className="text-[11px] font-medium text-text-sub block mb-1.5">Hora</label>
                  <input
                    type="time"
                    className="input"
                    value={form.hora}
                    onChange={e => setForm(f => ({ ...f, hora: e.target.value }))}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="-mx-5 h-px bg-border" />

        {/* ── Detalles ── */}
        <div className="flex flex-col gap-3">
          <p style={{ fontFamily: '"Azeret Mono", monospace', fontSize: 9, fontWeight: 700, color: '#5A5A56', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Detalles</p>
          <div>
            <label className="text-[11px] font-medium text-text-sub block mb-1.5">Título</label>
            <input
              type="text"
              className="input"
              placeholder="ej. Llegada a Barcelona"
              value={form.titulo}
              onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-text-sub block mb-1.5">
              Detalle <span className="opacity-60">(opcional)</span>
            </label>
            <input
              type="text"
              className="input"
              placeholder="ej. Terminal 1, puerta B12"
              value={form.detalle}
              onChange={e => setForm(f => ({ ...f, detalle: e.target.value }))}
            />
          </div>
        </div>

        <button onClick={handleSave} className="btn-primary">
          {btnLabel}
        </button>

      </div>
    </Modal>
  )
}

// ── ItinerarioPage ────────────────────────────────────────────────────────────

export function ItinerarioPage({ fabTrigger }: { fabTrigger?: number }) {
  const { days, loading, addDay, updateDay, addEvent, deleteEvent, updateEvent, deleteDay } = useTrip()
  const [showAddDay, setShowAddDay] = useState(false)
  const [addEventFor, setAddEventFor] = useState<{ dayId: string; fechaInicio: string; fechaFin: string } | null>(null)
  const [editDayId, setEditDayId] = useState<string | null>(null)
  const [editEventFor, setEditEventFor] = useState<{ dayId: string; event: TripEvent } | null>(null)
  const [confirmDeleteEvent, setConfirmDeleteEvent] = useState<{ dayId: string; eventId: string } | null>(null)
  const [confirmDeleteCityId, setConfirmDeleteCityId] = useState<string | null>(null)

  // FAB trigger → open AddDayModal (ignore mount value)
  const fabRef = useRef(fabTrigger)
  useEffect(() => {
    if (fabTrigger !== fabRef.current) {
      fabRef.current = fabTrigger
      setShowAddDay(true)
    }
  }, [fabTrigger])

  const editDay = editDayId ? days.find(d => d.id === editDayId) : null
  const editEventDay = editEventFor ? days.find(d => d.id === editEventFor.dayId) : null

  return (
    <div className="page flex flex-col gap-4" style={{ position: 'relative' }}>

      {/* Carbon fiber background texture */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.03,
        backgroundImage: 'repeating-linear-gradient(45deg, #0F0F0F 0px, #0F0F0F 1px, transparent 1px, transparent 4px), repeating-linear-gradient(-45deg, #0F0F0F 0px, #0F0F0F 1px, transparent 1px, transparent 4px)',
        backgroundSize: '6px 6px',
        animation: 'carbon-breathe 4s ease-in-out infinite',
      }} />

      {/* Countdown */}
      <div className="animate-card-enter card-stagger-1" style={{ padding: '0 0 4px', position: 'relative', zIndex: 1 }}>
        <Countdown />
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative', zIndex: 1, marginLeft: 30, paddingBottom: 20 }}>

        {/* Continuous vertical line */}
        {days.length > 0 && (
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 2,
            background: days.length === 1
              ? days[0].color
              : `linear-gradient(to bottom, ${days.map((d, i) => `${d.color} ${(i / (days.length - 1)) * 100}%`).join(', ')})`,
            opacity: 0.3,
            borderRadius: 1,
            animation: 'line-grow 800ms cubic-bezier(.32,.72,0,1) 200ms both',
            transformOrigin: 'top',
          }} />
        )}

        {/* Loading */}
        {loading && (
          <div style={{ padding: '24px 0 24px 36px' }}>
            <div className="w-5 h-5 rounded-full border-2 border-border border-t-accent animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && days.length === 0 && (
          <div style={{ padding: '16px 0' }}>
            <div style={{
              border: '1px dashed #DDDDD8',
              borderRadius: 8,
              padding: '20px 16px',
              textAlign: 'center',
            }}>
              <p style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 13,
                color: '#5A5A56',
                marginBottom: 12,
              }}>
                Agrega las ciudades que vas a visitar
              </p>
              <button onClick={() => setShowAddDay(true)} className="btn-primary w-full">
                + Ciudad
              </button>
            </div>
          </div>
        )}

        {/* Cities */}
        {!loading && days.map((day, i) => (
          <CitySection
            key={day.id}
            day={day}
            cityIndex={i}
            onAddEvent={() => setAddEventFor({ dayId: day.id, fechaInicio: day.fechaInicio, fechaFin: day.fechaFin })}
            onDeleteEvent={(eventId) => setConfirmDeleteEvent({ dayId: day.id, eventId })}
            onEditEvent={(event) => setEditEventFor({ dayId: day.id, event })}
            onEditCity={() => setEditDayId(day.id)}
          />
        ))}

        {/* Final dot */}
        {!loading && days.length > 0 && (
          <div style={{
            position: 'absolute',
            left: -3,
            bottom: 16,
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: days[days.length - 1].color,
            opacity: 0.6,
            zIndex: 2,
          }} />
        )}
      </div>

      {/* Modals */}
      <AddDayModal
        open={showAddDay}
        onClose={() => setShowAddDay(false)}
        onSave={(data) => addDay({ fechaInicio: data.fechaInicio, fechaFin: data.fechaFin, ciudad: data.ciudad, color: data.color })}
      />

      <AddDayModal
        mode="edit"
        open={editDayId !== null}
        onClose={() => setEditDayId(null)}
        initialValues={editDay ? { fechaInicio: editDay.fechaInicio, fechaFin: editDay.fechaFin, ciudad: editDay.ciudad, color: editDay.color } : undefined}
        onSave={(data) => {
          if (editDayId) updateDay(editDayId, data)
        }}
        onDelete={() => {
          setConfirmDeleteCityId(editDayId)
          setEditDayId(null)
        }}
      />

      <AddEventModal
        open={addEventFor !== null}
        fechaInicio={addEventFor?.fechaInicio ?? ''}
        fechaFin={addEventFor?.fechaFin ?? ''}
        onClose={() => setAddEventFor(null)}
        onSave={(data) => {
          if (addEventFor) addEvent(addEventFor.dayId, data)
        }}
      />

      <AddEventModal
        mode="edit"
        open={editEventFor !== null}
        fechaInicio={editEventDay?.fechaInicio ?? ''}
        fechaFin={editEventDay?.fechaFin ?? ''}
        initialValues={editEventFor ? {
          tipo: editEventFor.event.tipo,
          fecha: editEventFor.event.fecha || editEventDay?.fechaInicio || '',
          allDay: !editEventFor.event.hora,
          hora: editEventFor.event.hora || '',
          titulo: editEventFor.event.titulo,
          detalle: editEventFor.event.detalle || '',
        } : undefined}
        onClose={() => setEditEventFor(null)}
        onSave={(data) => {
          if (editEventFor) updateEvent(editEventFor.dayId, editEventFor.event.id, data)
        }}
      />

      {/* Confirm: borrar evento */}
      <ConfirmSheet
        open={confirmDeleteEvent !== null}
        title="Eliminar evento"
        message="¿Estás seguro? Esta acción no se puede deshacer."
        onConfirm={() => {
          if (confirmDeleteEvent) deleteEvent(confirmDeleteEvent.dayId, confirmDeleteEvent.eventId)
          setConfirmDeleteEvent(null)
        }}
        onCancel={() => setConfirmDeleteEvent(null)}
      />

      {/* Confirm: borrar ciudad */}
      <ConfirmSheet
        open={confirmDeleteCityId !== null}
        title="Eliminar ciudad"
        message="¿Estás seguro? Se eliminarán también todos sus eventos."
        onConfirm={() => {
          if (confirmDeleteCityId) deleteDay(confirmDeleteCityId)
          setConfirmDeleteCityId(null)
        }}
        onCancel={() => setConfirmDeleteCityId(null)}
      />

    </div>
  )
}
