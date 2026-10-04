import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase.js'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true) // is the login status still loading?
  const [profile, setProfile] = useState(null)
  const [ready, setReady] = useState(false) // first-time setup finished
  const [unread, setUnread] = useState(0)
  const [setupError, setSetupError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data } = supabase.auth.onAuthStateChange((_evt, s) => {
      setSession(s)
      setLoading(false)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  const userId = session?.user?.id

  const refreshProfile = useCallback(async () => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (data) setProfile(data)
  }, [userId])

  const refreshUnread = useCallback(async () => {
    if (!userId) return
    const { count } = await supabase
      .from('alerts').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('read', false)
    setUnread(count || 0)
  }, [userId])

  // ensureSetup: find/create the customer record + demo extras, once
  useEffect(() => {
    let cancelled = false
    setReady(false)
    setSetupError('')
    if (!userId) { setProfile(null); setUnread(0); return }
    ;(async () => {
      const { error } = await supabase.rpc('ensure_setup')
      if (cancelled) return
      if (error) { setSetupError(error.message); return }
      await refreshProfile()
      await refreshUnread()
      if (!cancelled) setReady(true)
    })()
    return () => { cancelled = true }
  }, [userId, refreshProfile, refreshUnread])

  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}auth/callback` },
    })

  const signOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
    setReady(false)
  }

  return (
    <AuthCtx.Provider
      value={{ session, loading, profile, ready, setupError, unread, refreshProfile, refreshUnread, signInWithGoogle, signOut, isAdmin: profile?.role === 'admin' }}
    >
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)
