import type { AnalyticsEvent } from './events'

declare global {
  interface Window {
    umami?: {
      track: (event: string, props?: Record<string, unknown>) => void
    }
  }
}

export function track(event: AnalyticsEvent, props?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  window.umami?.track(event, props)
}
