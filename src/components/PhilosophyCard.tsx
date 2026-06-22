import type { CSSProperties } from 'react'

interface PhilosophyCardProps {
  title: string
  description: string
  publicDoc: string
  vendor: 'anthropic' | 'openai'
}

export function PhilosophyCard({ title, description, publicDoc, vendor }: PhilosophyCardProps) {
  const titleColor = vendor === 'anthropic' ? '#9D4EDD' : '#2EE6D6'
  return (
    <div
      style={{ '--vendor-color': titleColor } as CSSProperties}
      className="flex flex-col gap-2.5 p-4 min-w-0 border border-border rounded-card bg-surface-card"
    >
      <div className="font-display font-bold text-[17px] text-(--vendor-color)">{title}</div>
      <p className="m-0 font-body text-sm leading-[22px] text-text-primary">{description}</p>
      <div className="font-mono text-xs text-text-muted">ref: {publicDoc}</div>
    </div>
  )
}
