import { useLayoutEffect, useState } from 'react'

/**
 * Track an element's content-box width via ResizeObserver.
 *
 * Returns a `[ref, width]` pair. `ref` is a callback ref — assign it to the
 * element you want to measure (`<div ref={ref} />`). Using a callback ref means
 * measurement re-attaches correctly when the element mounts later (e.g. a
 * conditionally-rendered "Go deeper" panel).
 *
 * The observer reads the entry's content-box `inlineSize` (reflow-free and
 * padding-independent); the initial synchronous read before the observer fires
 * uses `clientWidth`. `width` is `0` until measured and in environments without
 * ResizeObserver (jsdom), so callers should fall back to a default when it is `0`.
 */
export function useElementWidth(): [(node: HTMLElement | null) => void, number] {
  const [node, setNode] = useState<HTMLElement | null>(null)
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    if (!node || typeof ResizeObserver === 'undefined') return
    // Initial synchronous read before the observer fires.
    setWidth(node.clientWidth)
    const ro = new ResizeObserver((entries) => {
      // Content-box inline size from the entry — avoids forcing a reflow with a
      // clientWidth read, and is the true content-box width even with padding.
      const inline = entries[0]?.contentBoxSize?.[0]?.inlineSize
      setWidth(inline ?? node.clientWidth)
    })
    ro.observe(node)
    return () => ro.disconnect()
  }, [node])

  return [setNode, width]
}
