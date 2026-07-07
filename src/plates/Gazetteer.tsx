import { PlateSheet, PlateTitleRow, PlateLede, PlateFooter } from '@/components/PlateSheet'
import { RouteLink } from '@/components/RouteLink'
import { GAZETTEER_ENTRIES } from '@/plates/gazetteer.data'

/**
 * Appendix — Gazetteer of Terms. 17 alphabetized entries in a 3-column grid,
 * each cross-linked to its plate. Layout and copy transcribed from the design
 * reference (`design_handoff_atlas_website/The Atlas - Website.dc.html`,
 * `#gazetteer`).
 */
export function GazetteerPlate() {
  return (
    <PlateSheet label="Gazetteer">
      <PlateTitleRow no="APPENDIX" title="Gazetteer of Terms" subject="REF · ALL PLATES" />
      <PlateLede className="mt-[18px] mb-[26px] max-w-[640px]">
        Every place named on these charts, listed in order, with the plate on which it is found.
      </PlateLede>
      <div className="grid flex-1 auto-rows-min grid-cols-[repeat(3,1fr)] content-start gap-x-[44px] gap-y-[22px]">
        {GAZETTEER_ENTRIES.map((entry) => (
          <RouteLink key={entry.term} to={entry.to} className="block">
            <div className="flex items-baseline justify-between border-b border-ink-nav/18 pb-[4px]">
              <span className="font-display text-[18px] font-medium text-ink-bright">
                {entry.term}
              </span>
              <span className="font-mono text-[10px] text-gold">{entry.plateRef}</span>
            </div>
            <p className="mt-[7px] font-body text-[12px] leading-[1.45] text-ink-nav">
              {entry.definition}
            </p>
          </RouteLink>
        ))}
      </div>
      <PlateFooter
        left="THE ATLAS · COMPLETE IN VII PLATES & APPENDIX"
        right={`${GAZETTEER_ENTRIES.length} ENTRIES`}
      />
    </PlateSheet>
  )
}
