import { useEffect, useState } from 'react'

function usePersistentState<T>(
  key: string,
  defaultValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValue // SSR safety

    try {
      const saved = localStorage.getItem(key)
      return saved ? (JSON.parse(saved) as T) : defaultValue
    } catch (err) {
      console.warn(`Error reading localStorage key "${key}":`, err)
      return defaultValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.warn(`Error setting localStorage key "${key}":`, err)
    }
  }, [key, value])

  return [value, setValue]
}

export default usePersistentState
