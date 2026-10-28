import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { userService } from '../services'
import { useAsync } from '../hooks/useAsync'
import { useAuth } from '../context/AuthContext'
import type { Role, User } from '../types'
import PageHeader from '../components/PageHeader'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'

// 관리자 전용: 가입한 사용자를 승인(member)하거나 승인 취소(visitor)합니다.
export default function AdminMembersPage() {
  const { role, user, loading: authLoading } = useAuth()
  const isAdmin = role === 'admin'
  const users = useAsync(async () => (isAdmin ? userService.list() : []), [isAdmin])
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (authLoading) return <Loading />
  if (!isAdmin) return <Navigate to="/" replace />

  const change = async (u: User, next: Role) => {
    setBusyId(u.id)
    setError(null)
    try {
      await userService.setRole(u.id, next)
      users.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : '역할 변경에 실패했습니다.')
    } finally {
      setBusyId(null)
    }
  }

  const list = users.data ?? []
  const pending = list.filter((u) => u.role === 'visitor')
  const members = list.filter((u) => u.role === 'member')
  const admins = list.filter((u) => u.role === 'admin')

  const Row = ({ u, action }: { u: User; action?: { label: string; next: Role; danger?: boolean } }) => (
    <li className="card flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="font-medium">{u.name}{u.id === user?.id && ' (나)'}</p>
        <p className="text-sm text-slate-600">{u.email}</p>
      </div>
      {action && (
        <button
          type="button"
          className={action.danger ? 'btn-danger' : 'btn-primary'}
          disabled={busyId === u.id}
          onClick={() => void change(u, action.next)}
          aria-label={`${u.name} ${action.label}`}
        >
          {busyId === u.id ? '처리 중...' : action.label}
        </button>
      )}
    </li>
  )

  return (
    <div>
      <PageHeader title="멤버 관리" description="처음 로그인한 학생을 승인하면 토론과 질문게시판에 참여할 수 있습니다." />
      {users.loading && !users.data && <Loading />}
      {users.error && <ErrorMessage message={users.error} onRetry={users.reload} />}
      {error && <p role="alert" className="mb-3 text-sm text-red-700">{error}</p>}
      {users.data && (
        <div className="space-y-8">
          <section aria-label="승인 대기">
            <h2 className="mb-3 text-lg">승인 대기 ({pending.length})</h2>
            {pending.length === 0 ? <EmptyState text="승인 대기 중인 사용자가 없습니다." /> : (
              <ul className="space-y-2">{pending.map((u) => <Row key={u.id} u={u} action={{ label: '멤버로 승인', next: 'member' }} />)}</ul>
            )}
          </section>
          <section aria-label="멤버">
            <h2 className="mb-3 text-lg">멤버 ({members.length})</h2>
            {members.length === 0 ? <EmptyState text="아직 승인된 멤버가 없습니다." /> : (
              <ul className="space-y-2">{members.map((u) => <Row key={u.id} u={u} action={{ label: '승인 취소', next: 'visitor', danger: true }} />)}</ul>
            )}
          </section>
          <section aria-label="관리자">
            <h2 className="mb-3 text-lg">관리자 ({admins.length})</h2>
            <ul className="space-y-2">{admins.map((u) => <Row key={u.id} u={u} />)}</ul>
          </section>
        </div>
      )}
    </div>
  )
}
