export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export function parseDate(fecha: string): Date {
  const [y, m, d] = fecha.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function formatFecha(fecha: string): string {
  if (!fecha) return ''
  const date = parseDate(fecha)
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
  const weekday = cap(date.toLocaleDateString('es-ES', { weekday: 'short' }).replace(/[.,]/g, '').trim())
  const month   = cap(date.toLocaleDateString('es-ES', { month: 'short' }).replace(/[.,]/g, '').trim())
  return `${weekday} ${date.getDate()} ${month}`
}
