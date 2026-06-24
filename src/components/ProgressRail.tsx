import type { CSSProperties } from 'react'
import { SCENES, type SceneId } from '@/scenes/scenes.config'
import { accentHex, accentGlow } from '@/utils/accent'
import { buildRailModel } from '@/components/railModel'
import { ActDivider } from '@/components/ActDivider'

interface ProgressRailProps {
  activeId: SceneId
  onJump: (id: SceneId) => void
}

const RAIL_MODEL = buildRailModel(SCENES)

export function ProgressRail({ activeId, onJump }: ProgressRailProps) {
  return (
    <nav
      aria-label="Scenes"
      className="fixed top-0 left-0 w-18 h-screen bg-bg-base border-r border-border flex flex-col items-center z-10"
    >
      <div className="flex flex-col items-center gap-2 py-4 w-full overflow-y-auto min-h-0 flex-1 scrollbar-none">
        {RAIL_MODEL.map((item, idx) => {
          if (item.kind === 'intro') {
            const isActive = activeId === 'intro'
            return (
              <button
                key="intro"
                type="button"
                onClick={() => onJump('intro')}
                aria-label="Intro"
                {...(isActive ? { 'aria-current': 'step' as const } : {})}
                data-umami-event="cta-rail-jump"
                data-umami-event-scene="intro"
                className={[
                  'min-w-11 min-h-11 border border-border p-0',
                  'font-mono text-[9px] uppercase tracking-widest',
                  isActive
                    ? 'w-11 h-11 rounded-rail-active bg-surface-card text-text-primary font-bold'
                    : 'w-7.5 h-8.5 rounded-rail-inactive bg-rail-inactive text-text-muted font-normal',
                  'cursor-pointer',
                ].join(' ')}
              >
                ·
              </button>
            )
          }

          if (item.kind === 'group-label') {
            return (
              <span
                key={`group-${item.part}`}
                aria-hidden="true"
                className="font-mono text-[8px] uppercase tracking-widest text-text-muted text-center leading-3"
              >
                {item.label}
              </span>
            )
          }

          if (item.kind === 'divider') {
            return <ActDivider key={`divider-${idx}`} />
          }

          if (item.kind === 'station') {
            const { scene, number } = item
            const isActive = scene.id === activeId
            const accentBg =
              isActive && scene.accent ? accentHex(scene.accent) : 'var(--color-rail-inactive)'
            const accentShadow =
              isActive && scene.accent ? accentGlow(scene.accent, 'rail') : 'none'
            const labelColor =
              isActive && scene.accent ? accentHex(scene.accent) : 'var(--color-text-muted)'
            const btnStyle = {
              '--rail-bg': accentBg,
              '--rail-shadow': accentShadow,
            } as CSSProperties
            const btnClass = [
              'min-w-11 min-h-11 border border-border p-0',
              'font-mono text-sm',
              'bg-(--rail-bg) shadow-[var(--rail-shadow)]',
              isActive
                ? 'w-11 h-11 rounded-rail-active text-white font-bold'
                : 'w-7.5 h-8.5 rounded-rail-inactive text-text-muted font-normal',
              'opacity-100 cursor-pointer',
            ].join(' ')
            return (
              <div key={scene.id} className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  onClick={() => onJump(scene.id)}
                  aria-label={`${number} ${scene.railLabel ?? scene.title}`}
                  {...(isActive ? { 'aria-current': 'step' as const } : {})}
                  data-umami-event="cta-rail-jump"
                  data-umami-event-scene={scene.id}
                  style={btnStyle}
                  className={btnClass}
                >
                  {number}
                </button>
                {isActive && scene.railLabel && (
                  <span
                    aria-hidden="true"
                    style={{ '--rail-label': labelColor } as CSSProperties}
                    className="font-body font-semibold text-[9px] tracking-[0.5px] text-(--rail-label) text-center w-18 max-w-18 leading-3 whitespace-nowrap overflow-hidden text-ellipsis"
                  >
                    {scene.railLabel.charAt(0) + scene.railLabel.slice(1).toLowerCase()}
                  </span>
                )}
              </div>
            )
          }

          if (item.kind === 'compare') {
            const { scene } = item
            const isActive = activeId === 'compare'
            const activeBg = isActive && scene.accent ? accentHex(scene.accent) : undefined
            const activeShadow =
              isActive && scene.accent ? accentGlow(scene.accent, 'rail') : undefined
            return (
              <button
                key="compare"
                type="button"
                onClick={() => onJump('compare')}
                aria-label="Compare"
                {...(isActive ? { 'aria-current': 'step' as const } : {})}
                data-umami-event="cta-rail-jump"
                data-umami-event-scene="compare"
                style={
                  isActive && activeBg && activeShadow
                    ? ({ background: activeBg, '--rail-shadow': activeShadow } as CSSProperties)
                    : undefined
                }
                className={`min-w-11 min-h-11 w-4 h-4 mt-4 rounded-full border border-border cursor-pointer p-0 ${
                  isActive ? 'shadow-[var(--rail-shadow)]' : 'bg-rail-inactive'
                }`}
              />
            )
          }

          if (item.kind === 'about') {
            const isActive = activeId === 'about'
            return (
              <button
                key="about"
                type="button"
                onClick={() => onJump('about')}
                aria-label="About"
                {...(isActive ? { 'aria-current': 'step' as const } : {})}
                data-umami-event="cta-rail-jump"
                data-umami-event-scene="about"
                className="min-w-11 min-h-11 w-7.5 h-8.5 rounded-rail-inactive bg-rail-inactive border border-border text-text-muted font-mono text-[13px] cursor-pointer p-0"
              >
                ?
              </button>
            )
          }

          return null
        })}
      </div>
    </nav>
  )
}
