import { useState, useEffect, useRef } from 'react'
import { useNotes } from '../hooks/useNotes'
import type { Note } from '../lib/types'
import { Modal } from '../components/Modal'
import { ConfirmSheet } from '../components/ConfirmSheet'
import { formatFecha } from '../lib/utils'

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(ts: number): string {
  const d = new Date(ts)
  const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  return formatFecha(iso)
}

// ── NoteCard ──────────────────────────────────────────────────────────────────

const NOTE_ACCENT_PALETTE = ['#E10600', '#F09000', '#0070C8', '#00965E', '#7838C8']

function NoteCard({ note, onEdit, onDelete, index }: {
  note: Note
  onEdit: () => void
  onDelete: () => void
  index: number
}) {
  const accentColor = NOTE_ACCENT_PALETTE[index % NOTE_ACCENT_PALETTE.length]

  return (
    <div
      className="overflow-hidden flex flex-col cursor-pointer active:scale-[0.98] transition-transform duration-150"
      style={{
        background: '#FFFFFF',
        border: '1px solid #DDDDD8',
        borderLeft: `3px solid ${accentColor}`,
        borderRadius: 8,
      }}
      onClick={onEdit}
    >
      {/* Content */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        {note.titulo && (
          <p style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 14,
            fontWeight: 700,
            color: '#0F0F0F',
            lineHeight: 1.4,
          }}>
            {note.titulo}
          </p>
        )}
        <p
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 13,
            color: '#5A5A56',
            display: '-webkit-box',
            WebkitLineClamp: note.titulo ? 6 : 8,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            lineHeight: 1.4,
            flex: 1,
          }}
        >
          {note.texto}
        </p>
        <div className="flex items-center justify-between mt-1">
          <span style={{
            fontFamily: '"Azeret Mono", monospace',
            fontSize: 10,
            fontWeight: 600,
            color: accentColor,
          }}>
            {formatDate(note.creadoEn)}
          </span>
          <button
            onClick={e => { e.stopPropagation(); onDelete() }}
            className="touch-target shrink-0 -mr-1 text-text-muted hover:text-accent text-[11px] transition-colors duration-150"
            aria-label="Eliminar nota"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}

// ── NoteModal ─────────────────────────────────────────────────────────────────

function NoteModal({ open, onClose, onSave, initialText = '', initialTitulo = '' }: {
  open: boolean
  onClose: () => void
  onSave: (text: string, titulo?: string) => void
  initialText?: string
  initialTitulo?: string
}) {
  const [text, setText] = useState(initialText)
  const [titulo, setTitulo] = useState(initialTitulo)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isEdit = initialText !== '' || initialTitulo !== ''

  useEffect(() => {
    if (open) {
      setText(initialText)
      setTitulo(initialTitulo)
      setTimeout(() => textareaRef.current?.focus(), 80)
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.max(el.scrollHeight, 140)}px`
  }, [text])

  function handleSave() {
    if (!text.trim()) return
    onSave(text.trim(), titulo.trim() || undefined)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Editar nota' : 'Nueva nota'}>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          className="input"
          placeholder="Título (opcional)"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
        />
        <div className="-mx-5 h-px bg-border" />
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Escribe tu nota..."
          className="w-full resize-none outline-none text-[15px] leading-relaxed text-text placeholder:text-text-muted bg-transparent"
          style={{ minHeight: 140 }}
        />
        <button
          onClick={handleSave}
          disabled={!text.trim()}
          className="btn-primary disabled:opacity-40"
        >
          {isEdit ? 'Guardar cambios' : 'Agregar nota'}
        </button>
      </div>
    </Modal>
  )
}

// ── NotasPage ─────────────────────────────────────────────────────────────────

export function NotasPage({ fabTrigger }: { fabTrigger?: number }) {
  const { notes, loading, addNote, updateNote, deleteNote } = useNotes()
  const [showAdd, setShowAdd] = useState(false)
  const [editNote, setEditNote] = useState<Note | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  // FAB trigger → open NoteModal (ignore mount value)
  const fabRef = useRef(fabTrigger)
  useEffect(() => {
    if (fabTrigger !== fabRef.current) {
      fabRef.current = fabTrigger
      setShowAdd(true)
    }
  }, [fabTrigger])

  return (
    <div className="page flex flex-col gap-4">

      {/* Header row */}
      <div className="animate-card-enter card-stagger-1 page-title-row">
        <h2 className="page-title">Notas</h2>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-5 h-5 rounded-full border-2 border-border border-t-accent animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!loading && notes.length === 0 && (
        <div className="animate-card-enter card-stagger-2 flex flex-col items-center gap-2 py-10" style={{
          border: '1px dashed #DDDDD8',
          borderRadius: 8,
          background: 'transparent',
        }}>
          <p style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 13,
            color: '#5A5A56',
            textAlign: 'center',
            padding: '0 24px',
          }}>
            Guarda ideas, restaurantes, lugares que visitar...
          </p>
          <button
            onClick={() => setShowAdd(true)}
            className="btn-primary h-12 px-6 text-[15px] w-full mt-1"
          >
            + Primera nota
          </button>
        </div>
      )}

      {/* Grid de cards */}
      {!loading && notes.length > 0 && (
        <div className="animate-card-enter card-stagger-2 grid grid-cols-2 gap-3">
          {notes.map((note, idx) => (
            <NoteCard
              key={note.id}
              note={note}
              index={idx}
              onEdit={() => setEditNote(note)}
              onDelete={() => setConfirmDeleteId(note.id)}
            />
          ))}
        </div>
      )}

      {/* Modal agregar */}
      <NoteModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={(text, t) => addNote(text, t)}
      />

      {/* Modal editar */}
      <NoteModal
        open={editNote !== null}
        onClose={() => setEditNote(null)}
        initialText={editNote?.texto ?? ''}
        initialTitulo={editNote?.titulo ?? ''}
        onSave={(text, t) => { if (editNote) updateNote(editNote.id, text, t) }}
      />

      {/* Confirm delete */}
      <ConfirmSheet
        open={confirmDeleteId !== null}
        title="Eliminar nota"
        message="¿Estás seguro? Esta acción no se puede deshacer."
        onConfirm={() => {
          if (confirmDeleteId) deleteNote(confirmDeleteId)
          setConfirmDeleteId(null)
        }}
        onCancel={() => setConfirmDeleteId(null)}
      />

    </div>
  )
}
