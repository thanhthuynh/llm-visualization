import { PlateSheet, PlateTitleRow, PlateLede } from '@/components/PlateSheet'

/** Placeholder frame — recreated 1:1 from the design reference in milestone M2. */
export function PlateIII() {
  return (
    <PlateSheet label="Plate III — RAG">
      <PlateTitleRow no="PLATE III" title="Bearings from Afar" subject="SUBJECT · RETRIEVAL" />
      <PlateLede>Plate under survey — charted in milestone M2.</PlateLede>
    </PlateSheet>
  )
}
