import type { CSSProperties } from 'react'
import { SCENES, type SceneId } from '@/scenes/scenes.config'
import { accentHex, accentGlow } from '@/utils/accent'

interface ProgressRailProps {
  activeId: SceneId
  onJump: (id: SceneId) => void
}

export function ProgressRail({ activeId, onJump }: ProgressRailProps) {
  const pipeline = SCENES.filter((s) => s.implemented && s.id !== 'about' && s.id !== 'compare')
  return (
    <nav
      aria-label="Scenes"
      className="fixed top-0 left-0 w-18 h-screen bg-bg-base border-r border-border flex flex-col items-center gap-3 py-6 z-10"
    >
      {pipeline.map((scene, idx) => {
        const isActive = scene.id === activeId
        const isImplemented = scene.implemented
        const accentBg =
          isActive && scene.accent ? accentHex(scene.accent) : 'var(--color-rail-inactive)'
        const accentShadow = isActive && scene.accent ? accentGlow(scene.accent, 'rail') : 'none'
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
          isImplemented ? 'opacity-100 cursor-pointer' : 'opacity-40 cursor-not-allowed',
        ].join(' ')
        return (
          <div key={scene.id} className="flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={isImplemented ? () => onJump(scene.id) : undefined}
              disabled={!isImplemented}
              aria-label={`${idx + 1} ${scene.railLabel ?? scene.title} ${scene.title}`}
              {...(isActive ? { 'aria-current': 'step' as const } : {})}
              data-umami-event="cta-rail-jump"
              data-umami-event-scene={scene.id}
              style={btnStyle}
              className={btnClass}
            >
              {idx + 1}
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
      })}
      <button
        type="button"
        onClick={() => onJump('compare')}
        aria-label="Compare"
        {...(activeId === 'compare' ? { 'aria-current': 'step' as const } : {})}
        data-umami-event="cta-rail-jump"
        data-umami-event-scene="compare"
        className={`min-w-11 min-h-11 w-4 h-4 mt-4 rounded-full border border-border cursor-pointer p-0 ${
          activeId === 'compare' ? 'bg-[var(--color-accent-predict,#9D4EDD)]' : 'bg-rail-inactive'
        }`}
      />
      <button
        type="button"
        onClick={() => onJump('about')}
        aria-label="About"
        {...(activeId === 'about' ? { 'aria-current': 'step' as const } : {})}
        data-umami-event="cta-rail-jump"
        data-umami-event-scene="about"
        className="min-w-11 min-h-11 w-7.5 h-8.5 mt-auto rounded-rail-inactive bg-rail-inactive border border-border text-text-muted font-mono text-[13px] cursor-pointer p-0"
      >
        ?
      </button>
    </nav>
  )
}
