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

## 4. 다음 단계: Firebase 연동 시 할 일 체크리스트

무료(Spark) 요금제에서 가능한 범위만 사용합니다. 파일 업로드(Storage)는 쓰지 않고 링크만 사용합니다.

- [ ] [Firebase 콘솔](https://console.firebase.google.com)에서 프로젝트 생성 (Google Analytics는 꺼도 됩니다)
- [ ] 웹 앱 등록 후 나오는 설정값(apiKey 등) 확인
- [ ] Authentication → Sign-in method → **Google** 사용 설정
- [ ] Firestore Database 생성 (프로덕션 모드로 시작, 위치는 가까운 곳)
- [ ] Firestore 보안 규칙 작성 (멤버만 토론 읽기/쓰기, 관리자만 자료 쓰기 — Claude Code에게 요청하세요)
- [ ] 로컬 `.env` 파일 만들기: `.env.example` 을 복사해 값 채우기
- [ ] Netlify → Site configuration → Environment variables 에 `VITE_FIREBASE_*` 값 등록 후 재배포
- [ ] Firebase → Authentication → Settings → **승인된 도메인**에 Netlify 주소(`○○○.netlify.app`) 추가
- [ ] `src/services/firebase/` 에 구현체 작성 후 `src/services/index.ts` 의 import 한 줄 교체
- [ ] 로그인 사용자의 역할(member/admin)을 Firestore에 저장하는 방식 정하기 (예: 교수 이메일은 admin)
- [ ] `src/components/DevRoleSwitcher.tsx` 와 `Layout.tsx` 의 `<DevRoleSwitcher />` 한 줄 삭제

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
