// localStorage에 JSON으로 저장하는 아주 작은 도우미 (임시 단계 전용)
const PREFIX = 'trafficlab:v1:'

export function load<T>(key: string, seed: () => T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw) return JSON.parse(raw) as T
  } catch {
    // 저장값이 깨졌으면 seed로 다시 시작
  }
  const initial = seed()
  save(key, initial)
  return initial
}

export function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    throw new Error('브라우저 저장소에 저장할 수 없습니다.')
  }
}

export function newId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

// 실제 서버처럼 약간의 지연을 줍니다 (로딩 화면 확인용)
export function delay<T>(value: T, ms = 150): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}
