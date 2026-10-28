import type {
  AuthService, CommentService, LectureService, PostService, ResearchService,
} from '../types'
import type { Comment, Lecture, Post, Research, Role, User } from '../../types'
import { delay, load, newId, save } from './storage'
import { seedComments, seedLectures, seedPosts, seedResearch } from './seed'

const now = () => new Date().toISOString()
const newestFirst = <T extends { createdAt: string }>(items: T[]) =>
  [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

// ---------- 인증 (가짜 로그인) ----------
const MOCK_USERS: Record<Exclude<Role, 'visitor'>, User> = {
  member: { id: 'mock-member', name: '김대학원 (임시)', email: 'member@example.com', photoURL: null, role: 'member' },
  admin: { id: 'mock-admin', name: '홍길동 교수 (임시)', email: 'admin@example.com', photoURL: null, role: 'admin' },
}
const AUTH_KEY = 'auth'
const listeners = new Set<(u: User | null) => void>()
const readUser = (): User | null => load<User | null>(AUTH_KEY, () => null)
const writeUser = (u: User | null) => {
  save(AUTH_KEY, u)
  listeners.forEach((cb) => cb(u))
}

export const authService: AuthService = {
  onAuthChange(callback) {
    listeners.add(callback)
    callback(readUser())
    return () => { listeners.delete(callback) }
  },
  async signInWithGoogle() {
    // 임시: 누르면 '멤버' 사용자로 로그인됩니다.
    const user = MOCK_USERS.member
    writeUser(user)
    return delay(user)
  },
  async signOut() { writeUser(null) },
  async devSetRole(role) {
    writeUser(role === 'visitor' ? null : MOCK_USERS[role])
  },
}

// ---------- 연구 ----------
const RESEARCH_KEY = 'research'
export const researchService: ResearchService = {
  async list() { return delay(newestFirst(load<Research[]>(RESEARCH_KEY, seedResearch))) },
  async get(id) { return delay(load<Research[]>(RESEARCH_KEY, seedResearch).find((r) => r.id === id) ?? null) },
  async create(input) {
    const items = load<Research[]>(RESEARCH_KEY, seedResearch)
    const item: Research = { ...input, id: newId(), createdAt: now(), updatedAt: now() }
    save(RESEARCH_KEY, [...items, item])
    return delay(item)
  },
  async update(id, input) {
    const items = load<Research[]>(RESEARCH_KEY, seedResearch)
    const old = items.find((r) => r.id === id)
    if (!old) throw new Error('수정할 연구를 찾을 수 없습니다.')
    const item: Research = { ...old, ...input, updatedAt: now() }
    save(RESEARCH_KEY, items.map((r) => (r.id === id ? item : r)))
    return delay(item)
  },
  async remove(id) {
    save(RESEARCH_KEY, load<Research[]>(RESEARCH_KEY, seedResearch).filter((r) => r.id !== id))
    return delay(undefined)
  },
}

// ---------- 강의 ----------
const LECTURE_KEY = 'lectures'
export const lectureService: LectureService = {
  async list() { return delay(newestFirst(load<Lecture[]>(LECTURE_KEY, seedLectures))) },
  async create(input) {
    const items = load<Lecture[]>(LECTURE_KEY, seedLectures)
    const item: Lecture = { ...input, id: newId(), createdAt: now() }
    save(LECTURE_KEY, [...items, item])
    return delay(item)
  },
  async update(id, input) {
    const items = load<Lecture[]>(LECTURE_KEY, seedLectures)
    const old = items.find((l) => l.id === id)
    if (!old) throw new Error('수정할 강의 자료를 찾을 수 없습니다.')
    const item: Lecture = { ...old, ...input }
    save(LECTURE_KEY, items.map((l) => (l.id === id ? item : l)))
    return delay(item)
  },
  async remove(id) {
    save(LECTURE_KEY, load<Lecture[]>(LECTURE_KEY, seedLectures).filter((l) => l.id !== id))
    return delay(undefined)
  },
}

// ---------- 토론 글 ----------
const POST_KEY = 'posts'
const COMMENT_KEY = 'comments'
export const postService: PostService = {
  async list(researchId) {
    const items = load<Post[]>(POST_KEY, seedPosts)
    return delay(newestFirst(researchId ? items.filter((p) => p.researchId === researchId) : items))
  },
  async create(input) {
    const items = load<Post[]>(POST_KEY, seedPosts)
    const item: Post = { ...input, id: newId(), createdAt: now() }
    save(POST_KEY, [...items, item])
    return delay(item)
  },
  async update(id, data) {
    const items = load<Post[]>(POST_KEY, seedPosts)
    const old = items.find((p) => p.id === id)
    if (!old) throw new Error('수정할 글을 찾을 수 없습니다.')
    const item: Post = { ...old, ...data }
    save(POST_KEY, items.map((p) => (p.id === id ? item : p)))
    return delay(item)
  },
  async remove(id) {
    save(POST_KEY, load<Post[]>(POST_KEY, seedPosts).filter((p) => p.id !== id))
    // 글이 지워지면 달린 댓글도 함께 지웁니다.
    save(COMMENT_KEY, load<Comment[]>(COMMENT_KEY, seedComments).filter((c) => c.postId !== id))
    return delay(undefined)
  },
}

// ---------- 댓글 ----------
export const commentService: CommentService = {
  async listByPost(postId) {
    const items = load<Comment[]>(COMMENT_KEY, seedComments).filter((c) => c.postId === postId)
    return delay([...items].sort((a, b) => a.createdAt.localeCompare(b.createdAt)), 80)
  },
  async create(input) {
    const items = load<Comment[]>(COMMENT_KEY, seedComments)
    const item: Comment = { ...input, id: newId(), createdAt: now() }
    save(COMMENT_KEY, [...items, item])
    return delay(item, 80)
  },
  async remove(id) {
    save(COMMENT_KEY, load<Comment[]>(COMMENT_KEY, seedComments).filter((c) => c.id !== id))
    return delay(undefined, 80)
  },
}
