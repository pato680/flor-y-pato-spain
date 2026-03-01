import { useState, useEffect, useRef } from 'react'
import { useTrip, EVENT_COLORS } from '../hooks/useTrip'
import type { Day, TripEvent, EventType } from '../lib/types'
import { Modal } from '../components/Modal'
import { ConfirmSheet } from '../components/ConfirmSheet'
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
        <rect x="8"   y="2" width="2.25" height="2.25" fill={color} />
        <rect x="5.75" y="4.25" width="2.25" height="2.25" fill={color} />
      </>}
    </svg>
  )
}

// ── Countdown logic ──────────────────────────────────────────────────────────
const TRIP_START = new Date('2026-06-05T00:00:00')
const TRIP_END   = new Date('2026-06-20T00:00:00')

function getDiff() {
  const now = new Date()
  if (now >= TRIP_END) return { state: 'past' as const, days: 0 }
  if (now >= TRIP_START) {
    const diff = TRIP_END.getTime() - now.getTime()
    return { state: 'during' as const, days: Math.floor(diff / 86400000) }
  }
  const diff = TRIP_START.getTime() - now.getTime()
  return { state: 'before' as const, days: Math.floor(diff / 86400000) }
}

// ── Hero Card ─────────────────────────────────────────────────────────────────
function HeroCard() {
  const [diff, setDiff] = useState(getDiff)
  const [lit, setLit] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setDiff(getDiff()), 60000)
    return () => clearInterval(id)
  }, [])

  // Semáforo F1: enciende 1 por 1, luego apaga todo, repite
  useEffect(() => {
    const seq: [number, number][] = [
      [1, 700], [2, 700], [3, 700], [4, 700], [5, 900], [0, 3000],
    ]
    let i = 0
    let t: ReturnType<typeof setTimeout>
    function next() {
      const [count, delay] = seq[i % seq.length]
      setLit(count)
      i++
      t = setTimeout(next, delay)
    }
    t = setTimeout(next, 600)
    return () => clearTimeout(t)
  }, [])

  const countdownLabel =
    diff.state === 'past'   ? 'COMPLETADO' :
    diff.state === 'during' ? 'EN RUTA' :
                              'DÍAS'
  const countdownValue = diff.state === 'past' ? '—' : String(diff.days).padStart(2, '0')

  return (
    <div style={{
      background: '#0D0D10',
      border: '1px solid #1E1E26',
      borderRadius: 16,
      overflow: 'hidden',
      position: 'relative',
    }}>

      <div className="f1-speedlines" />

      {/* Franja roja superior */}
      <div style={{ height: 8, background: '#E10600' }} />

      <div style={{ padding: '16px 18px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 }}>

          {/* Left: event info */}
          <div style={{ flex: 1 }}>

            {/* Badge row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span style={{
                background: '#E10600', color: '#fff',
                fontSize: 9, fontWeight: 800, letterSpacing: 2.5,
                textTransform: 'uppercase', padding: '3px 9px', borderRadius: 4,
              }}>
                GP España
              </span>
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: 2,
                textTransform: 'uppercase', color: '#7A7A8A',
              }}>
                · F1 2026
              </span>
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: 22, fontWeight: 800, color: '#FFFFFF',
              letterSpacing: '-0.5px', lineHeight: 1.1, marginBottom: 10,
            }}>
              España 2026
            </h1>

            {/* Gradient divider */}
            <div style={{
              height: 1,
              background: 'linear-gradient(90deg, #E10600 60%, transparent)',
              marginBottom: 10,
            }} />

            {/* Dates + circuit */}
            <p style={{
              fontSize: 11, fontWeight: 600, color: '#A0A0AE', letterSpacing: 0.2,
            }}>
              5 – 20 jun · 16 días
            </p>
            <p style={{ fontSize: 10, color: '#7A7A8A', marginTop: 3 }}>
              Circuit de Barcelona-Catalunya
            </p>

          </div>

          {/* Right: timing board */}
          <div style={{
            textAlign: 'center',
            background: '#08080C',
            border: '1px solid #1E1E26',
            borderRadius: 10,
            padding: '10px 14px',
            flexShrink: 0,
          }}>
            {/* Semáforo F1 */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginBottom: 10 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <div key={n} style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: lit >= n ? '#E10600' : '#1C0808',
                  border: `1px solid ${lit >= n ? '#FF2800' : '#2E1010'}`,
                  boxShadow: lit >= n ? '0 0 6px #E10600, 0 0 14px rgba(225,6,0,0.6)' : 'none',
                  transition: 'background 80ms, box-shadow 80ms',
                }} />
              ))}
            </div>

            <span style={{
              display: 'block',
              fontSize: 52, fontWeight: 900, color: '#FFFFFF',
              lineHeight: 1, letterSpacing: '-3px',
              fontVariantNumeric: 'tabular-nums',
              textShadow: '0 0 20px rgba(225,6,0,0.5)',
            }}>
              {countdownValue}
            </span>
            <span style={{
              display: 'block',
              fontSize: 8, fontWeight: 700, letterSpacing: 2.5,
              textTransform: 'uppercase', color: '#E10600',
              marginTop: 6,
            }}>
              {countdownLabel}
            </span>
          </div>

        </div>
      </div>

      {/* Franja roja inferior */}
      <div style={{ height: 8, background: '#E10600', boxShadow: '0 4px 16px rgba(225,6,0,0.5)' }} />

    </div>
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

// ── EventRow ──────────────────────────────────────────────────────────────────

interface EventRowProps {
  event: TripEvent
  onDelete: () => void
  onEdit: () => void
  noBorderTop?: boolean
}

function EventRowGP({ event, onDelete, onEdit, noBorderTop = false }: EventRowProps) {
  return (
    <div style={{ background: '#0D0D10', borderTop: noBorderTop ? 'none' : '1px solid #E7E2DC' }}>
      <div style={{ height: 4, background: 'linear-gradient(90deg, #E10600, #FF4422)' }} />
      <div className="flex items-start gap-3 py-3 px-4">
        <span className="shrink-0 mt-0.5"><EventIcon tipo="gp" /></span>
        <span className="text-[12px] font-medium tabular-nums w-10 shrink-0 mt-0.5" style={{ color: '#7A7A8A' }}>
          {event.hora || '—'}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span style={{
              background: '#E10600', color: '#fff',
              fontSize: 9, fontWeight: 800, letterSpacing: 2,
              textTransform: 'uppercase', padding: '2px 7px', borderRadius: 3,
            }}>
              GP F1
            </span>
          </div>
          <p className="text-[14px] font-bold leading-snug" style={{ color: '#FFFFFF' }}>{event.titulo}</p>
          {event.detalle && (
            <p className="text-[12px] mt-0.5 leading-snug" style={{ color: '#7A7A8A' }}>{event.detalle}</p>
          )}
        </div>
        <button
          onClick={onEdit}
          className="touch-target shrink-0 -mr-1 transition-colors duration-150"
          style={{ color: '#7A7A8A' }}
          aria-label="Editar evento"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M8.5 1.5L10.5 3.5M1 11H3L9.5 4.5L7.5 2.5L1 9V11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          onClick={onDelete}
          className="touch-target shrink-0 -mr-1 text-[12px] transition-colors duration-150"
          style={{ color: '#7A7A8A' }}
          aria-label="Eliminar evento"
        >
          ✕
        </button>
      </div>
      <div style={{ height: 4, background: 'linear-gradient(90deg, #E10600, #FF4422)' }} />
    </div>
  )
}

function EventRow({ event, onDelete, onEdit, noBorderTop = false }: EventRowProps) {
  if (event.tipo === 'gp') return <EventRowGP event={event} onDelete={onDelete} onEdit={onEdit} noBorderTop={noBorderTop} />
  return (
    <div
      className={`tappable flex items-start gap-3 py-3 px-4 ${noBorderTop ? '' : 'border-t border-border'}`}
      style={{ borderLeft: `3px solid ${EVENT_COLORS[event.tipo]}` }}
    >
      <span
        className="shrink-0 mt-0.5 event-type-pill"
        style={{ background: `${EVENT_COLORS[event.tipo]}18` }}
      >
        <EventIcon tipo={event.tipo} />
      </span>
      <span className="text-[12px] font-medium text-text-sub tabular-nums w-10 shrink-0 mt-0.5">
        {event.hora || '—'}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-text leading-snug">{event.titulo}</p>
        {event.detalle && (
          <p className="text-[12px] text-text-sub mt-0.5 leading-snug">{event.detalle}</p>
        )}
      </div>
      <button
        onClick={onEdit}
        className="touch-target shrink-0 text-inactive hover:text-accent -mr-1 transition-colors duration-150"
        aria-label="Editar evento"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M8.5 1.5L10.5 3.5M1 11H3L9.5 4.5L7.5 2.5L1 9V11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button
        onClick={onDelete}
        className="touch-target shrink-0 text-inactive hover:text-accent -mr-1 text-[12px] transition-colors duration-150"
        aria-label="Eliminar evento"
      >
        ✕
      </button>
    </div>
  )
}

// ── TravelCard ────────────────────────────────────────────────────────────────

function TravelCard({ fecha, ruta }: { fecha: string; ruta: string }) {
  return (
    <div className="overflow-hidden rounded-card border border-border" style={{ background: '#FDF0EC' }}>
      <div className="h-1 bg-accent" />
      <div className="flex items-center gap-3 px-4 py-3">
        <EventIcon tipo="vuelo" size={20} color="#C8472A" />
        <div>
          <p className="text-[11px] font-semibold text-accent uppercase tracking-wider mb-0.5">
            {formatFecha(fecha)}
          </p>
          <p className="text-[15px] font-bold text-text">{ruta}</p>
        </div>
      </div>
    </div>
  )
}

// ── TimelineItem ──────────────────────────────────────────────────────────────

function TimelineItem({
  color, dotStyle = 'solid', isFirst = false, isLast = false, children,
}: {
  color: string
  dotStyle?: 'solid' | 'outline'
  isFirst?: boolean
  isLast?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-3 items-stretch">
      {/* Columna izquierda: línea + dot */}
      <div className="flex flex-col items-center w-5 shrink-0">
        {!isFirst && <div className="w-px flex-none h-4 bg-border" />}
        <div
          className="w-3 h-3 rounded-full shrink-0 z-10"
          style={
            dotStyle === 'outline'
              ? { border: `2px solid ${color}`, backgroundColor: '#FAF8F5' }
              : { backgroundColor: color, border: '2px solid #FAF8F5' }
          }
        />
        {!isLast && <div className="w-px flex-1 bg-border mt-1" />}
      </div>
      {/* Columna derecha: card */}
      <div className="flex-1 min-w-0" style={{ paddingBottom: isLast ? 0 : 16 }}>
        {children}
      </div>
    </div>
  )
}

// ── DayCard ───────────────────────────────────────────────────────────────────

interface DayCardProps {
  day: Day
  onAddEvent: () => void
  onDeleteEvent: (eventId: string) => void
  onEditEvent: (event: TripEvent) => void
  onEdit: () => void
}

function DayCard({ day, onAddEvent, onDeleteEvent, onEditEvent, onEdit }: DayCardProps) {
  const sortedEvents = [...day.eventos].sort((a, b) => {
    if (a.fecha && b.fecha && a.fecha !== b.fecha) return a.fecha.localeCompare(b.fecha)
    return a.hora.localeCompare(b.hora)
  })
  const noches = Math.round(
    (parseDate(day.fechaFin).getTime() - parseDate(day.fechaInicio).getTime()) / 86400000
  )
  const nochesBadge = noches === 0 ? '1 día' : noches === 1 ? '1 noche' : `${noches} noches`
  const showDayHeaders = noches > 0

  // Agrupar por fecha
  const byDate = new Map<string, TripEvent[]>()
  const noDateEvents: TripEvent[] = []
  for (const ev of sortedEvents) {
    if (ev.fecha) {
      if (!byDate.has(ev.fecha)) byDate.set(ev.fecha, [])
      byDate.get(ev.fecha)!.push(ev)
    } else {
      noDateEvents.push(ev)
    }
  }
  const groupedDates = [...byDate.entries()].sort(([a], [b]) => a.localeCompare(b))

  return (
    <div className="card p-0 overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center gap-2.5 px-4 py-3"
        style={{ background: `${day.color}0A`, borderLeft: `4px solid ${day.color}` }}
      >
        <div className="flex-1 min-w-0">
          {day.ciudad && (
            <p className="text-[17px] font-extrabold tracking-tight text-text leading-tight">{day.ciudad}</p>
          )}
          <div style={{ height: 1, background: `linear-gradient(90deg, ${day.color}60, transparent)`, margin: '3px 0' }} />
          <p className="text-[12px] font-medium text-text-sub leading-tight">
            {formatRango(day.fechaInicio, day.fechaFin)}
          </p>
        </div>
        <span className="bg-border text-text-sub text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0">
          {nochesBadge}
        </span>
        <button
          onClick={onEdit}
          className="touch-target text-inactive hover:text-accent rounded-full shrink-0 transition-colors duration-150"
          aria-label="Editar ciudad"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 2.5L11.5 4.5M2 12H4L10.5 5.5L8.5 3.5L2 10V12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Eventos sin fecha (backward compat) */}
      {noDateEvents.map(ev => (
        <EventRow
          key={ev.id}
          event={ev}
          onDelete={() => onDeleteEvent(ev.id)}
          onEdit={() => onEditEvent(ev)}
        />
      ))}

      {/* Eventos agrupados por día */}
      {showDayHeaders
        ? groupedDates.map(([fecha, events]) => (
            <div key={fecha}>
              <div className="flex items-center px-4 pt-2.5 pb-1.5 border-t border-border">
                <span className="text-[11px] font-bold text-text-sub uppercase tracking-wide">
                  {formatFecha(fecha)}
                </span>
              </div>
              {events.map((ev, i) => (
                <EventRow
                  key={ev.id}
                  event={ev}
                  onDelete={() => onDeleteEvent(ev.id)}
                  onEdit={() => onEditEvent(ev)}
                  noBorderTop={i === 0}
                />
              ))}
            </div>
          ))
        : sortedEvents.map(ev => (
            <EventRow
              key={ev.id}
              event={ev}
              onDelete={() => onDeleteEvent(ev.id)}
              onEdit={() => onEditEvent(ev)}
            />
          ))
      }

      {/* Add event button */}
      <div className="border-t border-border px-4">
        <button
          onClick={onAddEvent}
          className="flex items-center gap-1.5 text-[14px] font-semibold text-accent py-2.5 min-h-[44px] transition-opacity duration-150 active:opacity-60"
        >
          <span className="text-base leading-none">+</span> Agregar evento
        </button>
      </div>
    </div>
  )
}

// ── AddDayModal ───────────────────────────────────────────────────────────────

const SPAIN_CITIES = [
  { nombre: 'Madrid',        color: '#D71920' },
  { nombre: 'Barcelona',     color: '#004D98' },
  { nombre: 'Valencia',      color: '#FF6B2B' },
  { nombre: 'Sevilla',       color: '#C8972A' },
  { nombre: 'Granada',       color: '#8B6914' },
  { nombre: 'Toledo',        color: '#7C6F5B' },
  { nombre: 'Córdoba',       color: '#A93226' },
  { nombre: 'Málaga',        color: '#E67E22' },
  { nombre: 'Bilbao',        color: '#006B3C' },
  { nombre: 'San Sebastián', color: '#1A5276' },
  { nombre: 'Zaragoza',      color: '#7D3C98' },
  { nombre: 'Salamanca',     color: '#B7950B' },
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
                    backgroundColor: selected ? color : '#F5F3F0',
                    color: selected ? '#fff' : '#1C1917',
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
            style={{ color: '#C8472A' }}
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
  { tipo: 'gp',         label: 'GP F1' },
  { tipo: 'vuelo',      label: 'Vuelo' },
  { tipo: 'hotel',      label: 'Hotel' },
  { tipo: 'actividad',  label: 'Actividad' },
  { tipo: 'comida',     label: 'Comida' },
  { tipo: 'transporte', label: 'Transporte' },
  { tipo: 'otro',       label: 'Otro' },
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
          <p className="text-[11px] font-bold text-text-sub uppercase tracking-wider mb-2.5">Tipo</p>
          <div className="grid grid-cols-4 gap-1.5">
            {EVENT_TYPES.map(({ tipo, label }) => {
              const isGP = tipo === 'gp'
              const selected = form.tipo === tipo
              const bg = selected ? (isGP ? '#0D0D10' : '#FDF0EC') : '#F5F3F0'
              const borderColor = selected ? (isGP ? '#E10600' : '#C8472A') : 'transparent'
              const labelColor = selected ? (isGP ? '#E10600' : '#C8472A') : '#A09890'
              return (
                <button
                  key={tipo}
                  onClick={() => setForm(f => ({ ...f, tipo }))}
                  className="flex flex-col items-center gap-1 py-3 rounded-btn transition-all duration-150 active:scale-95"
                  style={{ backgroundColor: bg, border: `1.5px solid ${borderColor}` }}
                >
                  <EventIcon tipo={tipo} size={20} color={labelColor} />
                  <span className="text-[10px] font-bold leading-none" style={{ color: labelColor }}>{label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="-mx-5 h-px bg-border" />

        {/* ── Cuándo ── */}
        <div className="flex flex-col gap-3">
          <p className="text-[11px] font-bold text-text-sub uppercase tracking-wider">Cuándo</p>

          {/* All-day segmented control */}
          <div className="flex p-1 gap-1 rounded-input" style={{ background: '#EDEAE6' }}>
            <button
              onClick={() => setForm(f => ({ ...f, allDay: false }))}
              className="flex-1 h-11 rounded-[9px] text-[13px] font-semibold transition-all duration-200 active:scale-[0.97]"
              style={{
                background: !form.allDay ? '#FFFFFF' : 'transparent',
                color: !form.allDay ? '#1C1917' : '#A09890',
                boxShadow: !form.allDay ? '0 1px 3px rgba(28,25,23,0.10)' : 'none',
              }}
            >
              🕐 Hora
            </button>
            <button
              onClick={() => setForm(f => ({ ...f, allDay: true, hora: '' }))}
              className="flex-1 h-11 rounded-[9px] text-[13px] font-semibold transition-all duration-200 active:scale-[0.97]"
              style={{
                background: form.allDay ? '#FFFFFF' : 'transparent',
                color: form.allDay ? '#1C1917' : '#A09890',
                boxShadow: form.allDay ? '0 1px 3px rgba(28,25,23,0.10)' : 'none',
              }}
            >
              ☀️ Todo el día
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
          <p className="text-[11px] font-bold text-text-sub uppercase tracking-wider">Detalles</p>
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

  // FAB trigger → open AddDayModal
  useEffect(() => {
    if (fabTrigger && fabTrigger > 0) setShowAddDay(true)
  }, [fabTrigger])

  const editDay = editDayId ? days.find(d => d.id === editDayId) : null
  const editEventDay = editEventFor ? days.find(d => d.id === editEventFor.dayId) : null

  return (
    <div className="page flex flex-col gap-4">

      {/* Hero */}
      <div className="animate-card-enter card-stagger-1">
        <HeroCard />
      </div>

      {/* Section */}
      <div className="animate-card-enter card-stagger-2 flex flex-col gap-0">

        {/* Header row */}
        <div className="page-title-row mb-3">
          <h2 className="page-title">Viaje</h2>
        </div>

        {/* ── Timeline ── */}
        <div className="flex flex-col">

          {/* Vuelo de ida */}
          <TimelineItem color="#C8472A" dotStyle="outline" isFirst>
            <TravelCard fecha="2026-06-05" ruta="Montevideo → Madrid" />
          </TimelineItem>

          {/* Loading */}
          {loading && (
            <div className="flex gap-3 items-stretch">
              <div className="flex flex-col items-center w-5 shrink-0">
                <div className="w-px flex-1 bg-border" />
              </div>
              <div className="flex-1 py-6 flex justify-center">
                <div className="w-5 h-5 rounded-full border-2 border-border border-t-accent animate-spin" />
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && days.length === 0 && (
            <div className="flex gap-3 items-stretch">
              <div className="flex flex-col items-center w-5 shrink-0">
                <div className="w-px flex-1 bg-border" />
              </div>
              <div className="flex-1 py-4 pb-4">
                <div className="flex flex-col items-center gap-2 py-5 rounded-card border border-dashed border-border bg-surface">
                  <p className="text-[13px] text-text-sub text-center px-4">
                    Agrega las ciudades que vas a visitar
                  </p>
                  <button onClick={() => setShowAddDay(true)} className="btn-primary h-12 px-6 text-[15px] w-full">
                    + Ciudad
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Ciudades */}
          {!loading && days.map((day) => (
            <TimelineItem key={day.id} color={day.color} dotStyle="solid">
              <DayCard
                day={day}
                onAddEvent={() => setAddEventFor({ dayId: day.id, fechaInicio: day.fechaInicio, fechaFin: day.fechaFin })}
                onDeleteEvent={(eventId) => setConfirmDeleteEvent({ dayId: day.id, eventId })}
                onEditEvent={(event) => setEditEventFor({ dayId: day.id, event })}
                onEdit={() => setEditDayId(day.id)}
              />
            </TimelineItem>
          ))}

          {/* Vuelo de vuelta */}
          <TimelineItem color="#C8472A" dotStyle="outline" isLast>
            <TravelCard fecha="2026-06-20" ruta="Madrid → Montevideo" />
          </TimelineItem>

        </div>

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
