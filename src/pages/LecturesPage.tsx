import { useMemo, useState } from 'react'
import { lectureService } from '../services'
import { useAsync } from '../hooks/useAsync'
import { useAuth } from '../context/AuthContext'
import type { Lecture } from '../types'
import PageHeader from '../components/PageHeader'
import LectureForm from '../components/LectureForm'
import LinkList from '../components/LinkList'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'

export default function LecturesPage() {
  const { role } = useAuth()
  const { data, loading, error, reload } = useAsync(() => lectureService.list(), [])
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  // 과목별로 묶기
  const grouped = useMemo(() => {
    const map = new Map<string, Lecture[]>()
    for (const l of data ?? []) map.set(l.subject, [...(map.get(l.subject) ?? []), l])
    return Array.from(map.entries())
  }, [data])

  const handleDelete = async (id: string) => {
    if (!window.confirm('이 강의 자료를 삭제할까요?')) return
    try {
      await lectureService.remove(id)
      reload()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : '삭제에 실패했습니다.')
    }
  }

  return (
    <div>
      <PageHeader
        title="강의 자료"
        description="교통기사 과목별 강의자료입니다."
        action={role === 'admin' && !adding ? <button type="button" className="btn-primary" onClick={() => setAdding(true)}>+ 강의 자료 등록</button> : undefined}
      />

      {role === 'admin' && adding && (
        <LectureForm
          onCancel={() => setAdding(false)}
          onSubmit={async (input) => {
            await lectureService.create(input)
            setAdding(false)
            reload()
          }}
        />
      )}
      {actionError && <p role="alert" className="mb-3 text-sm text-red-700">{actionError}</p>}

      {loading && !data && <Loading />}
      {error && <ErrorMessage message={error} onRetry={reload} />}
      {data?.length === 0 && <EmptyState text="등록된 강의 자료가 없습니다." />}

      <div className="space-y-8">
        {grouped.map(([subject, items]) => (
          <section key={subject} aria-labelledby={`subj-${subject}`}>
            <h2 id={`subj-${subject}`} className="mb-3 border-b border-navy-200 pb-1 text-lg">{subject}</h2>
            <div className="space-y-3">
              {items.map((l) =>
                editingId === l.id ? (
                  <LectureForm
                    key={l.id}
                    initial={l}
                    onCancel={() => setEditingId(null)}
                    onSubmit={async (input) => {
                      await lectureService.update(l.id, input)
                      setEditingId(null)
                      reload()
                    }}
                  />
                ) : (
                  <article key={l.id} className="card">
                    <h3 className="text-base">{l.title}</h3>
                    {l.description && <p className="mt-1 text-sm text-slate-700">{l.description}</p>}
                    <div className="mt-3"><LinkList links={l.links} /></div>
                    {role === 'admin' && (
                      <div className="mt-3 flex gap-2">
                        <button type="button" className="btn-outline" onClick={() => setEditingId(l.id)}>수정</button>
                        <button type="button" className="btn-danger" onClick={() => handleDelete(l.id)}>삭제</button>
                      </div>
                    )}
                  </article>
                ),
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
