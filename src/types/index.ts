export type Role = 'visitor' | 'member' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  photoURL: string | null
  role: Role
}

export interface LinkItem {
  label: string
  url: string
}

export const RESEARCH_CATEGORIES = ['교통수요', '신호운영', '교통안전', '대중교통', '기타'] as const
export type ResearchCategory = (typeof RESEARCH_CATEGORIES)[number]

// 교통기사 과목 (필요하면 여기에서 추가/수정하세요)
export const LECTURE_SUBJECTS = ['교통계획', '교통시설', '교통운영', '교통관련법규', '교통안전', '기타'] as const

export interface Research {
  id: string
  title: string
  authors: string[]
  summary: string
  category: ResearchCategory
  tags: string[]
  links: LinkItem[]
  createdAt: string // ISO 날짜 문자열
  updatedAt: string
}

export interface Lecture {
  id: string
  subject: string
  title: string
  description: string
  links: LinkItem[]
  createdAt: string
}

export interface Post {
  id: string
  researchId?: string
  title: string
  content: string
  authorId: string
  authorName: string
  createdAt: string
}

export interface Comment {
  id: string
  postId: string
  content: string
  authorId: string
  authorName: string
  createdAt: string
}

// 새로 만들 때 쓰는 입력 타입 (id·날짜는 서비스가 채웁니다)
export type ResearchInput = Omit<Research, 'id' | 'createdAt' | 'updatedAt'>
export type LectureInput = Omit<Lecture, 'id' | 'createdAt'>
export type PostInput = Omit<Post, 'id' | 'createdAt'>
export type CommentInput = Omit<Comment, 'id' | 'createdAt'>
