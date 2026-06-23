import type { SceneConfig } from '@/scenes/scenes.config'

export type RailItem =
  | { kind: 'intro' }
  | { kind: 'group-label'; part: 'part1' | 'part2'; label: string }
  | { kind: 'divider' }
  | { kind: 'station'; scene: SceneConfig; number: number }
  | { kind: 'compare'; scene: SceneConfig }
  | { kind: 'about'; scene: SceneConfig }

export function buildRailModel(scenes: readonly SceneConfig[]): RailItem[] {
  const items: RailItem[] = []

  // Always start with intro
  items.push({ kind: 'intro' })

  // Collect part1 and part2 implemented stations (accent !== null)
  const part1Stations = scenes.filter(
    (s) => s.part === 'part1' && s.implemented && s.accent !== null,
  )
  const part2Stations = scenes.filter(
    (s) => s.part === 'part2' && s.implemented && s.accent !== null,
  )

  // Track numbering across all stations
  let stationNumber = 1

  // Emit part1 group + stations
  if (part1Stations.length > 0) {
    items.push({ kind: 'group-label', part: 'part1', label: 'PART 1' })
    for (const scene of part1Stations) {
      items.push({ kind: 'station', scene, number: stationNumber++ })
    }
  }

  // Emit divider between part1 and part2 only when BOTH have stations
  if (part1Stations.length > 0 && part2Stations.length > 0) {
    items.push({ kind: 'divider' })
  }

  // Emit part2 group + stations
  if (part2Stations.length > 0) {
    items.push({ kind: 'group-label', part: 'part2', label: 'PART 2' })
    for (const scene of part2Stations) {
      items.push({ kind: 'station', scene, number: stationNumber++ })
    }
  }

  // Emit divider before compare/about IF any station group rendered
  const anyStations = part1Stations.length > 0 || part2Stations.length > 0

  // Compare and About scenes
  const compareScene = scenes.find((s) => s.id === 'compare' && s.implemented)
  const aboutScene = scenes.find((s) => s.id === 'about' && s.implemented)

  if ((compareScene !== undefined || aboutScene !== undefined) && anyStations) {
    items.push({ kind: 'divider' })
  }

  if (compareScene !== undefined) {
    items.push({ kind: 'compare', scene: compareScene })
  }

  if (aboutScene !== undefined) {
    items.push({ kind: 'about', scene: aboutScene })
  }

  return items
}
