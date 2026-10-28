import type { LinkItem } from '../types'

export default function LinkList({ links }: { links: LinkItem[] }) {
  if (links.length === 0) return null
  return (
    <ul className="flex flex-wrap gap-2">
      {links.map((l, i) => (
        <li key={`${l.url}-${i}`}>
          <a href={l.url} target="_blank" rel="noopener noreferrer" className="btn-outline">
            {l.label} <span aria-hidden="true">↗</span><span className="sr-only">(새 창)</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
