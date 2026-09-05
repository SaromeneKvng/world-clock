import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initial: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw != null) return JSON.parse(raw) as T;
    } catch {
      // ignore malformed storage
    }
    return typeof initial === "function" ? (initial as () => T)() : initial;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage unavailable (private mode, quota) — fail silently
    }
  }, [key, value]);

  return [value, setValue] as const;
}
