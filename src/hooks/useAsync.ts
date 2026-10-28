import { useCallback, useEffect, useState } from 'react'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

/** 비동기 함수를 실행하고 로딩·오류 상태를 관리합니다. reload()로 다시 불러옵니다. */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[]) {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null })
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    setState((s) => ({ ...s, loading: true, error: null }))
    fn()
      .then((data) => { if (!cancelled) setState({ data, loading: false, error: null }) })
      .catch((e: unknown) => {
        if (!cancelled) setState({ data: null, loading: false, error: e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.' })
      })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick])

  const reload = useCallback(() => setTick((t) => t + 1), [])
  return { ...state, reload }
}
