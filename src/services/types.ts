import type {
  Comment, CommentInput, Lecture, LectureInput, Post, PostInput,
  Research, ResearchInput, Role, User,
} from '../types'

// 화면은 이 인터페이스만 사용합니다.
// Firebase로 바꿀 때는 src/services/firebase/ 에 같은 인터페이스를 구현하고
// src/services/index.ts 에서 구현체만 교체하면 됩니다.

export interface AuthService {
  /** 로그인 상태가 바뀔 때마다 호출됩니다(등록 즉시 현재 상태도 한 번 호출). 반환값은 구독 해제 함수 */
  onAuthChange(callback: (user: User | null) => void): () => void
  signInWithGoogle(): Promise<User>
  signOut(): Promise<void>
  /** 개발용: 역할 전환. Firebase 구현체에서는 만들지 않아도 됩니다. */
  devSetRole?(role: Role): Promise<void>
}

export interface ResearchService {
  list(): Promise<Research[]>
  get(id: string): Promise<Research | null>
  create(input: ResearchInput): Promise<Research>
  update(id: string, input: ResearchInput): Promise<Research>
  remove(id: string): Promise<void>
}

export interface LectureService {
  list(): Promise<Lecture[]>
  create(input: LectureInput): Promise<Lecture>
  update(id: string, input: LectureInput): Promise<Lecture>
  remove(id: string): Promise<void>
}

export interface PostService {
  /** researchId를 주면 해당 연구의 글만, 없으면 전체(최신순) */
  list(researchId?: string): Promise<Post[]>
  create(input: PostInput): Promise<Post>
  update(id: string, data: { title: string; content: string }): Promise<Post>
  remove(id: string): Promise<void>
}

export interface CommentService {
  listByPost(postId: string): Promise<Comment[]>
  create(input: CommentInput): Promise<Comment>
  remove(id: string): Promise<void>
}
