import { createContext, useCallback, useContext, useState } from 'react'
import { useAuth } from './auth.jsx'

const UICtx = createContext(null)

export function UIProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const [signInOpen, setSignInOpen] = useState(false)

  const toast = useCallback((message, type = 'ok') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200)
  }, [])

  return (
    <UICtx.Provider value={{ toast, openSignIn: () => setSignInOpen(true), closeSignIn: () => setSignInOpen(false) }}>
      {children}
      {signInOpen && <SignInModal onClose={() => setSignInOpen(false)} />}
      <div className="toasts" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>{t.message}</div>
        ))}
      </div>
    </UICtx.Provider>
  )
}

export const useUI = () => useContext(UICtx)

function SignInModal({ onClose }) {
  const { signInWithGoogle } = useAuth()
  const { toast } = useUI()
  const [busy, setBusy] = useState(false)

  const go = async () => {
    setBusy(true)
    const { error } = await signInWithGoogle()
    if (error) {
      setBusy(false)
      toast(error.message, 'err')
    }
  }

  return (
    <div className="overlay" onClick={onClose} role="presentation">
      <div className="modal" role="dialog" aria-modal="true" aria-label="Sign in" onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn modal-x" onClick={onClose} aria-label="Close">✕</button>
        <h2>Sign in</h2>
        <p className="muted">
          Use your Google account. You sign in on Google's own page, so this site never sees or stores your password.
        </p>
        <button className="btn btn-google" onClick={go} disabled={busy}>
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.3 5.7c4.3-4 6.8-9.9 6.8-17.1z"/>
            <path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 0 1 0-9.4l-7.9-6.1a24 24 0 0 0 0 21.6l7.9-6.1z"/>
            <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.3-5.7c-2 1.4-4.9 2.3-8.6 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/>
          </svg>
          {busy ? 'Opening Google…' : 'Continue with Google'}
        </button>
        <p className="fine">Portfolio demo. Not a real bank. All data is fictional.</p>
      </div>
    </div>
  )
}
