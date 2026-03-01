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

const NOTE_ACCENT_PALETTE = ['#C8472A', '#E8A04A', '#004D98', '#10b981', '#6366f1']

function NoteCard({ note, onEdit, onDelete, index }: {
  note: Note
  onEdit: () => void
  onDelete: () => void
  index: number
}) {
  const accentColor = NOTE_ACCENT_PALETTE[index % NOTE_ACCENT_PALETTE.length]

  return (
    <div
      className="card p-0 overflow-hidden flex flex-col cursor-pointer active:scale-[0.98] transition-transform duration-150"
      style={{ background: 'linear-gradient(145deg, #FFFFFF 0%, #FDF8F5 100%)' }}
      onClick={onEdit}
    >
      {/* Accent bar */}
      <div style={{ height: 3, background: accentColor, flexShrink: 0 }} />

      {/* Content */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        {note.titulo && (
          <p className="text-[14px] font-extrabold text-text leading-snug">
            {note.titulo}
          </p>
        )}
        <p
          className="text-[13px] leading-snug text-text flex-1"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: note.titulo ? 6 : 8,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            opacity: 0.85,
          }}
        >
          {note.texto}
        </p>
        <div className="flex items-center justify-between mt-1">
          <span style={{ fontSize: 10, fontWeight: 600, color: accentColor }}>{formatDate(note.creadoEn)}</span>
          <button
            onClick={e => { e.stopPropagation(); onDelete() }}
            className="touch-target shrink-0 -mr-1 text-inactive hover:text-accent text-[11px] transition-colors duration-150"
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
          className="w-full resize-none outline-none text-[15px] leading-relaxed text-text placeholder:text-inactive bg-transparent"
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

export function NotasPage() {
  const { notes, loading, addNote, updateNote, deleteNote } = useNotes()
  const [showAdd, setShowAdd] = useState(false)
  const [editNote, setEditNote] = useState<Note | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  return (
    <div className="page flex flex-col gap-4">

      {/* Header row */}
      <div className="animate-card-enter card-stagger-1 page-title-row">
        <h2 className="page-title">Notas</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="btn-secondary h-8 px-3 text-[13px]"
        >
          + Nota
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-5 h-5 rounded-full border-2 border-border border-t-accent animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!loading && notes.length === 0 && (
        <div className="animate-card-enter card-stagger-2 flex flex-col items-center gap-2 py-10 rounded-card border border-dashed border-border bg-surface">
          <p className="text-[13px] text-text-sub text-center px-6">
            Guarda ideas, restaurantes, lugares que visitar...
          </p>
          <button
            onClick={() => setShowAdd(true)}
            className="btn-primary h-9 px-5 text-[13px] mt-1"
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
