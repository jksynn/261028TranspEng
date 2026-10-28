import { useState, type FormEvent } from 'react'
import { commentService } from '../services'
import { useAsync } from '../hooks/useAsync'
import { useAuth } from '../context/AuthContext'
import { formatDate } from '../utils/format'
import Loading from './Loading'
import ErrorMessage from './ErrorMessage'

export default function CommentSection({ postId, noun = '댓글' }: { postId: string; noun?: string }) {
  const { user, role } = useAuth()
  const { data, loading, error, reload } = useAsync(() => commentService.listByPost(postId), [postId])
  const [content, setContent] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) return
    if (!content.trim()) return setFormError(`${noun} 내용을 입력해 주세요.`)
    setFormError(null)
    setSaving(true)
    try {
      await commentService.create({ postId, content: content.trim(), authorId: user.id, authorName: user.name })
      setContent('')
      reload()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : `${noun} 저장에 실패했습니다.`)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm(`${noun}을(를) 삭제할까요?`)) return
    try {
      await commentService.remove(id)
      reload()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : '삭제에 실패했습니다.')
    }
  }

  return (
    <section aria-label={noun} className="mt-4 border-t border-slate-100 pt-3">
      {loading && !data && <Loading text={`${noun} 불러오는 중...`} />}
      {error && <ErrorMessage message={error} onRetry={reload} />}
      {data && data.length === 0 && <p className="text-sm text-slate-600">아직 {noun}이(가) 없습니다.</p>}
      <ul className="space-y-3">
        {data?.map((c) => (
          <li key={c.id} className="rounded-md bg-slate-50 p-3 text-sm">
            <p className="mb-1 text-xs text-slate-600">{c.authorName} · {formatDate(c.createdAt)}</p>
            <p className="whitespace-pre-wrap">{c.content}</p>
            {(user?.id === c.authorId || role === 'admin') && (
              <button type="button" className="mt-1 text-xs text-red-700 underline" onClick={() => handleDelete(c.id)}>삭제</button>
            )}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className="mt-3">
        <label htmlFor={`comment-${postId}`} className="label">{noun} 쓰기</label>
        <textarea id={`comment-${postId}`} rows={2} className="input" value={content} onChange={(e) => setContent(e.target.value)} />
        {formError && <p role="alert" className="mt-1 text-sm text-red-700">{formError}</p>}
        <button type="submit" className="btn-primary mt-2" disabled={saving}>{saving ? '등록 중...' : `${noun} 등록`}</button>
      </form>
    </section>
  )
}
