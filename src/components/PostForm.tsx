import { useState, type FormEvent } from 'react'

interface Props {
  initial?: { title: string; content: string }
  submitLabel?: string
  onSubmit: (data: { title: string; content: string }) => Promise<void>
  onCancel: () => void
}

export default function PostForm({ initial, submitLabel = '등록', onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [content, setContent] = useState(initial?.content ?? '')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return setError('제목을 입력해 주세요.')
    if (!content.trim()) return setError('내용을 입력해 주세요.')
    setError(null)
    setSaving(true)
    try {
      await onSubmit({ title: title.trim(), content: content.trim() })
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card mb-4 space-y-3" aria-label="토론 글 작성">
      <div>
        <label htmlFor="post-title" className="label">제목 *</label>
        <input id="post-title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label htmlFor="post-content" className="label">내용 *</label>
        <textarea id="post-content" rows={5} className="input" value={content} onChange={(e) => setContent(e.target.value)} />
      </div>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? '저장 중...' : submitLabel}</button>
        <button type="button" className="btn-outline" onClick={onCancel}>취소</button>
      </div>
    </form>
  )
}
