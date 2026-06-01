import { Hero } from './Hero'
import { SceneCardGrid } from './SceneCardGrid'
import { ProvenanceBlock } from './ProvenanceBlock'
import { SurfaceDeepPreview } from './SurfaceDeepPreview'
import { TechStack } from './TechStack'
import { LandingFooter } from './LandingFooter'

export function Landing() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <main id="main-content" className="bg-bg-base">
        <Hero />
        <SceneCardGrid />
        <ProvenanceBlock />
        <SurfaceDeepPreview />
        <TechStack />
      </main>
      <LandingFooter />
    </>
  )
}
