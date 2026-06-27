import { useLayoutEffect, useState } from 'react'

/**
 * Track an element's content-box width via ResizeObserver.
 *
 * Returns a `[ref, width]` pair. `ref` is a callback ref — assign it to the
 * element you want to measure (`<div ref={ref} />`). Using a callback ref means
 * measurement re-attaches correctly when the element mounts later (e.g. a
 * conditionally-rendered "Go deeper" panel).
 *
 * `width` is `0` until measured and in environments without ResizeObserver
 * (jsdom), so callers should fall back to a default when it is `0`.
 */
export function useElementWidth(): [(node: HTMLElement | null) => void, number] {
  const [node, setNode] = useState<HTMLElement | null>(null)
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    if (!node || typeof ResizeObserver === 'undefined') return
    const measure = () => setWidth(node.clientWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(node)
    return () => ro.disconnect()
  }, [node])

  return [setNode, width]
}
