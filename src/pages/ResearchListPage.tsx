import { useMemo, useState } from 'react'
import { researchService } from '../services'
import { useAsync } from '../hooks/useAsync'
import { useAuth } from '../context/AuthContext'
import { RESEARCH_CATEGORIES } from '../types'
import PageHeader from '../components/PageHeader'
import ResearchCard from '../components/ResearchCard'
import ResearchForm from '../components/ResearchForm'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'

export default function ResearchListPage() {
  const { role } = useAuth()
  const { data, loading, error, reload } = useAsync(() => researchService.list(), [])
  const [category, setCategory] = useState('')
  const [tag, setTag] = useState('')
  const [query, setQuery] = useState('')
  const [adding, setAdding] = useState(false)

  const allTags = useMemo(() => Array.from(new Set((data ?? []).flatMap((r) => r.tags))).sort(), [data])
  const filtered = useMemo(
    () =>
      (data ?? []).filter(
        (r) =>
          (!category || r.category === category) &&
          (!tag || r.tags.includes(tag)) &&
          (!query.trim() || r.title.toLowerCase().includes(query.trim().toLowerCase())),
      ),
    [data, category, tag, query],
  )

  return (
    <div>
      <PageHeader
        title="연구 자료"
        description="연구실의 연구 결과 목록입니다."
        action={role === 'admin' && !adding ? <button type="button" className="btn-primary" onClick={() => setAdding(true)}>+ 연구 등록</button> : undefined}
      />

      {role === 'admin' && adding && (
        <ResearchForm
          onCancel={() => setAdding(false)}
          onSubmit={async (input) => {
            await researchService.create(input)
            setAdding(false)
            reload()
          }}
        />
      )}

      <form role="search" aria-label="연구 검색" className="mb-6 grid gap-3 sm:grid-cols-3" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="q" className="label">제목 검색</label>
          <input id="q" type="search" className="input" placeholder="제목에 포함된 말" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div>
          <label htmlFor="cat" className="label">카테고리</label>
          <select id="cat" className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">전체</option>
            {RESEARCH_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="tag" className="label">태그</label>
          <select id="tag" className="input" value={tag} onChange={(e) => setTag(e.target.value)}>
            <option value="">전체</option>
            {allTags.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
      </form>

      {loading && !data && <Loading />}
      {error && <ErrorMessage message={error} onRetry={reload} />}
      {data && filtered.length === 0 && <EmptyState text="조건에 맞는 연구가 없습니다." />}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((r) => <ResearchCard key={r.id} research={r} />)}
      </div>
    </div>
  )
}
