import type { CSSProperties } from 'react'
import type { Phase, Substance } from '../thermodynamics'
import { formatTemperature } from '../thermodynamics'

type PhaseGalleryProps = {
  phase: Phase
  substance: Substance
  boilingPoint: number
}

type ParticlePoint = {
  x: number
  y: number
}

type PhaseDetails = {
  id: Phase
  name: string
  description: string
  particles: ParticlePoint[]
}

const phases: PhaseDetails[] = [
  {
    id: 'solid',
    name: 'Sólido',
    description: 'Próximas, organizadas; vibram no lugar.',
    particles: Array.from({ length: 16 }, (_, index) => ({
      x: 27 + (index % 4) * 15,
      y: 32 + Math.floor(index / 4) * 13,
    })),
  },
  {
    id: 'liquid',
    name: 'Líquido',
    description: 'Próximas, mas deslizam e mudam de posição.',
    particles: [
      { x: 20, y: 70 }, { x: 29, y: 60 }, { x: 38, y: 73 }, { x: 47, y: 62 },
      { x: 56, y: 72 }, { x: 65, y: 60 }, { x: 74, y: 72 }, { x: 83, y: 63 },
      { x: 24, y: 82 }, { x: 34, y: 77 }, { x: 44, y: 85 }, { x: 54, y: 78 },
      { x: 64, y: 84 }, { x: 73, y: 77 }, { x: 82, y: 84 }, { x: 91, y: 76 },
      { x: 15, y: 85 }, { x: 58, y: 92 },
    ],
  },
  {
    id: 'gas',
    name: 'Gasoso',
    description: 'Afastadas; movem-se e ocupam o recipiente.',
    particles: [
      { x: 17, y: 23 }, { x: 41, y: 17 }, { x: 70, y: 24 }, { x: 87, y: 15 },
      { x: 28, y: 43 }, { x: 57, y: 37 }, { x: 78, y: 47 }, { x: 13, y: 61 },
      { x: 41, y: 70 }, { x: 67, y: 65 }, { x: 89, y: 78 }, { x: 24, y: 87 },
    ],
  },
]

const phaseThreshold = (
  phase: Phase,
  substance: Substance,
  boilingPoint: number,
) => {
  if (phase === 'solid') return `Até ${formatTemperature(substance.meltingPoint)}`
  if (phase === 'gas') return `A partir de ${formatTemperature(boilingPoint)}`
  return `Entre ${formatTemperature(substance.meltingPoint)} e ${formatTemperature(boilingPoint)}`
}

export function PhaseGallery({ phase, substance, boilingPoint }: PhaseGalleryProps) {
  return (
    <section aria-labelledby="phase-map-title" className="phase-card">
      <div className="card-heading phase-heading">
        <div>
          <span className="eyebrow">MAPA DE FASES</span>
          <h2 id="phase-map-title">A mesma matéria, três comportamentos</h2>
        </div>
        <span className="current-temp">MICROSCÓPIO · 400×</span>
      </div>

      <div
        aria-label={`Estado atual: ${phases.find((item) => item.id === phase)?.name}`}
        className="phase-gallery"
      >
        {phases.map((item) => {
          const current = item.id === phase
          return (
            <article
              aria-current={current ? 'step' : undefined}
              className={`phase-specimen${current ? ' phase-specimen--active' : ''}`}
              key={item.id}
            >
              <div
                aria-label={`${item.name}: visualização microscópica das partículas`}
                className={`specimen-window specimen-window--${item.id}`}
                role="img"
                style={{ '--specimen-color': substance.color } as CSSProperties}
              >
                <span aria-hidden="true" className="specimen-rim" />
                <span aria-hidden="true" className="specimen-liquid" />
                <span aria-hidden="true" className="specimen-solid" />
                <span aria-hidden="true" className="specimen-wave" />
                <span aria-hidden="true" className="specimen-base" />
                {item.particles.map((point, index) => (
                  <span
                    aria-hidden="true"
                    className={`specimen-particle specimen-particle--${item.id}`}
                    key={index}
                    style={
                      {
                        '--particle-x': `${point.x}%`,
                        '--particle-y': `${point.y}%`,
                        '--particle-index': index,
                      } as CSSProperties
                    }
                  />
                ))}
                <span aria-hidden="true" className="specimen-caption">
                  {item.id === 'solid'
                    ? 'REDE ORDENADA'
                    : item.id === 'liquid'
                      ? 'FLUIDO · VOLUME DEFINIDO'
                      : 'GÁS · OCUPA O RECIPIENTE'}
                </span>
              </div>

              <div className="specimen-heading">
                <span className={`specimen-state-dot specimen-state-dot--${item.id}`} />
                <h3>{item.name}</h3>
                {current && <span className="specimen-current">ATUAL</span>}
              </div>
              <p className="specimen-description">{item.description}</p>
              <span className="specimen-threshold">
                {phaseThreshold(item.id, substance, boilingPoint)}
              </span>
            </article>
          )
        })}
      </div>
    </section>
  )
}
