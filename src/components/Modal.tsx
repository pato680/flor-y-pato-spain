import { useEffect } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ open, onClose, title, children }: Props) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center animate-overlay-enter"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative w-full max-w-lg bg-surface border border-border rounded-t-2xl p-5 animate-modal-enter"
        style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-9 h-1 rounded-full bg-border" />

        <div className="flex items-center justify-between mb-5 mt-1">
          <h2 className="text-[17px] font-bold text-text">{title}</h2>
          <button
            onClick={onClose}
            className="touch-target text-inactive hover:text-text w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-150"
            style={{ background: '#F0EDE9' }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
