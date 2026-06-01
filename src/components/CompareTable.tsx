import { ClaimTier } from './ClaimTier'
import type { Tier } from '@/data/compare.config'

interface CompareTableRow {
  label: string
  value: string
  tier: Tier
}

interface CompareTableProps {
  rows: ReadonlyArray<CompareTableRow>
  caption?: string
}

export function CompareTable({ rows, caption }: CompareTableProps) {
  return (
    <table
      {...(caption ? { 'aria-label': caption } : {})}
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontFamily: 'var(--font-body)',
        fontSize: 13,
      }}
    >
      {caption && (
        <caption
          style={{
            textAlign: 'left',
            color: 'var(--color-text-muted)',
            fontSize: 11,
            paddingBottom: 8,
          }}
        >
          {caption}
        </caption>
      )}
      <tbody>
        {rows.map((r, i) => (
          <tr key={`${r.label}-${i}`} style={{ borderTop: '1px solid var(--color-border)' }}>
            <th
              scope="row"
              style={{
                textAlign: 'left',
                padding: '8px 10px',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
              }}
            >
              {r.label}
            </th>
            <td style={{ padding: '8px 10px', color: 'var(--color-text-muted)' }}>{r.value}</td>
            <td style={{ padding: '8px 10px', textAlign: 'right' }}>
              <ClaimTier tier={r.tier} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
