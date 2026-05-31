import { useState, type ReactNode } from 'react'
import { useDepth } from '@/app/DepthContext'
import { useSceneNav } from '@/app/SceneNavContext'
import { AccentRule } from './AccentRule'
import { DeepPanel } from './DeepPanel'
import { DeepToggle } from './DeepToggle'
import { SceneNav } from './SceneNav'
import type { AccentToken, SceneId } from '@/scenes/scenes.config'

interface SceneStationProps {
  id: SceneId
  title: string
  accent: AccentToken
  stage: ReactNode
  surface: ReactNode
  deeper?: ReactNode
}

export function SceneStation({ id, title, accent, stage, surface, deeper }: SceneStationProps) {
  const { globalDepth } = useDepth()
  const nav = useSceneNav()
  const [localOverride, setLocalOverride] = useState<boolean | null>(null)
  const expanded = deeper !== undefined && (localOverride ?? globalDepth === 'deep')
  const deepPanelId = `${id}-deep`

  const idx = nav ? nav.ids.indexOf(id) : -1
  const canPrev = idx > 0
  const canNext = idx >= 0 && idx < nav!.ids.length - 1

  return (
    <section id={id} aria-labelledby={`${id}-title`}>
      <div
        style={{
          position: 'relative',
          minHeight: '100vh',
          paddingLeft: 'var(--gutter-left)',
          paddingTop: 104,
          paddingRight: 'var(--gutter-right)',
          paddingBottom: 24,
          display: 'grid',
          gridTemplateColumns: 'minmax(var(--stage-min-w), 1fr) var(--col-gap) var(--col-right)',
        }}
      >
        <div
          data-stage-frame
          style={{
            width: '100%',
            minWidth: 0,
            height: 'var(--stage-h)',
            background: 'var(--color-surface-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-card)',
            overflow: 'clip',
            position: 'relative',
          }}
        >
          {stage}
        </div>
        <div />
        <div style={{ position: 'relative', minWidth: 0 }}>
          <h2
            id={`${id}-title`}
            tabIndex={-1}
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 28,
              lineHeight: '34px',
              letterSpacing: '-1px',
              margin: 0,
              color: 'var(--color-text-primary)',
            }}
          >
            {title}
          </h2>
          <div style={{ marginTop: 24 }}>
            <AccentRule accent={accent} />
          </div>
          <div style={{ marginTop: 18, width: '100%', maxWidth: 'var(--surface-max-w)' }}>
            {surface}
          </div>
          {deeper !== undefined && (
            <div style={{ marginTop: 24 }}>
              <DeepToggle
                expanded={expanded}
                onToggle={() => setLocalOverride(!expanded)}
                controlsId={deepPanelId}
                accent={accent}
              />
              {expanded && (
                <div
                  id={deepPanelId}
                  style={{ marginTop: 18, width: '100%', maxWidth: 'var(--surface-max-w)' }}
                >
                  <DeepPanel>{deeper}</DeepPanel>
                </div>
              )}
            </div>
          )}
          {nav && idx >= 0 && (
            <SceneNav
              onPrev={() => canPrev && nav.goTo(nav.ids[idx - 1])}
              onNext={() => canNext && nav.goTo(nav.ids[idx + 1])}
              canPrev={canPrev}
              canNext={canNext}
            />
          )}
        </div>
      </div>
    </section>
  )
}
