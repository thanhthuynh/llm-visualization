import { EyebrowLabel } from '@/components/EyebrowLabel'
import type { SceneConfig } from '@/scenes/scenes.config'
import { accentHex } from '@/utils/accent'

interface TopBarProps {
  scene: SceneConfig
}

export function TopBar({ scene }: TopBarProps) {
  const isPrologue = scene.id === 'intro'
  const eyebrowLabel = scene.railLabel ?? scene.title
  // Render content only when it differs from the eyebrow to avoid announcing the
  // title twice (e.g. About has railLabel:null so eyebrow already shows the title).
  const pillContent = scene.prompt !== '' ? scene.prompt : scene.railLabel ? scene.title : null
  const accentColor = scene.accent ? accentHex(scene.accent) : undefined

  return (
    <header className="fixed top-0 right-0 left-[72px] h-18 bg-bg-base border-b border-border flex items-center justify-between px-8 z-[9]">
      <span className="font-display font-bold text-xl tracking-[-0.2px]">Inside an LLM</span>
      {!isPrologue && (
        <div
          data-testid="topbar-pill"
          className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-pill bg-surface-card border border-border"
        >
          {accentColor ? (
            <EyebrowLabel accent={accentColor}>{eyebrowLabel}</EyebrowLabel>
          ) : (
            <EyebrowLabel>{eyebrowLabel}</EyebrowLabel>
          )}
          {pillContent !== null && <span className="font-mono text-[13px]">{pillContent}</span>}
        </div>
      )}
    </header>
  )
}
