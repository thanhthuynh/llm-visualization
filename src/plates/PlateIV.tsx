import { PlateSheet, PlateTitleRow, PlateLede } from '@/components/PlateSheet'

/** Placeholder frame — recreated 1:1 from the design reference in milestone M3. */
export function PlateIV() {
  return (
    <PlateSheet label="Plate IV — Inference Passage">
      <PlateTitleRow no="PLATE IV" title="The Inference Passage" subject="PROJ. TRANSFORMER" />
      <PlateLede>Plate under survey — charted in milestone M3.</PlateLede>
    </PlateSheet>
  )
}
