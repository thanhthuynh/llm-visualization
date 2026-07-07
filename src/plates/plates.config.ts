/**
 * The Atlas — single source of truth for section order and metadata.
 *
 * Every station of the site is a "section" here: the home chart, the seven
 * numbered plates (plus Plate IV·Detail), the gazetteer, and the colophon.
 * Section ids double as the hash slugs (`#/{id}`); the station rail, header
 * nav, scroll-spy, and keyboard paging all derive from this list.
 */

export const SECTION_IDS = [
  'home',
  'plate-i',
  'plate-ii',
  'plate-iii',
  'plate-iv',
  'plate-iv-detail',
  'plate-v',
  'plate-vi',
  'plate-vii',
  'gazetteer',
  'about',
] as const

export type SectionId = (typeof SECTION_IDS)[number]

/** Header nav groups: CHARTS routes home, GLOSSARY → gazetteer, ABOUT → about. */
export type NavKey = 'charts' | 'glossary' | 'about'

/** Station-rail groups; captions render between groups. `null` = ungrouped (HOME). */
export type RailGroup = 'volume-i' | 'volume-ii' | 'reference' | null

export interface SectionConfig {
  id: SectionId
  /** Human title, used for aria landmarks and the visual-diff screenshot names. */
  title: string
  /** Uppercase mono label on the station rail. */
  railLabel: string
  railGroup: RailGroup
  /** Which header nav item lights up while this section is active. */
  navKey: NavKey
}

export const SECTIONS: ReadonlyArray<SectionConfig> = [
  { id: 'home', title: 'Home', railLabel: 'HOME', railGroup: null, navKey: 'charts' },
  {
    id: 'plate-i',
    title: 'Plate I — The Boundaries of Memory',
    railLabel: 'I · MEMORY',
    railGroup: 'volume-i',
    navKey: 'charts',
  },
  {
    id: 'plate-ii',
    title: 'Plate II — Standing Orders',
    railLabel: 'II · ORDERS',
    railGroup: 'volume-i',
    navKey: 'charts',
  },
  {
    id: 'plate-iii',
    title: 'Plate III — Bearings from Afar',
    railLabel: 'III · BEARINGS',
    railGroup: 'volume-i',
    navKey: 'charts',
  },
  {
    id: 'plate-iv',
    title: 'Plate IV — The Inference Passage',
    railLabel: 'IV · PASSAGE',
    railGroup: 'volume-i',
    navKey: 'charts',
  },
  {
    id: 'plate-iv-detail',
    title: 'Plate IV · Detail — The Passage, Sounded',
    railLabel: 'IV·D · SOUNDED',
    railGroup: 'volume-i',
    navKey: 'charts',
  },
  {
    id: 'plate-v',
    title: 'Plate V — The Self-Directed Survey',
    railLabel: 'V · AGENTS',
    railGroup: 'volume-ii',
    navKey: 'charts',
  },
  {
    id: 'plate-vi',
    title: 'Plate VI — The Scouting Party',
    railLabel: 'VI · SUBAGENTS',
    railGroup: 'volume-ii',
    navKey: 'charts',
  },
  {
    id: 'plate-vii',
    title: 'Plate VII — The Circuit',
    railLabel: 'VII · LOOPS',
    railGroup: 'volume-ii',
    navKey: 'charts',
  },
  {
    id: 'gazetteer',
    title: 'Gazetteer of Terms',
    railLabel: 'GAZETTEER',
    railGroup: 'reference',
    navKey: 'glossary',
  },
  {
    id: 'about',
    title: 'About the Atlas',
    railLabel: 'COLOPHON',
    railGroup: 'reference',
    navKey: 'about',
  },
]

/** Rail group captions, rendered above the first item of each group. */
export const RAIL_GROUP_CAPTIONS: Readonly<Record<Exclude<RailGroup, null>, string>> = {
  'volume-i': 'VOLUME I',
  'volume-ii': 'VOLUME II',
  reference: 'REFERENCE',
}

/**
 * Volume dividers that sit in the scroll column *before* the given section.
 */
export const VOLUME_DIVIDERS: ReadonlyArray<{ before: SectionId; label: string }> = [
  { before: 'plate-i', label: 'VOLUME I · FOUNDATIONS' },
  { before: 'plate-v', label: 'VOLUME II · AGENTS' },
  { before: 'gazetteer', label: 'APPENDIX · REFERENCE' },
]

export function isSectionId(value: string): value is SectionId {
  return (SECTION_IDS as readonly string[]).includes(value)
}

export function getSectionById(id: SectionId): SectionConfig {
  const section = SECTIONS.find((s) => s.id === id)
  if (!section) throw new Error(`Unknown section id: ${id}`)
  return section
}
