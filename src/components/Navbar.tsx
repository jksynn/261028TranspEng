import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/', label: '홈', end: true },
  { to: '/research', label: '연구 자료' },
  { to: '/lectures', label: '강의 자료' },
  { to: '/discussions', label: '토론' },
  { to: '/questions', label: '질문게시판' },
  { to: '/about', label: '소개' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, role, signOut, loading } = useAuth()
  const menu = role === 'admin' ? [...links, { to: '/admin/members', label: '멤버 관리' }] : links
  const navigate = useNavigate()

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'bg-navy-50 text-navy-800' : 'text-slate-700 hover:bg-slate-100'}`

  const handleSignOut = async () => {
    await signOut()
    setOpen(false)
    navigate('/')
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav aria-label="주 메뉴" className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold text-navy-800">교통공학 연구실</Link>

        <button
          type="button"
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? '닫기 ✕' : '메뉴 ☰'}
        </button>

        <div className="hidden items-center gap-1 md:flex">
          {menu.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>{l.label}</NavLink>
          ))}
          <AuthButtons />
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-slate-200 px-4 pb-3 md:hidden">
          {menu.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass} onClick={() => setOpen(false)}>{l.label}</NavLink>
          ))}
          <div className="mt-2 border-t border-slate-100 pt-2"><AuthButtons /></div>
        </div>
      )}
    </header>
  )

  function AuthButtons() {
    if (loading) return null
    if (!user) {
      return <Link to="/login" className="btn-primary ml-2" onClick={() => setOpen(false)}>로그인</Link>
    }
    return (
      <span className="ml-2 flex items-center gap-2">
        <span className="text-sm text-slate-700">{user.name}</span>
        <button type="button" className="btn-outline" onClick={handleSignOut}>로그아웃</button>
      </span>
    )
  }
}
