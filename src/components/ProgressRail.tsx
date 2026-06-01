import type { CSSProperties } from 'react'
import { SCENES, type SceneId } from '@/scenes/scenes.config'
import { accentHex, accentGlow } from '@/utils/accent'

interface ProgressRailProps {
  activeId: SceneId
  onJump: (id: SceneId) => void
}

export function ProgressRail({ activeId, onJump }: ProgressRailProps) {
  const pipeline = SCENES.filter((s) => s.id !== 'about' && s.id !== 'compare')
  return (
    <nav
      aria-label="Scenes"
      className="fixed top-0 left-0 w-[72px] h-screen bg-(--color-bg-base) border-r border-(--color-border) flex flex-col items-center gap-3 py-6 z-10"
    >
      {pipeline.map((scene, idx) => {
        const isActive = scene.id === activeId
        const isImplemented = scene.implemented
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
          'min-w-[44px] min-h-[44px] border border-(--color-border) p-0',
          'font-[family-name:--font-mono] text-sm',
          'bg-(--rail-bg) shadow-[var(--rail-shadow)]',
          isActive
            ? 'w-11 h-11 rounded-(--radius-rail-active) text-white font-bold'
            : 'w-[30px] h-[34px] rounded-(--radius-rail-inactive) text-(--color-text-muted) font-normal',
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
              style={btnStyle}
              className={btnClass}
            >
              {idx + 1}
            </button>
            {isActive && scene.railLabel && (
              <span
                aria-hidden="true"
                style={{ '--rail-label': labelColor } as CSSProperties}
                className="font-[family-name:--font-body] font-semibold text-[9px] tracking-[0.5px] text-(--rail-label) text-center w-[72px] max-w-[72px] leading-3 whitespace-nowrap overflow-hidden text-ellipsis"
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
        className={`min-w-[44px] min-h-[44px] w-4 h-4 mt-4 rounded-full border border-(--color-border) cursor-pointer p-0 ${
          activeId === 'compare'
            ? 'bg-[var(--color-accent-predict,#9D4EDD)]'
            : 'bg-(--color-rail-inactive)'
        }`}
      />
      <button
        type="button"
        onClick={() => onJump('about')}
        aria-label="About"
        {...(activeId === 'about' ? { 'aria-current': 'step' as const } : {})}
        className="min-w-[44px] min-h-[44px] w-[30px] h-[34px] mt-auto rounded-(--radius-rail-inactive) bg-(--color-rail-inactive) border border-(--color-border) text-(--color-text-muted) font-[family-name:--font-mono] text-[13px] cursor-pointer p-0"
      >
        ?
      </button>
    </nav>
  )
}
