import { PlateSheet, PlateTitleRow, PlateLede } from '@/components/PlateSheet'

/** Placeholder frame — recreated 1:1 from the design reference in milestone M5. */
export function GazetteerPlate() {
  return (
    <PlateSheet label="Gazetteer">
      <PlateTitleRow no="APPENDIX" title="Gazetteer of Terms" subject="REF · ALL PLATES" />
      <PlateLede>Plate under survey — charted in milestone M5.</PlateLede>
    </PlateSheet>
  )
}
