import { PlateSheet } from '@/components/PlateSheet'

/** Placeholder hero — the clickable route map is charted in milestone M5. */
export function HomePlate() {
  return (
    <PlateSheet label="Home" variant="hero">
      <div className="font-mono text-[12px] font-medium tracking-[.24em] text-gold">
        CHART NO. 01 — THE TERRITORY · VOL. I–II
      </div>
      <h1 className="mt-[13px] font-display text-[48px] leading-none font-semibold tracking-[-.015em] text-ink-display">
        An atlas of <span className="font-normal text-gold italic">language models</span>
      </h1>
    </PlateSheet>
  )
}
