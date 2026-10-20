import { useCallback, useEffect, useRef, useState } from 'react'
import { ControlPanel } from './components/ControlPanel'
import { EventLog, type ExperimentEvent } from './components/EventLog'
import { PhaseGallery } from './components/PhaseGallery'
import { ParticleVessel } from './components/ParticleVessel'
import { TheoryPanel } from './components/TheoryPanel'
import './App.css'
import {
  boilingPointAtPressure,
  formatTemperature,
  getPhase,
  substances,
  type Phase,
} from './thermodynamics'

const phaseNames: Record<Phase, string> = {
  solid: 'Sólido',
  liquid: 'Líquido',
  gas: 'Gasoso',
}

function getTime() {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date())
}

function App() {
  const logoSrc = `${import.meta.env.BASE_URL}Logo.jpeg`
  const [substanceId, setSubstanceId] = useState('water')
  const [temperature, setTemperature] = useState(22)
  const [pressure, setPressure] = useState(1)
  const [lidClosed, setLidClosed] = useState(false)
  const [isHeating, setIsHeating] = useState(false)
  const [events, setEvents] = useState<ExperimentEvent[]>(() => [
    {
      id: 'initial-event',
      time: getTime(),
      title: 'Experimento iniciado',
      detail: 'Água · 22 °C · 1,00 atm',
      kind: 'initial',
    },
  ])

  const substance = substances.find((item) => item.id === substanceId)!
  const boilingPoint = boilingPointAtPressure(substance, pressure)
  const phase = getPhase(temperature, substance.meltingPoint, boilingPoint)
  const previousPhase = useRef(phase)

  const addEvent = useCallback(
    (title: string, detail: string, kind: ExperimentEvent['kind']) => {
      setEvents((current) =>
        [{ id: `${Date.now()}-${Math.random()}`, time: getTime(), title, detail, kind }, ...current].slice(
          0,
          6,
        ),
      )
    },
    [],
  )

  useEffect(() => {
    if (previousPhase.current === phase) return

    const oldPhase = previousPhase.current
    previousPhase.current = phase
    addEvent(
      `Mudança de fase: ${phaseNames[oldPhase]} → ${phaseNames[phase]}`,
      `${substance.name} · ${formatTemperature(temperature)} · ${pressure.toFixed(2)} atm`,
      'transition',
    )
  }, [addEvent, phase, pressure, substance.name, temperature])

  useEffect(() => {
    if (!isHeating) return

    const timer = window.setTimeout(() => {
      const nextTemperature = Math.min(temperature + 1, substance.maxTemperature)
      setTemperature(nextTemperature)
      if (nextTemperature >= substance.maxTemperature) setIsHeating(false)
    }, 90)

    return () => window.clearTimeout(timer)
  }, [isHeating, substance.maxTemperature, temperature])

  function handleSubstanceChange(id: string) {
    const nextSubstance = substances.find((item) => item.id === id)
    if (!nextSubstance) return
    setIsHeating(false)
    setSubstanceId(id)
    setTemperature((current) =>
      Math.min(nextSubstance.maxTemperature, Math.max(nextSubstance.minTemperature, current)),
    )
    addEvent('Substância alterada', `Agora você está observando ${nextSubstance.name}.`, 'action')
  }

  function handleLidChange() {
    const nextLidState = !lidClosed
    setLidClosed(nextLidState)
    addEvent(
      `Tampa ${nextLidState ? 'fechada' : 'aberta'}`,
      'A pressão externa permanece independente.',
      'action',
    )
  }

  function handleReset() {
    setIsHeating(false)
    previousPhase.current = 'liquid'
    setSubstanceId('water')
    setTemperature(22)
    setPressure(1)
    setLidClosed(false)
    setEvents([
      {
        id: `${Date.now()}-reset`,
        time: getTime(),
        title: 'Experimento reiniciado',
        detail: 'Água · 22 °C · 1,00 atm',
        kind: 'initial',
      },
    ])
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a aria-label="ThermaSim, início" className="brand" href="#">
          <img alt="" className="brand-mark" src={logoSrc} />
          <span>Therma<span className="brand-accent">Sim</span></span>
        </a>
        <div className="topbar-right">
          <span className="course-tag">THERMASIM · QUÍMICA</span>
          <span aria-hidden="true" className="topbar-divider" />
          <span className="lesson-label">Termodinâmica</span>
        </div>
      </header>

      <main>
        <section className="intro">
          <div className="intro-copy">
            <span className="eyebrow intro-eyebrow">
              <span className="eyebrow-line" />
              ESTAÇÃO DE PESQUISA · QUÍMICA FÍSICA
            </span>
            <h1>
              Entre no laboratório.
              <br />
              <span>Investigue a matéria.</span>
            </h1>
            <p>
              Ajuste os instrumentos, aqueça a amostra e acompanhe o que acontece — do béquer às partículas.
            </p>
          </div>
          <div className="intro-side">
            <div aria-hidden="true" className="orbit-decoration">
              <span />
              <span />
              <span />
            </div>
            <p>Uma bancada virtual para observar a termodinâmica em ação.</p>
          </div>
        </section>

        <section aria-label="Bancada de laboratório" className="lab-room">
          <div className="room-labelbar">
            <div className="room-location">
              <span className="room-window">
              <img alt="" src={logoSrc} />
              </span>
              <span>
                <strong>THERMASIM · LAB 02</strong>
                <small>BANCADA DE TERMODINÂMICA</small>
              </span>
            </div>
            <div className="room-instruments">
              <span className="room-status"><span /> SISTEMA ATIVO</span>
              <span className="room-instrument-mark">AMOSTRA · 01</span>
            </div>
          </div>

          <section aria-label="Simulador termodinâmico" className="simulator-grid">
          <article className="simulation-card">
            <div className="simulation-heading">
              <div>
                <span className="eyebrow">CÂMARA DE OBSERVAÇÃO</span>
                <h2>Comportamento das partículas</h2>
              </div>
              <span className={`phase-pill phase-pill--${phase}`}>
                <span />
                {phaseNames[phase]}
              </span>
            </div>
            <ParticleVessel
              boilingPoint={boilingPoint}
              isHeating={isHeating}
              lidClosed={lidClosed}
              phase={phase}
              substance={substance}
              temperature={temperature}
            />
            <div className="measurement-row">
              <div className="measurement">
                <span className="measurement-label">PONTO DE FUSÃO</span>
                <strong>{formatTemperature(substance.meltingPoint)}</strong>
              </div>
              <span aria-hidden="true" className="measurement-divider" />
              <div className="measurement">
                <span className="measurement-label">PONTO DE EBULIÇÃO</span>
                <strong>{formatTemperature(boilingPoint)}</strong>
                <span className="measurement-context">a {pressure.toFixed(2)} atm</span>
              </div>
              <span aria-hidden="true" className="measurement-divider" />
              <div className="measurement">
                <span className="measurement-label">PRESSÃO</span>
                <strong>{pressure.toFixed(2)} atm</strong>
              </div>
            </div>
          </article>

          <ControlPanel
            isHeating={isHeating}
            lidClosed={lidClosed}
            onHeatingChange={() =>
              setIsHeating((current) => temperature < substance.maxTemperature && !current)
            }
            onLidChange={handleLidChange}
            onPressureChange={setPressure}
            onReset={handleReset}
            onSubstanceChange={handleSubstanceChange}
            onTemperatureChange={(value) => {
              setTemperature(value)
              if (isHeating) setIsHeating(false)
            }}
            pressure={pressure}
            substance={substance}
            temperature={temperature}
          />
          </section>

          <section className="bottom-grid">
          <PhaseGallery
            boilingPoint={boilingPoint}
            phase={phase}
            substance={substance}
          />

          <EventLog events={events} />
          </section>
        </section>

        <TheoryPanel
          boilingPoint={boilingPoint}
          phase={phase}
          pressure={pressure}
          substance={substance}
          temperature={temperature}
        />

        <footer className="page-footer">
          <span>THERMASIM<span className="brand-period">.</span> LAB</span>
          <span>
            Modelo aproximado de Clausius–Clapeyron
            <span aria-hidden="true"> · </span>
            Os valores variam com as condições experimentais
          </span>
        </footer>
      </main>
    </div>
  )
}

export default App
