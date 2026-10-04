import { createContext, useContext, useEffect, useState } from 'react'

const ThemeCtx = createContext(null)
const systemDark = () => window.matchMedia?.('(prefers-color-scheme: dark)').matches

export function ThemeProvider({ children }) {
  // null = follow the device setting
  const [pref, setPref] = useState(() => localStorage.getItem('theme'))
  const [sys, setSys] = useState(systemDark())

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const on = () => setSys(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  const dark = pref ? pref === 'dark' : sys

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

  const setDark = (v) => {
    const val = v ? 'dark' : 'light'
    localStorage.setItem('theme', val)
    setPref(val)
  }
  return <ThemeCtx.Provider value={{ dark, setDark, toggle: () => setDark(!dark) }}>{children}</ThemeCtx.Provider>
}

export const useTheme = () => useContext(ThemeCtx)
