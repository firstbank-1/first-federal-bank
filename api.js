import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase.js'
import { useAuth } from './auth.jsx'

// Load a list from Supabase with a refresh function.
export function useQuery(build, deps = []) {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const reload = useCallback(async () => {
    const { data, error } = await build(supabase)
    if (error) setError(error.message)
    else { setError(''); setData(data) }
  }, deps) // eslint-disable-line
  useEffect(() => { reload() }, [reload])
  return { data, error, reload, loading: data === null && !error }
}

export const useAccounts = () => {
  const { session } = useAuth()
  return useQuery(
    (sb) => sb.from('accounts').select('*').order('created_at'),
    [session?.user?.id],
  )
}

let siteCache = null
export function useSite() {
  const [site, setSite] = useState(siteCache || { bank_name: 'Harborlight Demo Bank', tagline: 'The future of banking is here.' })
  useEffect(() => {
    supabase.from('site_settings').select('*').eq('id', 1).maybeSingle().then(({ data }) => {
      if (data) { siteCache = data; setSite(data) }
    })
  }, [])
  return site
}

// RPC that throws a friendly Error
export async function rpc(name, args) {
  const { error, data } = await supabase.rpc(name, args)
  if (error) throw new Error(error.message)
  return data
}
