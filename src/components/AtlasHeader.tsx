import { useAtlasNav } from '@/app/AtlasNav'
import { RouteLink } from '@/components/RouteLink'
import { getSectionById, type NavKey, type SectionId } from '@/plates/plates.config'

const NAV_ITEMS: ReadonlyArray<{ key: NavKey; label: string; to: SectionId }> = [
  { key: 'charts', label: 'CHARTS', to: 'home' },
  { key: 'glossary', label: 'GLOSSARY', to: 'gazetteer' },
  { key: 'about', label: 'ABOUT', to: 'about' },
]

/**
 * Sticky site header: brand mark (gold circle + rotated square) and the
 * CHARTS · GLOSSARY · ABOUT nav. The active item follows the scroll-spy
 * section's navKey.
 */
export function AtlasHeader() {
  const { active } = useAtlasNav()
  const activeKey = getSectionById(active).navKey

  return (
    <header className="sticky top-0 z-[80] flex h-[60px] items-center justify-between rounded-b-[4px] border border-gold/28 bg-sheet/94 px-[30px] backdrop-blur-[6px]">
      <RouteLink to="home" className="flex items-center gap-[12px]">
        <span
          aria-hidden="true"
          className="flex h-[24px] w-[24px] items-center justify-center rounded-full border-[1.5px] border-gold"
        >
          <span className="h-[8px] w-[8px] rotate-45 bg-gold" />
        </span>
        <span className="font-display text-[19px] font-medium text-ink-bright">The Atlas</span>
      </RouteLink>
      <nav
        aria-label="Primary"
        className="flex gap-[30px] font-mono text-[12px] font-medium tracking-[.18em]"
      >
        {NAV_ITEMS.map(({ key, label, to }) => (
          <RouteLink
            key={key}
            to={to}
            aria-current={activeKey === key ? 'true' : undefined}
            className={activeKey === key ? 'text-gold' : 'text-ink-nav'}
          >
            {label}
          </RouteLink>
        ))}
      </nav>
    </header>
  )
}
