import {
  GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut as fbSignOut,
  type User as FbUser,
} from 'firebase/auth'
import {
  addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where, writeBatch,
} from 'firebase/firestore'
import type {
  AuthService, CommentService, LectureService, PostService, ResearchService,
} from '../types'
import type { Comment, Lecture, Post, Research, Role, User } from '../../types'
import { auth, db } from './config'

const now = () => new Date().toISOString()
const newestFirst = <T extends { createdAt: string }>(items: T[]) =>
  [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

// 문서 id는 문서 안에 저장하지 않고 Firestore의 id를 씁니다.
const withId = <T extends { id: string }>(id: string, data: object) => ({ ...data, id }) as T
// undefined 값은 Firestore에 저장할 수 없어서 제거합니다.
const clean = <T extends object>(obj: T): T =>
  JSON.parse(JSON.stringify(obj)) as T

async function listAll<T extends { id: string }>(name: string): Promise<T[]> {
  const snap = await getDocs(collection(db, name))
  return snap.docs.map((d) => withId<T>(d.id, d.data()))
}

// ---------- 인증 (구글 로그인) ----------
// 사용자 문서(users/{uid})에 역할(role)을 저장합니다.
// 처음 로그인한 사람은 'visitor'(승인 대기)이고, 교수님이 Firebase 콘솔에서 'member' 또는 'admin'으로 바꿔 줍니다.
async function toUser(fb: FbUser): Promise<User> {
  const ref = doc(db, 'users', fb.uid)
  const base = { name: fb.displayName ?? fb.email ?? '이름 없음', email: fb.email ?? '', photoURL: fb.photoURL }
  let role: Role = 'visitor'
  try {
    const snap = await getDoc(ref)
    if (snap.exists()) {
      role = (snap.data().role as Role) ?? 'visitor'
    } else {
      await setDoc(ref, { ...base, role: 'visitor', createdAt: now() })
    }
  } catch {
    // 읽기 실패 시 가장 낮은 권한으로 처리
  }
  return { id: fb.uid, ...base, role }
}

export const authService: AuthService = {
  onAuthChange(callback) {
    return onAuthStateChanged(auth, (fb) => {
      if (!fb) return callback(null)
      void toUser(fb).then(callback)
    })
  },
  async signInWithGoogle() {
    const cred = await signInWithPopup(auth, new GoogleAuthProvider())
    return toUser(cred.user)
  },
  async signOut() { await fbSignOut(auth) },
}

// ---------- 연구 ----------
export const researchService: ResearchService = {
  async list() { return newestFirst(await listAll<Research>('research')) },
  async get(id) {
    const snap = await getDoc(doc(db, 'research', id))
    return snap.exists() ? withId<Research>(snap.id, snap.data()) : null
  },
  async create(input) {
    const data = { ...clean(input), createdAt: now(), updatedAt: now() }
    const ref = await addDoc(collection(db, 'research'), data)
    return withId<Research>(ref.id, data)
  },
  async update(id, input) {
    await updateDoc(doc(db, 'research', id), { ...clean(input), updatedAt: now() })
    const updated = await researchService.get(id)
    if (!updated) throw new Error('수정할 연구를 찾을 수 없습니다.')
    return updated
  },
  async remove(id) { await deleteDoc(doc(db, 'research', id)) },
}

// ---------- 강의 ----------
export const lectureService: LectureService = {
  async list() { return newestFirst(await listAll<Lecture>('lectures')) },
  async create(input) {
    const data = { ...clean(input), createdAt: now() }
    const ref = await addDoc(collection(db, 'lectures'), data)
    return withId<Lecture>(ref.id, data)
  },
  async update(id, input) {
    await updateDoc(doc(db, 'lectures', id), clean(input))
    const snap = await getDoc(doc(db, 'lectures', id))
    if (!snap.exists()) throw new Error('수정할 강의 자료를 찾을 수 없습니다.')
    return withId<Lecture>(snap.id, snap.data())
  },
  async remove(id) { await deleteDoc(doc(db, 'lectures', id)) },
}

// ---------- 토론 글 ----------
export const postService: PostService = {
  async list(researchId) {
    // where + orderBy 를 같이 쓰면 색인(인덱스)이 필요해서, 정렬은 브라우저에서 합니다.
    const q = researchId
      ? query(collection(db, 'posts'), where('researchId', '==', researchId))
      : collection(db, 'posts')
    const snap = await getDocs(q)
    return newestFirst(snap.docs.map((d) => withId<Post>(d.id, d.data())))
  },
  async create(input) {
    const data = { ...clean(input), createdAt: now() }
    const ref = await addDoc(collection(db, 'posts'), data)
    return withId<Post>(ref.id, data)
  },
  async update(id, data) {
    await updateDoc(doc(db, 'posts', id), { title: data.title, content: data.content })
    const snap = await getDoc(doc(db, 'posts', id))
    if (!snap.exists()) throw new Error('수정할 글을 찾을 수 없습니다.')
    return withId<Post>(snap.id, snap.data())
  },
  async remove(id) {
    // 글과 달린 댓글을 한 번에 지웁니다.
    const comments = await getDocs(query(collection(db, 'comments'), where('postId', '==', id)))
    const batch = writeBatch(db)
    comments.docs.forEach((c) => batch.delete(c.ref))
    batch.delete(doc(db, 'posts', id))
    await batch.commit()
  },
}

// ---------- 댓글 ----------
export const commentService: CommentService = {
  async listByPost(postId) {
    const snap = await getDocs(query(collection(db, 'comments'), where('postId', '==', postId)))
    return snap.docs
      .map((d) => withId<Comment>(d.id, d.data()))
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  },
  async create(input) {
    const data = { ...clean(input), createdAt: now() }
    const ref = await addDoc(collection(db, 'comments'), data)
    return withId<Comment>(ref.id, data)
  },
  async remove(id) { await deleteDoc(doc(db, 'comments', id)) },
}
