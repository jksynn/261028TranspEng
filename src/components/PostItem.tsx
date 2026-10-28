import { useState } from 'react'
import { Link } from 'react-router-dom'
import { postService } from '../services'
import { useAuth } from '../context/AuthContext'
import type { Post } from '../types'
import { formatDate } from '../utils/format'
import CommentSection from './CommentSection'
import PostForm from './PostForm'

interface Props {
  post: Post
  researchTitle?: string
  onChanged: () => void
}

export default function PostItem({ post, researchTitle, onChanged }: Props) {
  const { user, role } = useAuth()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isOwner = user?.id === post.authorId
  const canEdit = isOwner // 본인 글만 수정
  const canDelete = isOwner || role === 'admin' // 관리자는 모든 글 삭제 가능

  const handleDelete = async () => {
    if (!window.confirm('이 글을 삭제할까요? 달린 댓글도 함께 삭제됩니다.')) return
    try {
      await postService.remove(post.id)
      onChanged()
    } catch (err) {
      setError(err instanceof Error ? err.message : '삭제에 실패했습니다.')
    }
  }

  if (editing) {
    return (
      <PostForm
        initial={{ title: post.title, content: post.content }}
        submitLabel="수정 완료"
        onCancel={() => setEditing(false)}
        onSubmit={async (data) => {
          await postService.update(post.id, data)
          setEditing(false)
          onChanged()
        }}
      />
    )
  }

  return (
    <article className="card">
      {researchTitle && post.researchId && (
        <p className="mb-1 text-xs text-navy-600">연구: <Link to={`/research/${post.researchId}`} className="underline">{researchTitle}</Link></p>
      )}
      <h3 className="text-lg">{post.title}</h3>
      <p className="mb-2 text-xs text-slate-600">{post.authorName} · {formatDate(post.createdAt)}</p>
      <p className="whitespace-pre-wrap text-sm text-slate-800">{post.content}</p>
      {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="btn-outline" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          {open ? '댓글 접기' : '댓글 보기'}
        </button>
        {canEdit && <button type="button" className="btn-outline" onClick={() => setEditing(true)}>수정</button>}
        {canDelete && <button type="button" className="btn-danger" onClick={handleDelete}>삭제</button>}
      </div>
      {open && <CommentSection postId={post.id} />}
    </article>
  )
}
