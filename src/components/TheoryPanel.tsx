import { useState } from 'react'
import type { Phase, Substance } from '../thermodynamics'
import { formatTemperature } from '../thermodynamics'

type TheoryPanelProps = {
  phase: Phase
  substance: Substance
  temperature: number
  pressure: number
  boilingPoint: number
}

const topics = [
  { id: 'particles', label: '01 · Partículas' },
  { id: 'heat', label: '02 · Calor × temperatura' },
  { id: 'pressure', label: '03 · Pressão' },
  { id: 'transitions', label: '04 · Mudanças de fase' },
] as const

type Topic = (typeof topics)[number]['id']

const explanations: Record<Topic, { title: string; text: string; note: string }> = {
  particles: {
    title: 'O que você não vê, mas está acontecendo',
    text: 'A temperatura está ligada à energia cinética média das partículas. No sólido, elas vibram em posições organizadas; no líquido, permanecem próximas e deslizam umas pelas outras; no gás, ficam muito afastadas e ocupam todo o recipiente. Ao aquecer, a agitação aumenta — não porque as partículas “crescem”, mas porque se movem mais.',
    note: 'A animação representa tendências médias. As velocidades e colisões reais são muito mais rápidas e numerosas do que uma tela consegue mostrar.',
  },
  heat: {
    title: 'Calor não é sinônimo de temperatura',
    text: 'Temperatura mede o estado térmico; calor é energia transferida por causa de uma diferença de temperatura. Durante a fusão ou a ebulição de uma substância pura, a energia fornecida pode separar partículas em vez de elevar a temperatura: é o calor latente. Por isso, uma mudança de fase não é apenas “esquentar mais”.',
    note: 'O botão Aquecer avança a temperatura de forma didática e uniforme. Não calcula a massa, a potência do aquecedor nem o tempo físico de uma amostra real.',
  },
  pressure: {
    title: 'Por que a pressão altera a ebulição?',
    text: 'Um líquido entra em ebulição quando sua pressão de vapor iguala a pressão ao redor. Aumentar a pressão externa exige uma temperatura maior para que bolhas de vapor se formem no líquido; reduzir a pressão facilita a ebulição em temperaturas menores. É por isso que a água ferve a temperaturas diferentes em uma montanha e em uma panela de pressão.',
    note: 'A relação usada é Clausius–Clapeyron com calor de vaporização constante; funciona como aproximação em uma faixa limitada.',
  },
  transitions: {
    title: 'Uma substância, três estados — e fronteiras',
    text: 'Abaixo do ponto de fusão predomina o sólido; entre fusão e ebulição, o líquido; acima da ebulição, o vapor. Em uma amostra real, pureza, composição, nucleação, troca de calor e pressão local podem fazer a transformação acontecer gradualmente. Em pontos de transição, duas fases podem coexistir.',
    note: 'O modelo simplifica a coexistência das fases e trata o ponto de fusão como independente da pressão.',
  },
}

const phaseDescriptions: Record<Phase, string> = {
  solid: 'As partículas ocupam posições ordenadas e vibram sem se afastar da estrutura.',
  liquid: 'As partículas ficam próximas, mas reorganizam suas posições continuamente.',
  gas: 'As partículas se espalham e se movem livremente por todo o recipiente.',
}

export function TheoryPanel({
  phase,
  substance,
  temperature,
  pressure,
  boilingPoint,
}: TheoryPanelProps) {
  const [activeTopic, setActiveTopic] = useState<Topic>('particles')
  const explanation = explanations[activeTopic]
  const note =
    activeTopic === 'pressure'
      ? `Nesta bancada: ${pressure.toFixed(2)} atm → ebulição estimada em ${formatTemperature(boilingPoint)}. ${explanation.note}`
      : activeTopic === 'transitions'
        ? `${substance.name} (${substance.formula}): fusão em ${formatTemperature(substance.meltingPoint)} e ebulição estimada em ${formatTemperature(boilingPoint)} à pressão selecionada. ${explanation.note}`
        : explanation.note

  return (
    <section aria-labelledby="theory-title" className="theory-section">
      <div className="theory-intro">
        <span className="eyebrow"><span className="eyebrow-line" /> CADERNO DE LABORATÓRIO</span>
        <h2 id="theory-title">A teoria por trás do experimento.</h2>
        <p>Sem pular as partes importantes. Abra cada assunto e conecte o que observa às ideias da termodinâmica.</p>
      </div>

      <div className="theory-layout">
        <article className="theory-reader">
          <div aria-label="Tópicos de termodinâmica" className="theory-tabs" role="tablist">
            {topics.map((topic) => (
              <button
                aria-selected={activeTopic === topic.id}
                className={`theory-tab${activeTopic === topic.id ? ' theory-tab--active' : ''}`}
                id={`tab-${topic.id}`}
                key={topic.id}
                onClick={() => setActiveTopic(topic.id)}
                role="tab"
                type="button"
              >
                {topic.label}
              </button>
            ))}
          </div>
          <div
            aria-labelledby={`tab-${activeTopic}`}
            className="theory-copy"
            key={activeTopic}
            role="tabpanel"
          >
            <span className="theory-kicker">NOTA TÉCNICA · TERMODINÂMICA</span>
            <h3>{explanation.title}</h3>
            <p>{explanation.text}</p>
            {activeTopic === 'pressure' && (
              <div className="equation-card">
                <span>EQUAÇÃO USADA NESTA APROXIMAÇÃO</span>
                <code>ln(P₂/P₁) = −ΔHᵥₐₚ/R · (1/T₂ − 1/T₁)</code>
                <small>T sempre em kelvin · ΔHᵥₐₚ em J/mol · P em atm</small>
              </div>
            )}
            <aside className="science-note">
              <span aria-hidden="true">i</span>
              <p>{note}</p>
            </aside>
          </div>
        </article>

        <aside aria-label="Leitura atual do experimento" className="live-reading">
          <div className="reading-header">
            <span className="instrument-led" />
            <span>LEITURA DA BANCADA</span>
            <span className="reading-channel">CH 01</span>
          </div>
          <div className="reading-substance">
            <span className="reading-formula">{substance.formula}</span>
            <span>{substance.name}</span>
          </div>
          <div className="reading-state">
            <span>FASE OBSERVADA</span>
            <strong>{phase === 'gas' ? 'Gasoso' : phase === 'solid' ? 'Sólido' : 'Líquido'}</strong>
            <p>{phaseDescriptions[phase]}</p>
          </div>
          <div className="reading-meters">
            <div>
              <span>TEMPERATURA</span>
              <strong>{formatTemperature(temperature)}</strong>
            </div>
            <div>
              <span>PRESSÃO</span>
              <strong>{pressure.toFixed(2)} atm</strong>
            </div>
          </div>
          <p className="reading-footnote">
            Valores de equilíbrio estimados. A bancada virtual não substitui um experimento real.
          </p>
        </aside>
      </div>
    </section>
  )
}
