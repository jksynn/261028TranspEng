import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="py-16 text-center">
      <h1 className="mb-2 text-2xl">페이지를 찾을 수 없습니다</h1>
      <p className="mb-4 text-slate-600">주소를 다시 확인해 주세요.</p>
      <Link to="/" className="btn-primary">홈으로</Link>
    </div>
  )
}
