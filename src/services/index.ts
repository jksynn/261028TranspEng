// ★ 구현체를 바꾸는 유일한 곳 ★
// Firebase 설정값(.env 또는 Netlify 환경변수)이 있으면 Firebase를, 없으면 임시(localStorage) 구현을 씁니다.
import type {
  AuthService, CommentService, LectureService, PostService, ResearchService, UserService,
} from './types'
import * as mock from './mock'
import * as firebase from './firebase'

export const useFirebase = Boolean(import.meta.env.VITE_FIREBASE_API_KEY)
const impl = useFirebase ? firebase : mock

export const authService: AuthService = impl.authService
export const researchService: ResearchService = impl.researchService
export const lectureService: LectureService = impl.lectureService
export const postService: PostService = impl.postService
export const commentService: CommentService = impl.commentService
export const userService: UserService = impl.userService

export type {
  AuthService, CommentService, LectureService, PostService, ResearchService, UserService,
}
