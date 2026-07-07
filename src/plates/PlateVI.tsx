import { PlateSheet, PlateTitleRow, PlateLede } from '@/components/PlateSheet'

/** Placeholder frame — recreated 1:1 from the design reference in milestone M4. */
export function PlateVI() {
  return (
    <PlateSheet label="Plate VI — Subagents">
      <PlateTitleRow no="PLATE VI" title="The Scouting Party" subject="SUBJECT · SUBAGENTS" />
      <PlateLede>Plate under survey — charted in milestone M4.</PlateLede>
    </PlateSheet>
  )
}
