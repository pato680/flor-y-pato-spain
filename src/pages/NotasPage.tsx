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

function NoteCard({ note, onEdit, onDelete }: {
  note: Note
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div
      className="card p-3 flex flex-col gap-2 cursor-pointer active:scale-[0.98] transition-transform duration-150"
      onClick={onEdit}
    >
      {note.titulo && (
        <p className="text-[13px] font-bold text-text leading-snug">
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
        }}
      >
        {note.texto}
      </p>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px] text-inactive">{formatDate(note.creadoEn)}</span>
        <button
          onClick={e => { e.stopPropagation(); onDelete() }}
          className="text-inactive hover:text-accent w-5 h-5 flex items-center justify-center rounded-full text-[11px] transition-colors duration-150 shrink-0"
          aria-label="Eliminar nota"
        >
          ✕
        </button>
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
      <div className="animate-card-enter card-stagger-1 flex items-center justify-between px-1">
        <p className="text-label text-text-sub uppercase tracking-wider">Notas</p>
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
          {notes.map(note => (
            <NoteCard
              key={note.id}
              note={note}
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
