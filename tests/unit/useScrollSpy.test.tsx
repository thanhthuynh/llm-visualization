import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import { useScrollSpy } from '@/app/useScrollSpy'

type Entry = {
  target: Element
  isIntersecting: boolean
  intersectionRatio: number
}

type IOCallback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void
type IOInit = {
  root?: Element | Document | null
  rootMargin?: string
  threshold?: number | number[]
}

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = []
  callback: IOCallback
  options: IOInit
  observed: Element[] = []

  constructor(cb: IOCallback, opts?: IOInit) {
    this.callback = cb
    this.options = opts ?? {}
    MockIntersectionObserver.instances.push(this)
  }
  observe(el: Element): void {
    this.observed.push(el)
  }
  unobserve(el: Element): void {
    this.observed = this.observed.filter((e) => e !== el)
  }
  disconnect(): void {
    this.observed = []
  }
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
  fire(entries: Entry[]): void {
    this.callback(
      entries as unknown as IntersectionObserverEntry[],
      this as unknown as IntersectionObserver,
    )
  }
}

const originalIO = window.IntersectionObserver

beforeEach(() => {
  MockIntersectionObserver.instances = []
  ;(
    window as unknown as { IntersectionObserver: typeof MockIntersectionObserver }
  ).IntersectionObserver = MockIntersectionObserver
})

afterEach(() => {
  ;(
    window as unknown as { IntersectionObserver: typeof IntersectionObserver }
  ).IntersectionObserver = originalIO
  document.body.innerHTML = ''
})

function setupSections(ids: string[]): void {
  for (const id of ids) {
    const el = document.createElement('section')
    el.id = id
    document.body.appendChild(el)
  }
}

function Probe({
  ids,
  onActiveChange,
  rootSelector,
}: {
  ids: string[]
  onActiveChange: (id: string) => void
  rootSelector?: string
}) {
  useScrollSpy({
    ids,
    onActiveChange,
    ...(rootSelector !== undefined ? { rootSelector } : {}),
  })
  return null
}

describe('useScrollSpy', () => {
  it('creates an IntersectionObserver and observes the listed section elements', () => {
    setupSections(['a', 'b', 'c'])
    render(<Probe ids={['a', 'b', 'c']} onActiveChange={() => {}} />)
    expect(MockIntersectionObserver.instances).toHaveLength(1)
    const observed = MockIntersectionObserver.instances[0].observed
    expect(observed.map((e) => (e as HTMLElement).id)).toEqual(['a', 'b', 'c'])
  })

  it('calls onActiveChange with the id of the intersecting section', () => {
    setupSections(['a', 'b'])
    const onActiveChange = vi.fn()
    render(<Probe ids={['a', 'b']} onActiveChange={onActiveChange} />)
    const io = MockIntersectionObserver.instances[0]
    const b = document.getElementById('b')!
    io.fire([{ target: b, isIntersecting: true, intersectionRatio: 0.8 }])
    expect(onActiveChange).toHaveBeenCalledWith('b')
  })

  it('picks the entry with the highest intersection ratio when multiple intersect', () => {
    setupSections(['a', 'b', 'c'])
    const onActiveChange = vi.fn()
    render(<Probe ids={['a', 'b', 'c']} onActiveChange={onActiveChange} />)
    const io = MockIntersectionObserver.instances[0]
    const a = document.getElementById('a')!
    const b = document.getElementById('b')!
    const c = document.getElementById('c')!
    io.fire([
      { target: a, isIntersecting: true, intersectionRatio: 0.3 },
      { target: b, isIntersecting: true, intersectionRatio: 0.7 },
      { target: c, isIntersecting: true, intersectionRatio: 0.2 },
    ])
    expect(onActiveChange).toHaveBeenLastCalledWith('b')
  })

  it('ignores non-intersecting entries', () => {
    setupSections(['a', 'b'])
    const onActiveChange = vi.fn()
    render(<Probe ids={['a', 'b']} onActiveChange={onActiveChange} />)
    const io = MockIntersectionObserver.instances[0]
    const a = document.getElementById('a')!
    io.fire([{ target: a, isIntersecting: false, intersectionRatio: 0 }])
    expect(onActiveChange).not.toHaveBeenCalled()
  })

  it('disconnects the observer on unmount', () => {
    setupSections(['a'])
    const { unmount } = render(<Probe ids={['a']} onActiveChange={() => {}} />)
    const io = MockIntersectionObserver.instances[0]
    unmount()
    expect(io.observed).toEqual([])
  })

  it('does not create an observer for an empty ids list', () => {
    render(<Probe ids={[]} onActiveChange={() => {}} />)
    expect(MockIntersectionObserver.instances).toHaveLength(0)
  })

  it('constructs the observer with root: null when rootSelector is omitted (document-root / viewport model)', () => {
    setupSections(['a', 'b'])
    render(<Probe ids={['a', 'b']} onActiveChange={() => {}} />)
    expect(MockIntersectionObserver.instances).toHaveLength(1)
    expect(MockIntersectionObserver.instances[0].options.root).toBeNull()
  })
})
