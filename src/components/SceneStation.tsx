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
        className="relative min-h-screen pt-26 pb-6 grid pl-(--gutter-left) pr-(--gutter-right)"
        style={{
          gridTemplateColumns: 'minmax(var(--stage-min-w), 1fr) var(--col-gap) var(--col-right)',
        }}
      >
        <div
          data-stage-frame
          className="relative w-full min-w-0 h-(--stage-h) bg-surface-card border border-border rounded-card overflow-clip"
        >
          {stage}
        </div>
        <div />
        <div className="relative min-w-0">
          <h2
            id={`${id}-title`}
            tabIndex={-1}
            className="font-display font-bold text-[28px] leading-[34px] tracking-[-1px] m-0 text-text-primary"
          >
            {title}
          </h2>
          <div className="mt-6">
            <AccentRule accent={accent} />
          </div>
          <div className="mt-4.5 w-full max-w-(--surface-max-w)">{surface}</div>
          {deeper !== undefined && (
            <div className="mt-6">
              <DeepToggle
                expanded={expanded}
                onToggle={() => setLocalOverride(!expanded)}
                controlsId={deepPanelId}
                accent={accent}
              />
              {expanded && (
                <div id={deepPanelId} className="mt-4.5 w-full max-w-(--surface-max-w)">
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
              label={`${title}: scene navigation`}
            />
          )}
        </div>
      </div>
    </section>
  )
}
