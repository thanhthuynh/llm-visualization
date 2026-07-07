import type { ReactNode } from 'react'
import type { SectionId } from '@/plates/plates.config'

/**
 * Section wrapper for one Atlas station: hash-anchor id, 96px scroll margin,
 * and a unique aria-label so every landmark passes the axe landmark-unique
 * rule (per-scene unique landmark labels are a repo invariant).
 */
interface AtlasSectionProps {
  id: SectionId
  title: string
  children: ReactNode
}

export function AtlasSection({ id, title, children }: AtlasSectionProps) {
  return (
    <section id={id} aria-label={title} className="scroll-mt-[96px]">
      {children}
    </section>
  )
}
