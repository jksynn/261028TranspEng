// ★ 구현체를 바꾸는 유일한 곳 ★
// Firebase 연동 시: './firebase' 에서 같은 이름으로 내보내고 아래 import 경로만 바꾸세요.
import type {
  AuthService, CommentService, LectureService, PostService, ResearchService,
} from './types'
import * as impl from './mock'

export const authService: AuthService = impl.authService
export const researchService: ResearchService = impl.researchService
export const lectureService: LectureService = impl.lectureService
export const postService: PostService = impl.postService
export const commentService: CommentService = impl.commentService

export type {
  AuthService, CommentService, LectureService, PostService, ResearchService,
}
