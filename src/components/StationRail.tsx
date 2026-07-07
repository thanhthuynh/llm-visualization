import { Fragment } from 'react'
import { useAtlasNav } from '@/app/AtlasNav'
import { RouteLink } from '@/components/RouteLink'
import { RAIL_GROUP_CAPTIONS, SECTIONS } from '@/plates/plates.config'

/**
 * Fixed left station rail (viewports ≥1100px): HOME plus the plate stations
 * grouped under VOLUME I / VOLUME II / REFERENCE captions. The active station
 * gets a filled gold marker and gold label.
 */
export function StationRail() {
  const { active } = useAtlasNav()

  return (
    <nav
      aria-label="Stations"
      className="fixed top-1/2 left-[28px] z-[90] hidden w-[170px] -translate-y-1/2 flex-col gap-[2px] min-[1100px]:flex"
    >
      {SECTIONS.map((section, index) => {
        const prevGroup = index > 0 ? (SECTIONS[index - 1]?.railGroup ?? null) : null
        const caption =
          section.railGroup !== null && section.railGroup !== prevGroup
            ? RAIL_GROUP_CAPTIONS[section.railGroup]
            : null
        const on = active === section.id
        return (
          <Fragment key={section.id}>
            {caption !== null && (
              <div className="mt-[13px] mb-[5px] font-mono text-[9px] font-medium tracking-[.22em] text-ink-muted/60">
                {caption}
              </div>
            )}
            <RouteLink
              to={section.id}
              aria-current={on ? 'true' : undefined}
              className="flex items-center gap-[10px] px-[2px] py-[4px]"
            >
              <span
                aria-hidden="true"
                className={`h-[7px] w-[7px] shrink-0 rounded-full border-[1.5px] ${
                  on ? 'border-gold bg-gold' : 'border-ink-dim bg-transparent'
                }`}
              />
              <span
                className={`font-mono text-[9.5px] font-medium tracking-[.16em] whitespace-nowrap ${
                  on ? 'text-gold' : 'text-ink-dim'
                }`}
              >
                {section.railLabel}
              </span>
            </RouteLink>
          </Fragment>
        )
      })}
    </nav>
  )
}
