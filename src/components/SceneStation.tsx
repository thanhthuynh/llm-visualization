import { useState, type ReactNode } from 'react'
import { useDepth } from '@/app/DepthContext'
import { AccentRule } from './AccentRule'
import { DeepToggle } from './DeepToggle'
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
  const [localOverride, setLocalOverride] = useState<boolean | null>(null)
  const expanded = deeper !== undefined && (localOverride ?? globalDepth === 'deep')
  const deepPanelId = `${id}-deep`

  return (
    <section id={id} aria-labelledby={`${id}-title`}>
      <div
        style={{
          position: 'relative',
          minHeight: '100vh',
          paddingLeft: 104,
          paddingTop: 104,
          paddingRight: 32,
          paddingBottom: 24,
          display: 'grid',
          gridTemplateColumns: '758px 40px 506px',
        }}
      >
        <div
          data-stage-frame
          style={{
            width: 758,
            height: 800,
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
        <div style={{ position: 'relative' }}>
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
          <div style={{ marginTop: 18, maxWidth: 506 }}>{surface}</div>
          {deeper !== undefined && (
            <div style={{ marginTop: 24 }}>
              <DeepToggle
                expanded={expanded}
                onToggle={() => setLocalOverride(!expanded)}
                controlsId={deepPanelId}
              />
              {expanded && (
                <div id={deepPanelId} style={{ marginTop: 18, maxWidth: 506 }}>
                  {deeper}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
