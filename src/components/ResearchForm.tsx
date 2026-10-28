import { useState, type FormEvent } from 'react'
import { RESEARCH_CATEGORIES, type LinkItem, type Research, type ResearchCategory, type ResearchInput } from '../types'
import { isValidUrl, splitComma } from '../utils/format'
import LinksEditor from './LinksEditor'

interface Props {
  initial?: Research
  onSubmit: (input: ResearchInput) => Promise<void>
  onCancel: () => void
}

export default function ResearchForm({ initial, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [authors, setAuthors] = useState(initial?.authors.join(', ') ?? '')
  const [category, setCategory] = useState<ResearchCategory>(initial?.category ?? RESEARCH_CATEGORIES[0])
  const [summary, setSummary] = useState(initial?.summary ?? '')
  const [tags, setTags] = useState(initial?.tags.join(', ') ?? '')
  const [links, setLinks] = useState<LinkItem[]>(initial?.links ?? [])
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const cleanLinks = links.filter((l) => l.label.trim() || l.url.trim()).map((l) => ({ label: l.label.trim(), url: l.url.trim() }))
    if (!title.trim()) return setError('제목을 입력해 주세요.')
    if (!summary.trim()) return setError('요약을 입력해 주세요.')
    if (cleanLinks.some((l) => !l.label || !isValidUrl(l.url))) return setError('링크는 이름과 http(s)로 시작하는 올바른 주소가 모두 필요합니다.')
    setError(null)
    setSaving(true)
    try {
      await onSubmit({ title: title.trim(), authors: splitComma(authors), category, summary: summary.trim(), tags: splitComma(tags), links: cleanLinks })
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 중 오류가 발생했습니다.')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card mb-6 space-y-4" aria-label={initial ? '연구 수정' : '연구 등록'}>
      <h2 className="text-lg">{initial ? '연구 수정' : '새 연구 등록'}</h2>
      <div>
        <label htmlFor="r-title" className="label">제목 *</label>
        <input id="r-title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="r-authors" className="label">저자 (쉼표로 구분)</label>
          <input id="r-authors" className="input" value={authors} onChange={(e) => setAuthors(e.target.value)} />
        </div>
        <div>
          <label htmlFor="r-category" className="label">카테고리</label>
          <select id="r-category" className="input" value={category} onChange={(e) => setCategory(e.target.value as ResearchCategory)}>
            {RESEARCH_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="r-summary" className="label">요약 *</label>
        <textarea id="r-summary" rows={4} className="input" value={summary} onChange={(e) => setSummary(e.target.value)} />
      </div>
      <div>
        <label htmlFor="r-tags" className="label">태그 (쉼표로 구분)</label>
        <input id="r-tags" className="input" value={tags} onChange={(e) => setTags(e.target.value)} />
      </div>
      <LinksEditor links={links} onChange={setLinks} />
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? '저장 중...' : '저장'}</button>
        <button type="button" className="btn-outline" onClick={onCancel}>취소</button>
      </div>
    </form>
  )
}
