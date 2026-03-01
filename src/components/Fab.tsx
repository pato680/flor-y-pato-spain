import { useState, useEffect } from 'react'

interface Props {
  onClick: () => void
  /** Changing this key re-triggers the entrance animation */
  animKey?: number
}

export function Fab({ onClick, animKey }: Props) {
  const [hidden, setHidden] = useState(false)

  // Hide FAB when a modal is open (Modal.tsx sets body overflow to 'hidden')
  useEffect(() => {
    const check = () => setHidden(document.body.style.overflow === 'hidden')
    const observer = new MutationObserver(check)
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] })
    return () => observer.disconnect()
  }, [])

  if (hidden) return null

  return (
    <button
      key={animKey}
      onClick={onClick}
      className="animate-fab-enter active:scale-[0.92] transition-transform duration-150"
      style={{
        position: 'fixed',
        right: 20,
        bottom: `calc(80px + env(safe-area-inset-bottom, 0px))`,
        zIndex: 100,
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: '#C8472A',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 14px rgba(200,71,42,0.35), 0 1px 3px rgba(0,0,0,0.12)',
        WebkitTapHighlightColor: 'transparent',
      }}
      aria-label="Crear nuevo"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </button>
  )
}
