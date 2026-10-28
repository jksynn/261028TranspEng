import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// 값은 .env (내 컴퓨터) 또는 Netlify 환경변수에서 읽습니다. 코드에 직접 쓰지 않습니다.
const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
})

// 설정값이 없으면(임시 구현을 쓰는 중) 오류가 나지 않도록 초기화를 건너뜁니다.
const configured = Boolean(import.meta.env.VITE_FIREBASE_API_KEY)
export const auth = configured ? getAuth(app) : (undefined as never)
export const db = configured ? getFirestore(app) : (undefined as never)
