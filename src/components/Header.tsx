interface Props {
  title: string
  subtitle?: string
  right?: React.ReactNode
}

export function Header({ title, subtitle, right }: Props) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-gray-950/95 backdrop-blur border-b border-gray-800 flex items-center justify-between px-4"
      style={{ paddingTop: 'calc(10px + env(safe-area-inset-top, 0px))', paddingBottom: '10px' }}
    >
      <div>
        <h1 className="text-base font-bold text-white">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {right && <div>{right}</div>}
    </header>
  )
}
