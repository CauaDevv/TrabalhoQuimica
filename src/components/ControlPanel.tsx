import type { CSSProperties } from 'react'
import type { Substance } from '../thermodynamics'
import { formatTemperature, MAX_PRESSURE, MIN_PRESSURE } from '../thermodynamics'

type ControlPanelProps = {
  substance: Substance
  temperature: number
  pressure: number
  lidClosed: boolean
  isHeating: boolean
  onSubstanceChange: (id: string) => void
  onTemperatureChange: (temperature: number) => void
  onPressureChange: (pressure: number) => void
  onLidChange: () => void
  onHeatingChange: () => void
  onReset: () => void
}

const formulaById: Record<string, string> = {
  water: 'H₂O',
  ethanol: 'C₂H₆O',
  acetone: 'C₃H₆O',
}

export function ControlPanel({
  substance,
  temperature,
  pressure,
  lidClosed,
  isHeating,
  onSubstanceChange,
  onTemperatureChange,
  onPressureChange,
  onLidChange,
  onHeatingChange,
  onReset,
}: ControlPanelProps) {
  return (
    <section aria-labelledby="controls-title" className="control-card">
      <div className="card-heading">
        <div>
          <span className="eyebrow">PARÂMETROS</span>
          <h2 id="controls-title">Seu experimento</h2>
        </div>
        <button className="icon-button reset-button" onClick={onReset} type="button">
          <svg aria-hidden="true" viewBox="0 0 20 20">
            <path d="M3.3 9a6.8 6.8 0 1 1 .6 4.5M3.3 4.4v4.8h4.8" />
          </svg>
          <span>Reiniciar</span>
        </button>
      </div>

      <div className="control-group">
        <span className="field-label">Substância</span>
        <div aria-label="Escolha uma substância" className="substance-options" role="group">
          {(['water', 'ethanol', 'acetone'] as const).map((id) => {
            const selected = substance.id === id
            return (
              <button
                aria-pressed={selected}
                className={`substance-option${selected ? ' substance-option--selected' : ''}`}
                key={id}
                onClick={() => onSubstanceChange(id)}
                type="button"
              >
                <span className={`formula formula--${id}`}>{formulaById[id]}</span>
                <span>{id === 'water' ? 'Água' : id === 'ethanol' ? 'Etanol' : 'Acetona'}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="control-group slider-group">
        <div className="slider-heading">
          <label className="field-label" htmlFor="temperature">
            Temperatura
          </label>
          <output className="slider-value" htmlFor="temperature">
            {formatTemperature(temperature)}
          </output>
        </div>
        <input
          id="temperature"
          max={substance.maxTemperature}
          min={substance.minTemperature}
          onChange={(event) => onTemperatureChange(Number(event.target.value))}
          style={
            {
              '--range-progress': `${((temperature - substance.minTemperature) / (substance.maxTemperature - substance.minTemperature)) * 100}%`,
            } as CSSProperties
          }
          type="range"
          value={temperature}
        />
        <div className="range-labels">
          <span>{formatTemperature(substance.minTemperature)}</span>
          <span>{formatTemperature(substance.maxTemperature)}</span>
        </div>
      </div>

      <div className="control-group slider-group pressure-group">
        <div className="slider-heading">
          <label className="field-label" htmlFor="pressure">
            Pressão externa
          </label>
          <output className="slider-value" htmlFor="pressure">
            {pressure.toFixed(2)} atm
          </output>
        </div>
        <input
          id="pressure"
          max={MAX_PRESSURE}
          min={MIN_PRESSURE}
          onChange={(event) => onPressureChange(Number(event.target.value))}
          step="0.05"
          style={
            {
              '--range-progress': `${((pressure - MIN_PRESSURE) / (MAX_PRESSURE - MIN_PRESSURE)) * 100}%`,
            } as CSSProperties
          }
          type="range"
          value={pressure}
        />
        <div className="range-labels">
          <span>{MIN_PRESSURE} atm</span>
          <span>{MAX_PRESSURE} atm</span>
        </div>
      </div>

      <div className="control-divider" />

      <div className="control-footer">
        <button
          aria-pressed={isHeating}
          className={`heat-button${isHeating ? ' heat-button--active' : ''}`}
          onClick={onHeatingChange}
          type="button"
        >
          {isHeating ? (
            <svg aria-hidden="true" viewBox="0 0 20 20">
              <path d="M7 5v10m6-10v10" />
            </svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 20 20">
              <path d="m7 4 9 6-9 6z" />
            </svg>
          )}
          {isHeating ? 'Pausar aquecimento' : 'Aquecer'}
        </button>

        <button
          aria-checked={lidClosed}
          className={`lid-toggle${lidClosed ? ' lid-toggle--closed' : ''}`}
          onClick={onLidChange}
          role="switch"
          type="button"
        >
          <span className="lid-copy">
            <span className="field-label">Tampa</span>
            <span className="lid-state">{lidClosed ? 'Fechada' : 'Aberta'}</span>
          </span>
          <span aria-hidden="true" className="switch-track">
            <span className="switch-thumb" />
          </span>
        </button>
      </div>
      <p className="pressure-note">
        A tampa representa o recipiente. Ajuste a pressão externa separadamente.
      </p>
    </section>
  )
}
