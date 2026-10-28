import { useState, type FormEvent } from 'react'
import { LECTURE_SUBJECTS, type LectureInput, type Lecture, type LinkItem } from '../types'
import { isValidUrl } from '../utils/format'
import LinksEditor from './LinksEditor'

interface Props {
  initial?: Lecture
  onSubmit: (input: LectureInput) => Promise<void>
  onCancel: () => void
}

export default function LectureForm({ initial, onSubmit, onCancel }: Props) {
  const [subject, setSubject] = useState(initial?.subject ?? LECTURE_SUBJECTS[0])
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [links, setLinks] = useState<LinkItem[]>(initial?.links ?? [])
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const cleanLinks = links.filter((l) => l.label.trim() || l.url.trim()).map((l) => ({ label: l.label.trim(), url: l.url.trim() }))
    if (!title.trim()) return setError('제목을 입력해 주세요.')
    if (cleanLinks.some((l) => !l.label || !isValidUrl(l.url))) return setError('링크는 이름과 http(s)로 시작하는 올바른 주소가 모두 필요합니다.')
    setError(null)
    setSaving(true)
    try {
      await onSubmit({ subject, title: title.trim(), description: description.trim(), links: cleanLinks })
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 중 오류가 발생했습니다.')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card mb-6 space-y-4" aria-label={initial ? '강의 자료 수정' : '강의 자료 등록'}>
      <h2 className="text-lg">{initial ? '강의 자료 수정' : '새 강의 자료 등록'}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="l-subject" className="label">과목</label>
          <select id="l-subject" className="input" value={subject} onChange={(e) => setSubject(e.target.value)}>
            {LECTURE_SUBJECTS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="l-title" className="label">제목 *</label>
          <input id="l-title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
      </div>
      <div>
        <label htmlFor="l-desc" className="label">설명</label>
        <textarea id="l-desc" rows={3} className="input" value={description} onChange={(e) => setDescription(e.target.value)} />
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
