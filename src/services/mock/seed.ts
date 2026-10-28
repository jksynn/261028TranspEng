import type { Comment, Lecture, Post, Research } from '../../types'

// 모두 가상의 예시 데이터입니다.
export const seedResearch = (): Research[] => [
  {
    id: 'r1',
    title: '도심 신호교차로 감응식 신호제어 효과 분석',
    authors: ['홍길동 교수', '김대학원'],
    summary: '가상의 도심 축 10개 교차로에 감응식 신호제어를 적용했을 때 평균 지체시간과 정지 횟수가 어떻게 달라지는지 시뮬레이션으로 분석한 예시 연구입니다.',
    category: '신호운영',
    tags: ['신호제어', '지체시간', '시뮬레이션'],
    links: [{ label: '논문 PDF (예시)', url: 'https://example.com/paper1' }, { label: '분석 코드', url: 'https://github.com/example/signal' }],
    createdAt: '2026-09-15T09:00:00.000Z',
    updatedAt: '2026-09-15T09:00:00.000Z',
  },
  {
    id: 'r2',
    title: '지하철 역세권 통행수요 예측 모형 개선',
    authors: ['이연구', '홍길동 교수'],
    summary: '역세권 토지이용 특성을 반영한 4단계 수요예측 모형의 정확도를 높이는 방법을 다룬 가상의 연구입니다.',
    category: '교통수요',
    tags: ['수요예측', '토지이용', '역세권'],
    links: [{ label: '발표자료', url: 'https://example.com/slides2' }],
    createdAt: '2026-08-02T09:00:00.000Z',
    updatedAt: '2026-08-02T09:00:00.000Z',
  },
  {
    id: 'r3',
    title: '보행자 교통사고 다발지점 특성 분석',
    authors: ['박안전', '최데이터'],
    summary: '어린이 보호구역 주변 보행자 사고 자료를 바탕으로 사고 다발지점의 도로 구조 특성을 살펴본 가상의 연구입니다.',
    category: '교통안전',
    tags: ['보행자', '사고분석', '어린이보호구역'],
    links: [{ label: '데이터 폴더 (Drive)', url: 'https://drive.google.com/' }],
    createdAt: '2026-06-20T09:00:00.000Z',
    updatedAt: '2026-06-20T09:00:00.000Z',
  },
  {
    id: 'r4',
    title: '버스 정시성 향상을 위한 중앙버스전용차로 운영 평가',
    authors: ['정대중', '홍길동 교수'],
    summary: '버스 운행기록 자료로 정시성과 배차간격 균일도를 평가하고 개선 방향을 제안한 가상의 사례 연구입니다.',
    category: '대중교통',
    tags: ['버스', '정시성', '전용차로'],
    links: [{ label: '보고서', url: 'https://example.com/report4' }],
    createdAt: '2026-04-11T09:00:00.000Z',
    updatedAt: '2026-04-11T09:00:00.000Z',
  },
]

export const seedLectures = (): Lecture[] => [
  { id: 'l1', subject: '교통계획', title: '교통수요 4단계 추정법 정리', description: '발생·분포·수단선택·통행배정의 개념과 기출 포인트를 정리한 강의 노트(예시).', links: [{ label: '강의 노트', url: 'https://example.com/l1' }], createdAt: '2026-03-02T09:00:00.000Z' },
  { id: 'l2', subject: '교통계획', title: '교통조사 방법론', description: '교통량 조사, 기종점 조사 등 조사 설계와 표본 크기 계산 예제(예시).', links: [{ label: '슬라이드', url: 'https://example.com/l2' }], createdAt: '2026-03-09T09:00:00.000Z' },
  { id: 'l3', subject: '교통시설', title: '도로 기하구조 설계 기초', description: '설계속도, 평면·종단선형, 시거 계산 요약(예시).', links: [{ label: '요약본', url: 'https://example.com/l3' }], createdAt: '2026-03-16T09:00:00.000Z' },
  { id: 'l4', subject: '교통운영', title: '신호교차로 용량 분석', description: '포화교통류율, 현시, 서비스수준 산정 예제 풀이(예시).', links: [{ label: '예제 풀이', url: 'https://example.com/l4' }], createdAt: '2026-03-23T09:00:00.000Z' },
  { id: 'l5', subject: '교통관련법규', title: '도로교통법·교통체계효율화법 핵심 정리', description: '시험에 자주 나오는 조문을 표로 정리한 가상의 자료입니다. 실제 법령은 반드시 원문을 확인하세요.', links: [{ label: '법령정보센터', url: 'https://www.law.go.kr/' }], createdAt: '2026-03-30T09:00:00.000Z' },
  { id: 'l6', subject: '교통안전', title: '교통안전 진단과 개선대책', description: '사고 분석 절차와 대표적인 개선 대책 사례(예시).', links: [{ label: '사례집', url: 'https://example.com/l6' }], createdAt: '2026-04-06T09:00:00.000Z' },
]

export const seedPosts = (): Post[] => [
  { id: 'p1', researchId: 'r1', title: '감응식 제어의 포화 상태 성능이 궁금합니다', content: '교통량이 많은 첨두시간에는 감응식 제어의 이점이 줄어드는 것으로 보이는데, 포화 상태에서의 결과도 따로 분석해 보면 어떨까요?', authorId: 'mock-member', authorName: '김대학원 (임시)', createdAt: '2026-10-20T10:00:00.000Z' },
  { id: 'p2', researchId: 'r3', title: '사고 자료 전처리 기준 공유', content: '좌표 누락 건을 제외했는데 기준을 통일하면 좋겠습니다. 다들 어떻게 처리하셨나요?', authorId: 'seed-member-2', authorName: '이연구 (예시)', createdAt: '2026-10-22T14:30:00.000Z' },
  { id: 'p3', title: '이번 학기 세미나 일정 논의', content: '격주 목요일 오후에 진행하면 어떨까요? 가능한 시간대를 댓글로 남겨 주세요.', authorId: 'mock-admin', authorName: '홍길동 교수 (임시)', createdAt: '2026-10-25T09:00:00.000Z' },
]

export const seedComments = (): Comment[] => [
  { id: 'c1', postId: 'p1', content: '좋은 지적입니다. 포화도별로 구간을 나눠 비교표를 만들어 보겠습니다.', authorId: 'mock-admin', authorName: '홍길동 교수 (임시)', createdAt: '2026-10-21T09:00:00.000Z' },
  { id: 'c2', postId: 'p2', content: '저는 좌표 누락 건을 주소로 보정해서 사용했습니다.', authorId: 'mock-member', authorName: '김대학원 (임시)', createdAt: '2026-10-23T08:00:00.000Z' },
  { id: 'c3', postId: 'p3', content: '목요일 오후 3시 이후가 좋습니다.', authorId: 'mock-member', authorName: '김대학원 (임시)', createdAt: '2026-10-25T11:00:00.000Z' },
]
