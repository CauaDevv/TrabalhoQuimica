export type ExperimentEvent = {
  id: string
  time: string
  title: string
  detail: string
  kind: 'initial' | 'transition' | 'action'
}

type EventLogProps = {
  events: ExperimentEvent[]
}

export function EventLog({ events }: EventLogProps) {
  return (
    <section aria-labelledby="event-log-title" className="event-card">
      <div className="card-heading event-heading">
        <div>
          <span className="eyebrow">REGISTRO</span>
          <h2 id="event-log-title">O que está acontecendo</h2>
        </div>
        <span className="live-indicator">
          <span />
          AO VIVO
        </span>
      </div>

      {events.length === 0 ? (
        <p className="empty-events">As mudanças de fase aparecerão aqui.</p>
      ) : (
        <ol aria-live="polite" className="event-list">
          {events.map((event) => (
            <li className="event-item" key={event.id}>
              <span className={`event-marker event-marker--${event.kind}`} />
              <div className="event-copy">
                <p>{event.title}</p>
                <span>{event.detail}</span>
              </div>
              <time>{event.time}</time>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
