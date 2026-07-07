import { PlateSheet, PlateTitleRow, PlateLede } from '@/components/PlateSheet'

/** Placeholder frame — recreated 1:1 from the design reference in milestone M3. */
export function PlateIVDetail() {
  return (
    <PlateSheet label="Plate IV — In Detail">
      <PlateTitleRow
        no="PLATE IV · DETAIL"
        title="The Passage, Sounded"
        subject="EXAMPLE · 1 PROMPT"
      />
      <PlateLede>Plate under survey — charted in milestone M3.</PlateLede>
    </PlateSheet>
  )
}
