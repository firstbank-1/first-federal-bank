import { createClient } from '@supabase/supabase-js'

// Both values are public by design (the anon key is protected by row-level security).
// The fallbacks keep the site working even if the .env file was not uploaded to GitHub.
const url = import.meta.env.VITE_SUPABASE_URL || 'https://bhcceotqaxcdoiuwduro.supabase.co'
const key =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoY2Nlb3RxYXhjZG9pdXdkdXJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5NTk1OTQsImV4cCI6MjEwNjUzNTU5NH0.CNL5GAAmYNtzUEYSNlksvaxiCAw-rQUCUA-0zo8uXA0'

export const supabase = createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
})
