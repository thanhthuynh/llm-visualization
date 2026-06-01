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
      className="flex flex-col gap-2.5 p-4 min-w-0 border border-(--color-border) rounded-(--radius-card) bg-(--color-surface-card)"
    >
      <div className="font-[family-name:--font-display] font-bold text-[17px] text-(--vendor-color)">
        {title}
      </div>
      <p className="m-0 font-[family-name:--font-body] text-sm leading-[22px] text-(--color-text-primary)">
        {description}
      </p>
      <div className="font-[family-name:--font-mono] text-xs text-(--color-text-muted)">
        ref: {publicDoc}
      </div>
    </div>
  )
}
