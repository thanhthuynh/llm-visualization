import { SCENES, type SceneId } from '@/scenes/scenes.config'
import { accentHex, accentGlow } from '@/utils/accent'

interface ProgressRailProps {
  activeId: SceneId
  onJump: (id: SceneId) => void
}

export function ProgressRail({ activeId, onJump }: ProgressRailProps) {
  const pipeline = SCENES.filter((s) => s.id !== 'about')
  return (
    <nav
      aria-label="Scenes"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 72,
        height: '100vh',
        background: 'var(--color-bg-base)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        padding: '24px 0',
        zIndex: 10,
      }}
    >
      {pipeline.map((scene, idx) => {
        const isActive = scene.id === activeId
        const isImplemented = scene.implemented
        const accentStyle =
          isActive && scene.accent
            ? { background: accentHex(scene.accent), boxShadow: accentGlow(scene.accent, 'rail') }
            : { background: 'var(--color-rail-inactive)', boxShadow: 'none' as const }
        return (
          <button
            key={scene.id}
            type="button"
            onClick={isImplemented ? () => onJump(scene.id) : undefined}
            disabled={!isImplemented}
            aria-label={`${idx + 1} ${scene.railLabel ?? scene.title} ${scene.title}`}
            {...(isActive ? { 'aria-current': 'step' as const } : {})}
            style={{
              minWidth: 44,
              minHeight: 44,
              width: isActive ? 44 : 30,
              height: isActive ? 44 : 34,
              borderRadius: isActive ? 'var(--radius-rail-active)' : 'var(--radius-rail-inactive)',
              border: '1px solid var(--color-border)',
              color: isActive ? '#fff' : 'var(--color-text-muted)',
              fontFamily: 'var(--font-mono)',
              fontWeight: isActive ? 700 : 400,
              fontSize: 14,
              cursor: isImplemented ? 'pointer' : 'not-allowed',
              padding: 0,
              opacity: isImplemented ? 1 : 0.4,
              ...accentStyle,
            }}
          >
            {idx + 1}
          </button>
        )
      })}
      <button
        type="button"
        onClick={() => onJump('about')}
        aria-label="Compare"
        disabled
        style={{
          minWidth: 44,
          minHeight: 44,
          width: 16,
          height: 16,
          marginTop: 16,
          borderRadius: '50%',
          background: 'var(--color-rail-inactive)',
          border: '1px solid var(--color-border)',
          cursor: 'not-allowed',
          padding: 0,
        }}
      />
      <button
        type="button"
        onClick={() => onJump('about')}
        aria-label="About"
        {...(activeId === 'about' ? { 'aria-current': 'step' as const } : {})}
        style={{
          minWidth: 44,
          minHeight: 44,
          width: 30,
          height: 34,
          marginTop: 'auto',
          borderRadius: 'var(--radius-rail-inactive)',
          background: 'var(--color-rail-inactive)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          cursor: 'pointer',
          padding: 0,
        }}
      >
        ?
      </button>
    </nav>
  )
}
