import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { authService } from '../services'
import type { Role, User } from '../types'

interface AuthValue {
  user: User | null
  role: Role
  loading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return authService.onAuthChange((u) => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  const value: AuthValue = {
    user,
    role: user?.role ?? 'visitor',
    loading,
    signIn: async () => { await authService.signInWithGoogle() },
    signOut: () => authService.signOut(),
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth는 AuthProvider 안에서만 사용할 수 있습니다.')
  return ctx
}
