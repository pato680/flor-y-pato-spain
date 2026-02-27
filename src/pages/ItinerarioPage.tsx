import { Countdown } from '../components/Countdown'

export function ItinerarioPage() {
  return (
    <div className="page flex flex-col gap-4">

      {/* Hero */}
      <div className="card animate-card-enter card-stagger-1 relative overflow-hidden">
        <div className="racing-stripe" />
        <div className="relative z-10">
          <p className="f1-label mb-1" style={{ color: 'var(--color-accent)' }}>
            Gran Premio de Barcelona
          </p>
          <h1 className="text-screen-title text-text mt-0.5">España 2026</h1>
          <p className="text-body text-text-sub mt-1">5 – 20 de junio · 16 días</p>
        </div>
      </div>

      {/* Countdown */}
      <div className="animate-card-enter card-stagger-2">
        <Countdown />
      </div>

      {/* Itinerary list */}
      <div className="animate-card-enter card-stagger-3">
        <p className="list-section-header">Días del viaje</p>
        <div className="list-section">
          <div className="list-row justify-center py-6">
            <p className="text-body text-text-sub text-center">El itinerario se agregará pronto</p>
          </div>
        </div>
      </div>

    </div>
  )
}
