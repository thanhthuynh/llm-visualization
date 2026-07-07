import { PlateSheet, PlateTitleRow, PlateLede } from '@/components/PlateSheet'

/** Placeholder frame — recreated 1:1 from the design reference in milestone M2. */
export function PlateII() {
  return (
    <PlateSheet label="Plate II — System Prompt">
      <PlateTitleRow no="PLATE II" title="Standing Orders" subject="SUBJECT · SYSTEM" />
      <PlateLede>Plate under survey — charted in milestone M2.</PlateLede>
    </PlateSheet>
  )
}
