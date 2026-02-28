import { useState, useRef, useEffect } from 'react'
import { useChecklist } from '../hooks/useChecklist'
import type { ChecklistItem } from '../lib/types'
import { ConfirmSheet } from '../components/ConfirmSheet'

// Cada sección tiene su propio color de identidad
const SECTIONS = [
  { id: 'llevar',      label: 'Qué llevar',        color: '#C8472A' },
  { id: 'cuenta',      label: 'A tener en cuenta', color: '#E8A04A' },
  { id: 'actividades', label: 'Actividades',        color: '#004D98' },
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
        className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200"
        style={{
          borderColor: item.completado ? accentColor : '#E7E2DC',
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
      </button>

      <span
        className={`flex-1 text-[14px] leading-snug transition-all duration-200 ${
          item.completado ? 'line-through text-inactive' : 'text-text'
        }`}
      >
        {item.texto}
      </span>

      <button
        onClick={() => onDelete(item.id)}
        className="text-inactive hover:text-accent transition-colors duration-150 p-0.5 shrink-0"
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
      border: '1px solid #E7E2DC',
      borderLeft: `3px solid ${section.color}`,
      borderRadius: 16,
      overflow: 'hidden',
    }}>
      {/* Header: bandera a cuadros que se difumina en negro */}
      <div style={{
        background: `linear-gradient(135deg, #0D0D10 0%, ${section.color}28 100%)`,
        display: 'flex',
        alignItems: 'center',
        height: 48,
        overflow: 'hidden',
      }}>
        {/* Checkered flag strip — fades right into the dark */}
        <div style={{
          width: 68,
          height: '100%',
          flexShrink: 0,
          backgroundImage: 'repeating-conic-gradient(rgba(255,255,255,0.22) 0% 25%, rgba(0,0,0,0) 0% 50%)',
          backgroundSize: '10px 10px',
          maskImage: 'linear-gradient(to right, black 20%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, black 20%, transparent 100%)',
        }} />

        {/* Título + badge */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingRight: 16,
        }}>
          <span style={{
            fontSize: 14, fontWeight: 900, letterSpacing: 2,
            textTransform: 'uppercase', color: '#FFFFFF',
          }}>
            {section.label}
          </span>

          {allDone ? (
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: 1,
              textTransform: 'uppercase', color: '#10b981',
              background: 'rgba(16,185,129,0.12)',
              padding: '3px 8px', borderRadius: 4,
            }}>
              ✓ Listo
            </span>
          ) : pending > 0 ? (
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: 1,
              textTransform: 'uppercase', color: section.color,
              background: `${section.color}1A`,
              border: `1px solid ${section.color}40`,
              padding: '3px 8px', borderRadius: 4,
            }}>
              {pending} pend.
            </span>
          ) : null}
        </div>
      </div>
      {/* Color stripe below header */}
      <div style={{ height: 3, background: section.color }} />

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
            className="flex-1 text-[14px] text-text placeholder:text-inactive outline-none bg-transparent"
          />
          <button
            onMouseDown={(e) => { e.preventDefault(); handleConfirm() }}
            style={{ color: section.color, fontWeight: 700, fontSize: 14 }}
          >
            ✓
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full flex items-center gap-2 px-4 py-3 border-t border-border text-[13px] font-medium transition-colors duration-150"
          style={{ color: '#A09890' }}
          onMouseEnter={e => (e.currentTarget.style.color = section.color)}
          onMouseLeave={e => (e.currentTarget.style.color = '#A09890')}
        >
          <span style={{ fontSize: 16, lineHeight: 1, fontWeight: 300 }}>+</span>
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
          background: '#0D0D10', border: '1px solid #1E1E26',
          borderRadius: 16, height: h, opacity: 0.6,
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

  return (
    <div className="page flex flex-col gap-4">
      {SECTIONS.map((section, i) => (
        <div key={section.id} className={`animate-card-enter card-stagger-${i + 1}`}>
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
