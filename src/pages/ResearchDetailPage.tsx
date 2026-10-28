import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { researchService } from '../services'
import { useAsync } from '../hooks/useAsync'
import { useAuth } from '../context/AuthContext'
import LinkList from '../components/LinkList'
import ResearchForm from '../components/ResearchForm'
import DiscussionBoard from '../components/DiscussionBoard'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import { formatDate } from '../utils/format'

export default function ResearchDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { role } = useAuth()
  const { data, loading, error, reload } = useAsync(() => researchService.get(id), [id])
  const [editing, setEditing] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  if (loading && !data) return <Loading />
  if (error) return <ErrorMessage message={error} onRetry={reload} />
  if (!data) {
    return (
      <div className="py-10 text-center">
        <p className="mb-3">해당 연구를 찾을 수 없습니다.</p>
        <Link to="/research" className="btn-outline">목록으로</Link>
      </div>
    )
  }

  const handleDelete = async () => {
    if (!window.confirm('이 연구를 삭제할까요?')) return
    try {
      await researchService.remove(data.id)
      navigate('/research')
    } catch (err) {
      setActionError(err instanceof Error ? err.message : '삭제에 실패했습니다.')
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <Link to="/research" className="text-sm text-navy-700 underline">← 연구 목록</Link>

        {editing ? (
          <div className="mt-4">
            <ResearchForm
              initial={data}
              onCancel={() => setEditing(false)}
              onSubmit={async (input) => {
                await researchService.update(data.id, input)
                setEditing(false)
                reload()
              }}
            />
          </div>
        ) : (
          <article className="mt-3">
            <p className="text-sm font-semibold text-navy-600">{data.category}</p>
            <h1 className="mt-1 text-2xl">{data.title}</h1>
            <p className="mt-2 text-sm text-slate-600">
              {data.authors.join(', ')} · 등록 {formatDate(data.createdAt)}
              {data.updatedAt !== data.createdAt && ` · 수정 ${formatDate(data.updatedAt)}`}
            </p>
            <p className="mt-4 whitespace-pre-wrap leading-relaxed">{data.summary}</p>
            <ul className="mt-4 flex flex-wrap gap-1.5">{data.tags.map((t) => <li key={t} className="tag">#{t}</li>)}</ul>
            <div className="mt-4"><LinkList links={data.links} /></div>
            {role === 'admin' && (
              <div className="mt-4 flex gap-2">
                <button type="button" className="btn-outline" onClick={() => setEditing(true)}>수정</button>
                <button type="button" className="btn-danger" onClick={handleDelete}>삭제</button>
              </div>
            )}
            {actionError && <p role="alert" className="mt-2 text-sm text-red-700">{actionError}</p>}
          </article>
        )}
      </div>

      <section aria-labelledby="discussion-title">
        <h2 id="discussion-title" className="mb-4 text-xl">이 연구에 대한 토론</h2>
        <DiscussionBoard researchId={data.id} />
      </section>
    </div>
  )
}
