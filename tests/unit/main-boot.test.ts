import { describe, it, expect } from 'vitest'
import { normalizeExplorerPath } from '@/main'

describe('normalizeExplorerPath', () => {
  it('redirects /explorer#decode to /#decode', () => {
    expect(normalizeExplorerPath('/explorer', '#decode')).toEqual({ redirect: true, to: '/#decode' })
  })

  it('does not redirect / with a hash', () => {
    expect(normalizeExplorerPath('/', '#tokenize')).toEqual({ redirect: false, to: '/#tokenize' })
  })

  it('redirects /explorer/foo (no hash) to /', () => {
    expect(normalizeExplorerPath('/explorer/foo', '')).toEqual({ redirect: true, to: '/' })
  })
})
