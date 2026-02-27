import { useMemo } from 'react'

const TRIP_START = new Date('2026-06-10T00:00:00')

export function Countdown() {
  const { days, hours, minutes, isPast } = useMemo(() => {
    const now = new Date()
    const diff = TRIP_START.getTime() - now.getTime()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, isPast: true }
    const totalMinutes = Math.floor(diff / 60000)
    const minutes = totalMinutes % 60
    const totalHours = Math.floor(totalMinutes / 60)
    const hours = totalHours % 24
    const days = Math.floor(totalHours / 24)
    return { days, hours, minutes, isPast: false }
  }, [])

  if (isPast) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-3 animate-card-in">
        <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">¡Estamos en España!</p>
        <p className="text-white font-bold text-lg">¡Buen viaje! 🇪🇸</p>
      </div>
    )
  }

  return (
    <div className="relative bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-3 animate-card-in">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-600" />
      <div className="p-4">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
          Faltan para España 🇪🇸
        </p>
        <div className="flex gap-3 items-end">
          <Unit value={days} label="días" large />
          <Unit value={hours} label="horas" />
          <Unit value={minutes} label="min" />
        </div>
        <p className="text-xs text-gray-600 mt-3 font-medium">
          10 de junio, 2026 · Madrid
        </p>
      </div>
    </div>
  )
}

function Unit({ value, label, large }: { value: number; label: string; large?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <span className={`font-black text-white leading-none ${large ? 'text-5xl' : 'text-3xl'}`}>
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mt-1">
        {label}
      </span>
    </div>
  )
}
