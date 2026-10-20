import type { CSSProperties } from 'react'
import type { Phase, Substance } from '../thermodynamics'
import { formatTemperature } from '../thermodynamics'

type ParticleVesselProps = {
  phase: Phase
  substance: Substance
  temperature: number
  boilingPoint: number
  lidClosed: boolean
  isHeating: boolean
}

const phaseNames: Record<Phase, string> = {
  solid: 'Sólido',
  liquid: 'Líquido',
  gas: 'Gasoso',
}

function getParticlePosition(index: number, phase: Phase) {
  if (phase === 'solid') {
    return {
      x: 174 + (index % 10) * 29,
      y: 238 + Math.floor(index / 10) * 13,
    }
  }

  if (phase === 'liquid') {
    return {
      x: 126 + ((index * 67) % 388),
      y: 195 + ((index * 37) % 94),
    }
  }

  return {
    x: 126 + ((index * 67) % 388),
    y: 59 + ((index * 47) % 213),
  }
}

export function ParticleVessel({
  phase,
  substance,
  temperature,
  boilingPoint,
  lidClosed,
  isHeating,
}: ParticleVesselProps) {
  const approachingBoiling =
    phase === 'liquid' && temperature >= boilingPoint - Math.max(4, boilingPoint * 0.08)
  const kelvin = temperature + 273.15
  const motionDuration = Math.min(2.6, Math.max(0.7, 2.1 / Math.sqrt(kelvin / 273.15)))
  const vibration = Math.min(5, Math.max(0.5, (temperature - substance.minTemperature) / 32))

  const particles = Array.from(
    { length: phase === 'solid' ? 40 : 48 },
    (_, index) => {
      const { x, y } = getParticlePosition(index, phase)
      const style = {
        '--drift-x': `${((index % 5) - 2) * (phase === 'gas' ? 9 : phase === 'liquid' ? 4 : vibration * 0.55)}px`,
        '--drift-y': `${((index % 7) - 3) * (phase === 'gas' ? 8 : phase === 'liquid' ? 3 : vibration * 0.45)}px`,
        '--delay': `${(index % 12) * -0.19}s`,
        '--motion-duration': `${motionDuration}s`,
        '--particle-color': substance.color,
      } as CSSProperties

      return (
        <circle
          className={`particle particle--${phase}`}
          key={`${substance.id}-${phase}-${index}`}
          cx={x}
          cy={y}
          r={phase === 'gas' ? 5 : 6}
          style={style}
        />
      )
    },
  )

  return (
    <div
      className={`vessel-stage vessel-stage--${phase}${isHeating ? ' vessel-stage--heating' : ''}${approachingBoiling ? ' vessel-stage--near-boiling' : ''}`}
      style={{ '--liquid-color': substance.color } as CSSProperties}
    >
      <div className="vessel-callout">
        <span className="callout-dot" />
        <span>MICROSCÓPIO DIGITAL · 400×</span>
      </div>
      <div className="vessel-temperature">
        <span className="temperature-led" />
        <span>{formatTemperature(temperature)}</span>
        <span className="temperature-divider" />
        <span>{phaseNames[phase]}</span>
      </div>

      <svg
        aria-label={`Simulação de ${substance.name} no estado ${phaseNames[phase].toLowerCase()}`}
        className="vessel-illustration"
        key={substance.id}
        role="img"
        viewBox="0 0 640 340"
      >
        <defs>
          <clipPath id="vessel-clip">
            <path d="M104 58h432v224q0 20-20 20H124q-20 0-20-20z" />
          </clipPath>
          <linearGradient id="glass" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".55" />
            <stop offset=".48" stopColor="#fff" stopOpacity=".12" />
            <stop offset="1" stopColor="#fff" stopOpacity=".36" />
          </linearGradient>
          <linearGradient id="liquid" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={substance.color} stopOpacity=".52" />
            <stop offset="1" stopColor={substance.color} stopOpacity=".2" />
          </linearGradient>
        </defs>

        <ellipse className="vessel-shadow" cx="320" cy="313" rx="194" ry="12" />

        {lidClosed && (
          <g className="vessel-lid">
            <rect x="99" y="40" width="442" height="17" rx="7" />
            <rect x="266" y="30" width="108" height="9" rx="4.5" />
          </g>
        )}

        <g clipPath="url(#vessel-clip)">
          {phase === 'liquid' && (
            <>
              <path
                className="liquid-fill"
                d="M104 185q55-5 108 0t108 0 108 0 108 0v119H104z"
                fill="url(#liquid)"
              />
              <path
                className="liquid-surface"
                d="M104 184q55-8 108 0t108 0 108 0 108 0"
                fill="none"
                stroke={substance.color}
                strokeOpacity=".8"
                strokeWidth="2"
              />
            </>
          )}
          {approachingBoiling && (
            <g className="boiling-bubbles">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <circle
                  className="boiling-bubble"
                  cx={171 + index * 55}
                  cy={220 + (index % 3) * 20}
                  key={index}
                  r={3 + (index % 3)}
                  style={{ '--bubble-delay': `${index * -0.55}s` } as CSSProperties}
                />
              ))}
            </g>
          )}
          {phase === 'solid' && (
            <path
              d="M105 226h430v78H105z"
              fill={substance.color}
              fillOpacity=".24"
            />
          )}
          {phase === 'gas' && (
            <path
              d="M104 58h432v244H104z"
              fill={substance.color}
              fillOpacity=".055"
            />
          )}
          {particles}
        </g>

        <path
          className="vessel-outline"
          d="M104 58h432v224q0 20-20 20H124q-20 0-20-20z"
          fill="url(#glass)"
        />
        <path
          className="vessel-highlight"
          d="M117 78v193q0 14 12 14"
          fill="none"
        />
        <path
          className="vessel-highlight vessel-highlight--right"
          d="M523 78v174"
          fill="none"
        />
        <path
          className="vessel-rim"
          d="M99 58q0-8 10-8h422q10 0 10 8"
          fill="none"
        />

        <g aria-hidden="true" className="lab-thermometer">
          <rect height="110" rx="7" width="12" x="564" y="103" />
          <rect
            className="thermometer-mercury"
            height={Math.min(83, Math.max(10, 10 + ((temperature + 120) / 470) * 73))}
            rx="4"
            width="5"
            x="567.5"
            y={196 - Math.min(83, Math.max(10, 10 + ((temperature + 120) / 470) * 73))}
          />
          <circle className="thermometer-bulb" cx="570" cy="218" r="9" />
          <path d="M580 114h8m-8 15h5m-5 15h8m-8 15h5m-5 15h8" />
        </g>

        <g aria-hidden="true" className="hotplate">
          <ellipse className="burner-glow" cx="320" cy="312" rx="86" ry="14" />
          <path d="M212 303h216l-13 20H225z" />
          <path className="hotplate-top" d="M222 297h196v7H222z" />
          <circle className="hotplate-knob" cx="399" cy="313" r="3" />
          <path className="hotplate-leg" d="M237 323v5m166-5v5" />
        </g>
      </svg>

      <div className="vessel-caption">
        <span>{substance.formula}</span>
        <span className="caption-separator">·</span>
        <span>{approachingBoiling ? 'Nucleação de bolhas' : `Ebulição a ${formatTemperature(boilingPoint)}`}</span>
      </div>
    </div>
  )
}
