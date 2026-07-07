import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { useAtlasNav } from '@/app/AtlasNav'
import type { SectionId } from '@/plates/plates.config'

/**
 * A routable element: real anchor (`#/{id}` href works without JS), click
 * intercepted for offset-aware smooth scrolling. The `data-route` attribute
 * carries the shared hover grammar from index.css and mirrors the reference
 * markup.
 */
interface RouteLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: SectionId
  children: ReactNode
}

export function RouteLink({ to, children, onClick, ...rest }: RouteLinkProps) {
  const { go } = useAtlasNav()
  return (
    <a
      data-route={to}
      data-umami-event="cta-route-link"
      data-umami-event-to={to}
      href={`#/${to}`}
      onClick={(event) => {
        onClick?.(event)
        event.preventDefault()
        go(to)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}
