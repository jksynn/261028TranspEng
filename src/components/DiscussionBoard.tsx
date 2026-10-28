import { useState } from 'react'
import { postService, researchService } from '../services'
import { useAsync } from '../hooks/useAsync'
import { useAuth } from '../context/AuthContext'
import PostForm from './PostForm'
import PostItem from './PostItem'
import Loading from './Loading'
import ErrorMessage from './ErrorMessage'
import EmptyState from './EmptyState'
import LoginNotice from './LoginNotice'

// researchId가 있으면 그 연구의 토론만, 없으면 전체 토론을 보여줍니다. (멤버 전용)
export default function DiscussionBoard({ researchId }: { researchId?: string }) {
  const { user, role, loading: authLoading } = useAuth()
  const canRead = role !== 'visitor'
  const [writing, setWriting] = useState(false)

  const posts = useAsync(async () => (canRead ? postService.list(researchId) : []), [researchId, canRead])
  // 전체 토론 화면에서 연구 제목을 보여주기 위한 목록
  const researches = useAsync(async () => (canRead && !researchId ? researchService.list() : []), [researchId, canRead])

  if (authLoading) return <Loading />
  if (!canRead) return <LoginNotice />

  const titleOf = (id?: string) => researches.data?.find((r) => r.id === id)?.title

  return (
    <div>
      <div className="mb-4">
        {!writing && <button type="button" className="btn-primary" onClick={() => setWriting(true)}>글쓰기</button>}
      </div>
      {writing && user && (
        <PostForm
          onCancel={() => setWriting(false)}
          onSubmit={async (data) => {
            await postService.create({ ...data, researchId, authorId: user.id, authorName: user.name })
            setWriting(false)
            posts.reload()
          }}
        />
      )}
      {posts.loading && !posts.data && <Loading />}
      {posts.error && <ErrorMessage message={posts.error} onRetry={posts.reload} />}
      {posts.data && posts.data.length === 0 && <EmptyState text="아직 토론 글이 없습니다. 첫 글을 남겨 보세요." />}
      <div className="space-y-4">
        {posts.data?.map((p) => (
          <PostItem key={p.id} post={p} researchTitle={titleOf(p.researchId)} onChanged={posts.reload} />
        ))}
      </div>
    </div>
  )
}
