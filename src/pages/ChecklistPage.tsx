import { useState, useRef, useEffect } from 'react'
import { useChecklist } from '../hooks/useChecklist'
import type { ChecklistItem } from '../lib/types'
import { ConfirmSheet } from '../components/ConfirmSheet'

// Cada sección tiene su propio color de identidad
const SECTIONS = [
  { id: 'llevar',      label: 'Qué llevar',        color: '#E10600' },
  { id: 'cuenta',      label: 'A tener en cuenta', color: '#F09000' },
  { id: 'actividades', label: 'Actividades',        color: '#0070C8' },
] as const

// ── ChecklistItemRow ──────────────────────────────────────────────────────────

function ChecklistItemRow({
  item,
  onToggle,
  onDelete,
  accentColor,
}: {
  item: ChecklistItem
  onToggle: (id: string, completado: boolean) => void
  onDelete: (id: string) => void
  accentColor: string
}) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 border-t border-border transition-colors duration-200"
      style={{ background: item.completado ? '#FAFAF9' : 'transparent' }}
    >
      <button
        onClick={() => onToggle(item.id, !item.completado)}
        className="touch-target shrink-0 -ml-2 transition-all duration-200"
        aria-label="Marcar ítem"
      >
        <span
          className="flex items-center justify-center transition-all duration-200"
          style={{
            width: 20,
            height: 20,
            borderRadius: 6,
            border: item.completado ? 'none' : '2px solid #DDDDD8',
            background: item.completado ? accentColor : 'transparent',
          }}
        >
          {item.completado && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path
                d="M1 4L3.5 6.5L9 1"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      </button>

      <span
        style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 14,
          fontWeight: 500,
          color: item.completado ? '#9A9A94' : '#0F0F0F',
          textDecoration: item.completado ? 'line-through' : 'none',
          flex: 1,
          lineHeight: 1.4,
          transition: 'all 200ms',
        }}
      >
        {item.texto}
      </span>

      <button
        onClick={() => onDelete(item.id)}
        className="touch-target shrink-0 -mr-2 text-text-muted hover:text-accent transition-colors duration-150"
        aria-label="Eliminar"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M2 2L12 12M12 2L2 12"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  )
}

// ── ChecklistSection ──────────────────────────────────────────────────────────

function ChecklistSection({
  section,
  items,
  onToggle,
  onDelete,
  onAdd,
}: {
  section: (typeof SECTIONS)[number]
  items: ChecklistItem[]
  onToggle: (id: string, completado: boolean) => void
  onDelete: (id: string) => void
  onAdd: (texto: string, categoria?: string) => void
}) {
  const [adding, setAdding] = useState(false)
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (adding) inputRef.current?.focus()
  }, [adding])

  const pending = items.filter((i) => !i.completado).length
  const allDone = items.length > 0 && pending === 0

  function handleConfirm() {
    const trimmed = text.trim()
    if (trimmed) onAdd(trimmed, section.id)
    setText('')
    setAdding(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleConfirm()
    else if (e.key === 'Escape') { setText(''); setAdding(false) }
  }

  function handleBlur() {
    const trimmed = text.trim()
    if (trimmed) onAdd(trimmed, section.id)
    setText('')
    setAdding(false)
  }

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #DDDDD8',
      borderRadius: 8,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
      }}>
        <span style={{
          fontFamily: '"Azeret Mono", monospace',
          fontSize: 9,
          fontWeight: 600,
          color: '#9A9A94',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}>
          {section.label}
        </span>

        {allDone ? (
          <span style={{
            fontFamily: '"Azeret Mono", monospace',
            fontSize: 9,
            fontWeight: 700,
            color: '#00965E',
            background: 'rgba(0,150,94,0.1)',
            padding: '3px 8px',
            borderRadius: 4,
          }}>
            LISTO
          </span>
        ) : pending > 0 ? (
          <span style={{
            fontFamily: '"Azeret Mono", monospace',
            fontSize: 9,
            fontWeight: 700,
            color: section.color,
            background: `${section.color}1A`,
            border: `1px solid ${section.color}40`,
            padding: '3px 8px',
            borderRadius: 4,
          }}>
            {pending} PEND.
          </span>
        ) : null}
      </div>

      {/* Items */}
      {items.map((item) => (
        <ChecklistItemRow
          key={item.id}
          item={item}
          onToggle={onToggle}
          onDelete={onDelete}
          accentColor={section.color}
        />
      ))}

      {/* Footer: add inline */}
      {adding ? (
        <div className="flex items-center gap-2 px-4 py-3 border-t border-border">
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder="Nuevo ítem..."
            className="flex-1 text-[14px] text-text placeholder:text-text-muted outline-none bg-transparent"
          />
          <button
            onMouseDown={(e) => { e.preventDefault(); handleConfirm() }}
            className="touch-target"
            style={{ color: section.color, fontWeight: 700, fontSize: 14 }}
          >
            ✓
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full flex items-center gap-2 px-4 py-3 border-t border-border transition-colors duration-150"
          style={{
            fontFamily: '"Azeret Mono", monospace',
            fontSize: 10,
            color: '#9A9A94',
            background: 'none',
            border: 'none',
            borderTop: '1px solid #DDDDD8',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: 14, lineHeight: 1, fontWeight: 300 }}>+</span>
          <span>Agregar</span>
        </button>
      )}
    </div>
  )
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="page flex flex-col gap-4">
      {[100, 80, 80].map((h, i) => (
        <div key={i} style={{
          background: '#EAEAE6', border: '1px solid #DDDDD8',
          borderRadius: 8, height: h, opacity: 0.6,
        }} className="animate-pulse" />
      ))}
    </div>
  )
}

// ── ChecklistPage ─────────────────────────────────────────────────────────────

export function ChecklistPage() {
  const { items, loading, addItem, toggleItem, deleteItem } = useChecklist()
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  if (loading) return <Skeleton />

  const total = items.length
  const done = items.filter(i => i.completado).length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div className="page flex flex-col gap-4">
      <div className="animate-card-enter card-stagger-1 page-title-row mb-1">
        <h2 className="page-title">Lista</h2>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="animate-card-enter card-stagger-1 px-1 flex items-center gap-3">
          <span style={{
            fontFamily: '"Azeret Mono", monospace',
            fontSize: 28,
            fontWeight: 700,
            color: '#0F0F0F',
            lineHeight: 1,
          }}>
            {pct}%
          </span>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{
              fontFamily: '"Azeret Mono", monospace',
              fontSize: 12,
              color: '#5A5A56',
            }}>
              {done}/{total}
            </span>
            <div style={{
              height: 4,
              background: '#EAEAE6',
              borderRadius: 2,
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${pct}%`,
                height: '100%',
                background: '#E10600',
                borderRadius: 2,
                transition: 'width 300ms ease',
              }} />
            </div>
          </div>
        </div>
      )}

      {SECTIONS.map((section, i) => (
        <div key={section.id} className={`animate-card-enter card-stagger-${i + 2}`}>
          <ChecklistSection
            section={section}
            items={items.filter((it) => it.categoria === section.id)}
            onToggle={toggleItem}
            onDelete={setConfirmDeleteId}
            onAdd={addItem}
          />
        </div>
      ))}

      <ConfirmSheet
        open={confirmDeleteId !== null}
        title="Eliminar ítem"
        message="¿Estás seguro? Esta acción no se puede deshacer."
        onConfirm={() => {
          if (confirmDeleteId) deleteItem(confirmDeleteId)
          setConfirmDeleteId(null)
        }}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  )
}
