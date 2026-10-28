import { Link } from 'react-router-dom'
import { postService, researchService } from '../services'
import { useAsync } from '../hooks/useAsync'
import { useAuth } from '../context/AuthContext'
import ResearchCard from '../components/ResearchCard'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'
import LoginNotice from '../components/LoginNotice'
import { formatDate } from '../utils/format'

export default function HomePage() {
  const { role } = useAuth()
  const canRead = role !== 'visitor'
  const research = useAsync(async () => (await researchService.list()).slice(0, 3), [])
  const posts = useAsync(async () => (canRead ? (await postService.list()).filter((p) => p.board !== 'question').slice(0, 3) : []), [canRead])

  return (
    <div className="space-y-12">
      <section className="rounded-lg bg-navy-800 px-6 py-10 text-white">
        <h1 className="text-3xl !text-white">교통공학 연구실 아카이브</h1>
        <p className="mt-3 max-w-2xl text-navy-100">
          연구 결과와 논문, 교통기사 강의자료를 한곳에 모으고, 대학원생들이 각 자료에 대해 함께 토론하는 공간입니다.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link to="/research" className="btn bg-white text-navy-800 hover:bg-navy-50">연구 자료 보기</Link>
          <Link to="/lectures" className="btn border border-white text-white hover:bg-navy-700">강의 자료 보기</Link>
        </div>
      </section>

      <section aria-labelledby="home-research">
        <div className="mb-4 flex items-end justify-between">
          <h2 id="home-research" className="text-xl">최근 연구</h2>
          <Link to="/research" className="text-sm text-navy-700 underline">전체 보기</Link>
        </div>
        {research.loading && <Loading />}
        {research.error && <ErrorMessage message={research.error} onRetry={research.reload} />}
        {research.data?.length === 0 && <EmptyState text="등록된 연구가 없습니다." />}
        <div className="grid gap-4 md:grid-cols-3">
          {research.data?.map((r) => <ResearchCard key={r.id} research={r} />)}
        </div>
      </section>

      <section aria-labelledby="home-posts">
        <div className="mb-4 flex items-end justify-between">
          <h2 id="home-posts" className="text-xl">최근 토론</h2>
          {canRead && <Link to="/discussions" className="text-sm text-navy-700 underline">전체 보기</Link>}
        </div>
        {!canRead && <LoginNotice />}
        {canRead && posts.loading && <Loading />}
        {posts.error && <ErrorMessage message={posts.error} onRetry={posts.reload} />}
        {canRead && posts.data?.length === 0 && <EmptyState text="아직 토론 글이 없습니다." />}
        <ul className="space-y-2">
          {canRead && posts.data?.map((p) => (
            <li key={p.id} className="card py-3">
              <Link to="/discussions" className="font-semibold text-navy-800 hover:underline">{p.title}</Link>
              <p className="text-xs text-slate-600">{p.authorName} · {formatDate(p.createdAt)}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
