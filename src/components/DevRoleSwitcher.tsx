import { authService } from '../services'
import { useAuth } from '../context/AuthContext'
import type { Role } from '../types'

const roles: { value: Role; label: string }[] = [
  { value: 'visitor', label: '방문자' },
  { value: 'member', label: '멤버' },
  { value: 'admin', label: '관리자' },
]

// 개발용 역할 전환 패널 (가짜 로그인 단계에서만 사용)
export default function DevRoleSwitcher() {
  const { role } = useAuth()
  if (!authService.devSetRole) return null
  const setRole = authService.devSetRole.bind(authService)

  return (
    <div role="group" aria-label="개발용 역할 전환" className="fixed bottom-3 right-3 z-40 rounded-lg border border-amber-300 bg-amber-50 p-2 text-xs shadow">
      <p className="mb-1 font-semibold text-amber-900">개발용 역할 전환</p>
      <div className="flex gap-1">
        {roles.map((r) => (
          <button
            key={r.value}
            type="button"
            aria-pressed={role === r.value}
            onClick={() => void setRole(r.value)}
            className={`rounded px-2 py-1 font-medium ${role === r.value ? 'bg-amber-700 text-white' : 'bg-white text-amber-900 hover:bg-amber-100'}`}
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>
  )
}
