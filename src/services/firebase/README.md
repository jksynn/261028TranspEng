# Firebase 구현체 자리

Firebase 연동 단계에서 이 폴더에 `src/services/types.ts` 의 인터페이스
(AuthService, ResearchService, LectureService, PostService, CommentService)를
Firestore / Google 로그인으로 구현합니다.
그 다음 `src/services/index.ts` 의 `import * as impl from './mock'` 을
`import * as impl from './firebase'` 로 바꾸면 전체가 전환됩니다.
