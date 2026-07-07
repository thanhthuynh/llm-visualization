import { PlateSheet, PlateTitleRow, PlateLede } from '@/components/PlateSheet'

/** Placeholder frame — recreated 1:1 from the design reference in milestone M2. */
export function PlateI() {
  return (
    <PlateSheet label="Plate I — Context Window">
      <PlateTitleRow no="PLATE I" title="The Boundaries of Memory" subject="SUBJECT · CONTEXT" />
      <PlateLede>Plate under survey — charted in milestone M2.</PlateLede>
    </PlateSheet>
  )
}
