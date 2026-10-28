import { Link } from 'react-router-dom'

export default function LoginNotice() {
  return (
    <div className="rounded-md border border-navy-200 bg-navy-50 p-5 text-center">
      <p className="mb-3 text-navy-900">토론은 로그인한 멤버(대학원생)만 볼 수 있습니다.</p>
      <Link to="/login" className="btn-primary">로그인하러 가기</Link>
    </div>
  )
}
