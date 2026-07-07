import { PlateSheet } from '@/components/PlateSheet'
import { RouteLink } from '@/components/RouteLink'
import type { SectionId } from '@/plates/plates.config'

/**
 * Home hero — "An atlas of language models" over the clickable route map.
 * Every coordinate below (marker/label %-positions, SVG polyline points) is a
 * constant transcribed from the design reference
 * (the design handoff (kept in maintainer notes), `#home`).
 */

interface MapStation {
  to: SectionId
  plate: string
  title: string
  /** The Pipeline and Agents titles render gold in the reference. */
  goldTitle?: boolean
  /** ring = plate station · gateway = rotated square (Plate IV) · bullseye = three rings (Plate V) */
  marker: 'ring' | 'gateway' | 'bullseye'
  markerLeft: string
  markerTop: string
  labelLeft: string
  labelTop: string
}

const MAP_STATIONS: ReadonlyArray<MapStation> = [
  {
    to: 'plate-i',
    plate: 'PLATE I',
    title: 'Context Window',
    marker: 'ring',
    markerLeft: '10.110%',
    markerTop: '23.333%',
    labelLeft: '13.051%',
    labelTop: '14.333%',
  },
  {
    to: 'plate-ii',
    plate: 'PLATE II',
    title: 'System Prompt',
    marker: 'ring',
    markerLeft: '10.110%',
    markerTop: '83.333%',
    labelLeft: '13.051%',
    labelTop: '74.333%',
  },
  {
    to: 'plate-iii',
    plate: 'PLATE III',
    title: 'Retrieval · RAG',
    marker: 'ring',
    markerLeft: '27.574%',
    markerTop: '53.333%',
    labelLeft: '22.978%',
    labelTop: '41.667%',
  },
  {
    to: 'plate-iv',
    plate: 'PLATE IV',
    title: 'The Pipeline',
    goldTitle: true,
    marker: 'gateway',
    markerLeft: '45.496%',
    markerTop: '53.333%',
    labelLeft: '41.544%',
    labelTop: '58.667%',
  },
  {
    to: 'plate-v',
    plate: 'PLATE V',
    title: 'Agents',
    goldTitle: true,
    marker: 'bullseye',
    markerLeft: '68.474%',
    markerTop: '27.500%',
    labelLeft: '65.441%',
    labelTop: '16.333%',
  },
  {
    to: 'plate-vi',
    plate: 'PLATE VI',
    title: 'Subagents',
    marker: 'ring',
    markerLeft: '90.993%',
    markerTop: '47.500%',
    labelLeft: '81.250%',
    labelTop: '37.000%',
  },
  {
    to: 'plate-vii',
    plate: 'PLATE VII',
    title: 'Loops',
    marker: 'ring',
    markerLeft: '76.746%',
    markerTop: '83.333%',
    labelLeft: '70.956%',
    labelTop: '72.000%',
  },
]

/** Station marker glyph, centered on its charted coordinate. */
function StationMarker({ station }: { station: MapStation }) {
  // %-positions are transcribed constants from the reference; inline style is
  // the documented escape hatch for runtime/data-driven coordinates.
  const at = { left: station.markerLeft, top: station.markerTop }
  if (station.marker === 'gateway') {
    return (
      <div
        aria-hidden="true"
        className="absolute z-[3] h-[16px] w-[16px] -translate-x-1/2 -translate-y-1/2 rotate-45 border-2 border-gold bg-sheet"
        style={at}
      />
    )
  }
  if (station.marker === 'bullseye') {
    return (
      <>
        <div
          aria-hidden="true"
          className="absolute z-[2] h-[26px] w-[26px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/40"
          style={at}
        />
        <div
          aria-hidden="true"
          className="absolute z-[3] h-[14px] w-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold bg-sheet"
          style={at}
        />
        <div
          aria-hidden="true"
          className="absolute z-[4] h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold"
          style={at}
        />
      </>
    )
  }
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute z-[2] h-[24px] w-[24px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/32"
        style={at}
      />
      <div
        aria-hidden="true"
        className="absolute z-[3] h-[12px] w-[12px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold bg-sheet"
        style={at}
      />
    </>
  )
}

/** The SVG route network: 1088×600 canvas, dashed gold passages + meridian. */
function RouteNetwork() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1088 600"
      preserveAspectRatio="none"
      className="absolute inset-0 z-[1] h-full w-full"
    >
      <line
        x1="600"
        y1="44"
        x2="600"
        y2="560"
        stroke="#5d738f"
        strokeWidth="1"
        strokeDasharray="1 9"
        opacity="0.45"
      />
      <polyline
        points="110,140 495,320"
        fill="none"
        stroke="#d8a657"
        strokeWidth="1.4"
        strokeDasharray="2 8"
        opacity="0.55"
      />
      <polyline
        points="110,500 495,320"
        fill="none"
        stroke="#d8a657"
        strokeWidth="1.4"
        strokeDasharray="2 8"
        opacity="0.55"
      />
      <polyline
        points="300,320 495,320"
        fill="none"
        stroke="#d8a657"
        strokeWidth="1.4"
        strokeDasharray="2 8"
        opacity="0.55"
      />
      <polyline
        points="495,320 745,165"
        fill="none"
        stroke="#d8a657"
        strokeWidth="1.8"
        strokeDasharray="1 6"
        opacity="0.95"
      />
      <polyline
        points="745,165 990,285"
        fill="none"
        stroke="#d8a657"
        strokeWidth="1.4"
        strokeDasharray="2 8"
        opacity="0.55"
      />
      <polyline
        points="745,165 835,500"
        fill="none"
        stroke="#d8a657"
        strokeWidth="1.4"
        strokeDasharray="2 8"
        opacity="0.55"
      />
    </svg>
  )
}

export function HomePlate() {
  return (
    <PlateSheet label="Home" variant="hero">
      <div className="mb-[18px] flex-none">
        <div className="mb-[13px] font-mono text-[12px] font-medium tracking-[.24em] text-gold">
          CHART NO. 01 — THE TERRITORY · VOL. I–II
        </div>
        <div className="flex items-end justify-between">
          <h1 className="font-display text-[48px] leading-none font-semibold tracking-[-.015em] text-ink-display">
            An atlas of <span className="font-normal text-gold italic">language models</span>
          </h1>
          <div className="text-right font-mono text-[11px] leading-[1.8] font-medium tracking-[.12em] text-ink-muted">
            VII&nbsp;PLATES
            <br />
            II&nbsp;VOLUMES
            <br />
            SCALE&nbsp;1:24,000
          </div>
        </div>
        <p className="mt-[14px] max-w-[700px] font-body text-[15px] leading-[1.5] text-ink-body">
          From the boundaries of a context window to the autonomous loops of an agent — the whole
          territory of a modern LLM, charted as one map.
        </p>
      </div>

      <div className="relative mt-[4px] min-h-0 flex-1 overflow-hidden rounded-[2px] border border-ink-nav/22 bg-linear-to-b from-panel/50 to-sheet/15">
        <RouteNetwork />

        <div className="absolute top-[16px] left-[22px] z-[5]">
          <div className="font-mono text-[11px] font-medium tracking-[.18em] text-gold">
            FOUNDATIONS
          </div>
          <div className="mt-[3px] font-mono text-[9px] tracking-[.16em] text-ink-muted">
            VOLUME&nbsp;I
          </div>
        </div>
        <div className="absolute top-[16px] left-[58%] z-[5]">
          <div className="font-mono text-[11px] font-medium tracking-[.18em] text-gold">AGENTS</div>
          <div className="mt-[3px] font-mono text-[9px] tracking-[.16em] text-ink-muted">
            VOLUME&nbsp;II
          </div>
        </div>
        <div className="absolute top-[14px] right-[16px] z-[5] font-mono text-[10px] tracking-[.12em] text-ink-dim">
          N↑
        </div>

        {MAP_STATIONS.map((station) => (
          <StationMarker key={`${station.to}-marker`} station={station} />
        ))}

        {MAP_STATIONS.map((station) => (
          <RouteLink
            key={station.to}
            to={station.to}
            className="absolute z-[5] block w-[200px]"
            // %-positions are transcribed constants from the reference.
            style={{ left: station.labelLeft, top: station.labelTop }}
          >
            <div className="mb-[4px] font-mono text-[10px] font-medium tracking-[.12em] text-gold">
              {station.plate}
            </div>
            <div
              className={`font-display text-[19px] font-medium ${
                station.goldTitle ? 'text-gold' : 'text-ink-bright'
              }`}
            >
              {station.title}
            </div>
          </RouteLink>
        ))}
      </div>

      <div className="mt-[14px] flex flex-none justify-between font-mono text-[11px] tracking-[.08em] text-ink-faint">
        <span>◦ PLATE STATION</span>
        <span>◇ GATEWAY</span>
        <span>— — ROUTE</span>
        <span>▸ FOUNDATIONS LEAD TO AGENTS</span>
        <span>SOUNDINGS IN TOKENS</span>
      </div>
    </PlateSheet>
  )
}
