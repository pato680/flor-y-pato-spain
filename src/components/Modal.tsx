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
        className="relative w-full max-w-lg animate-modal-enter"
        style={{
          background: '#FFFFFF',
          border: '1px solid #DDDDD8',
          borderRadius: '16px 16px 0 0',
          padding: 20,
          paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2" style={{
          width: 36,
          height: 4,
          borderRadius: 2,
          background: '#DDDDD8',
        }} />

        <div className="flex items-center justify-between mb-5 mt-1">
          <h2 style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 17,
            fontWeight: 700,
            color: '#0F0F0F',
          }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="touch-target text-text-muted hover:text-text w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-150"
            style={{ background: '#EAEAE6' }}
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
