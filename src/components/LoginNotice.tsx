import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginNotice() {
  const { user } = useAuth()
  // 로그인했지만 아직 역할(member)을 받지 못한 경우
  if (user) {
    return (
      <div className="rounded-md border border-navy-200 bg-navy-50 p-5 text-center">
        <p className="text-navy-900">로그인되었습니다. 교수님의 멤버 승인 후 토론을 볼 수 있습니다.</p>
      </div>
    )
  }
  return (
    <div className="rounded-md border border-navy-200 bg-navy-50 p-5 text-center">
      <p className="mb-3 text-navy-900">토론은 로그인한 멤버(대학원생)만 볼 수 있습니다.</p>
      <Link to="/login" className="btn-primary">로그인하러 가기</Link>
    </div>
  )
}
