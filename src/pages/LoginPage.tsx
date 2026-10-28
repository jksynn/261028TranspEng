import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useFirebase } from '../services'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/PageHeader'

export default function LoginPage() {
  const { user, signIn } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to="/" replace />

  const handleLogin = async () => {
    setBusy(true)
    setError(null)
    try {
      await signIn()
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.')
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <PageHeader title="로그인" />
      <div className="card space-y-4 text-center">
        {useFirebase ? (
          <p className="text-sm text-slate-700">구글 계정으로 로그인합니다. 처음 로그인하면 교수님의 승인을 받은 뒤 토론에 참여할 수 있습니다.</p>
        ) : (
          <p className="text-sm text-slate-700">현재는 <strong>가짜 로그인</strong>입니다. 누르면 임시 멤버로 로그인됩니다.</p>
        )}
        <button type="button" className="btn-primary w-full" onClick={handleLogin} disabled={busy}>
          {busy ? '로그인 중...' : '구글로 로그인'}
        </button>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      </div>
    </div>
  )
}
