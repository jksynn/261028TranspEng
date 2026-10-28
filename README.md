# 교통공학 연구실 아카이브 (MVP)

연구 결과·교통기사 강의자료를 모아 두고, 대학원생이 각 자료에 대해 토론하는 사이트입니다.
**현재 단계: Firebase 연동 전.** 가짜 로그인과 브라우저 저장소(localStorage)로 모든 화면이 동작합니다.

- 기술: Vite + React 18 + TypeScript + React Router 6 + Tailwind CSS
- 데이터 읽기/쓰기는 `src/services/` 에 분리되어 있어 나중에 Firebase로 쉽게 교체할 수 있습니다.

## 1. 내 컴퓨터에서 실행하기

[Node.js](https://nodejs.org) (LTS 버전)를 먼저 설치하세요. 그다음 터미널에서:

```bash
npm install
```

```bash
npm run dev
```

터미널에 나오는 주소(보통 http://localhost:5173)를 브라우저로 여세요.

- 화면 오른쪽 아래 노란 **"개발용 역할 전환"** 상자로 방문자 / 멤버 / 관리자를 바꿔 볼 수 있습니다.
  - 방문자: 연구·강의 열람만 가능, 토론은 로그인 안내가 보임
  - 멤버: 토론 글·댓글 작성, 본인 글 수정·삭제
  - 관리자: 연구·강의 등록/수정/삭제, 모든 토론 글 삭제
- 데이터는 브라우저에만 저장됩니다. 처음 상태로 되돌리려면 브라우저 개발자도구 → Application → Local Storage 에서 `trafficlab:` 로 시작하는 항목을 지우세요.
- 배포용 빌드 확인: `npm run build`

## 2. GitHub에 올리기

1. GitHub에서 새 저장소(Repository)를 만듭니다 (예: `traffic-lab`). README·.gitignore 추가 옵션은 **끄세요**.
2. 프로젝트 폴더에서 아래를 차례로 실행합니다 (`내아이디`는 본인 GitHub 아이디로 바꾸세요).

```bash
git init
```

```bash
git add .
```

```bash
git commit -m "첫 커밋: 연구실 사이트 MVP"
```

```bash
git branch -M main
```

```bash
git remote add origin https://github.com/내아이디/traffic-lab.git
```

```bash
git push -u origin main
```

`.env` 파일(비밀값)은 `.gitignore` 때문에 올라가지 않습니다.

## 3. Netlify로 배포하기

1. [Netlify](https://app.netlify.com) 로그인 → **Add new site → Import an existing project → GitHub** 선택
2. 방금 만든 저장소를 선택합니다.
3. 빌드 설정은 `netlify.toml` 에 이미 들어 있어 자동으로 채워집니다.
   (Build command: `npm run build`, Publish directory: `dist`)
4. **Deploy** 를 누르면 `https://○○○.netlify.app` 주소가 생깁니다.
5. 이후 GitHub에 `git push` 할 때마다 자동으로 다시 배포됩니다.

## 4. Firebase 연동 (코드 작업은 완료됨)

코드는 이미 Firebase용으로 준비되어 있습니다. 설정값(`VITE_FIREBASE_*`)이 있으면 Firebase를, 없으면 임시(localStorage) 구현을 자동으로 씁니다.

- [x] Firebase 프로젝트 생성, 구글 로그인 활성화, 승인된 도메인에 Netlify 주소 추가
- [ ] Firestore Database 만들기 (Firebase 콘솔 → Firestore Database → 데이터베이스 만들기)
- [ ] 보안 규칙 적용: 콘솔 → Firestore → 규칙 탭에 `firestore.rules` 파일 내용을 붙여넣고 **게시**
- [ ] 내 컴퓨터: `.env.example` 을 복사해 `.env` 로 만들고 값 채우기 (이미 채워져 있으면 생략)
- [ ] Netlify → Site configuration → Environment variables 에 `VITE_FIREBASE_*` 6개 값 등록 후 재배포
- [ ] **교수님 계정을 관리자로 지정**: 사이트에서 구글 로그인을 한 번 한 뒤, 콘솔 → Firestore → `users` 컬렉션 → 내 문서의 `role` 값을 `admin` 으로 수정
- [ ] 대학원생 승인: 학생이 로그인하면 `users` 에 `role: visitor` 로 생깁니다. 토론 참여를 허용하려면 `role` 을 `member` 로 수정
- [ ] 관리자로 로그인해 연구·강의 자료를 등록 (Firestore는 처음엔 비어 있습니다)
- [ ] `DevRoleSwitcher`는 Firebase 사용 시 자동으로 숨겨집니다. 완전히 지우려면 `Layout.tsx` 의 `<DevRoleSwitcher />` 한 줄 삭제

## 폴더 구조

```
src/
  pages/        화면(페이지)
  components/   재사용 컴포넌트
  services/     데이터 접근 (types.ts = 인터페이스, mock/ = 임시 구현, index.ts = 교체 지점)
  context/      로그인 상태
  types/        TypeScript 타입
  hooks/        useAsync 등
  utils/        날짜·URL 도우미
```
