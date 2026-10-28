import { Link } from 'react-router-dom'
import type { Research } from '../types'
import { formatDate } from '../utils/format'

export default function ResearchCard({ research }: { research: Research }) {
  return (
    <article className="card flex flex-col gap-2">
      <p className="text-xs font-semibold text-navy-600">{research.category}</p>
      <h3 className="text-lg">
        <Link to={`/research/${research.id}`} className="hover:underline">{research.title}</Link>
      </h3>
      <p className="text-sm text-slate-600">{research.authors.join(', ')} · {formatDate(research.createdAt)}</p>
      <p className="line-clamp-2 text-sm text-slate-700">{research.summary}</p>
      <ul className="mt-auto flex flex-wrap gap-1.5">
        {research.tags.map((t) => <li key={t} className="tag">#{t}</li>)}
      </ul>
    </article>
  )
}
