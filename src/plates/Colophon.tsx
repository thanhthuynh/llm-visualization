import { PlateSheet } from '@/components/PlateSheet'

/** Placeholder hero — the colophon is charted in milestone M5. */
export function ColophonPlate() {
  return (
    <PlateSheet label="About" variant="hero" contentClassName="px-[56px] pt-[46px] pb-[44px]">
      <div className="mt-[42px]">
        <div className="font-mono text-[12px] font-medium tracking-[.24em] text-gold">
          CHART NO. 00 — THE COLOPHON
        </div>
        <h1 className="mt-[18px] font-display text-[56px] leading-[1.04] font-semibold tracking-[-.015em] text-ink-display">
          About the <span className="font-normal text-gold italic">Atlas</span>
        </h1>
      </div>
    </PlateSheet>
  )
}
