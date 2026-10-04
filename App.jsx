import { useEffect } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { useAuth } from './auth.jsx'
import Homepage from './pages/Homepage.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import BottomBar from './components/BottomBar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Transfer from './pages/Transfer.jsx'
import Deposit from './pages/Deposit.jsx'
import Wallet from './pages/Wallet.jsx'
import Cards from './pages/Cards.jsx'
import Profile from './pages/Profile.jsx'
import Alerts from './pages/Alerts.jsx'
import Statements from './pages/Statements.jsx'
import Loan from './pages/Loan.jsx'
import AddAccount from './pages/AddAccount.jsx'
import Rates from './pages/Rates.jsx'
import Pay from './pages/Pay.jsx'
import Checks from './pages/Checks.jsx'
import Messages from './pages/Messages.jsx'
import Terms from './pages/Terms.jsx'
import AdminLayout from './admin/AdminLayout.jsx'

function AuthCallback() {
  const { loading, session } = useAuth()
  const navigate = useNavigate()
  // let the sign-in system finish, then send the person to "/"
  useEffect(() => {
    if (!loading) navigate('/', { replace: true })
  }, [loading, session, navigate])
  return (
    <div className="center-screen">
      <div className="spinner" />
      <p>Finishing sign-in…</p>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="skeleton-wrap" aria-busy="true">
      <div className="sk sk-bar" />
      <div className="sk sk-card" />
      <div className="sk sk-card" />
      <div className="sk sk-card" />
    </div>
  )
}

function BankLayout() {
  const { loading, session, ready, setupError, signOut } = useAuth()

  if (loading) return <Skeleton />
  if (!session) return <Homepage />
  if (setupError)
    return (
      <div className="center-screen">
        <h2>Setup didn't finish</h2>
        <p className="muted">{setupError}</p>
        <p className="fine">Did you run supabase/schema.sql in your project's SQL editor?</p>
        <button className="btn" onClick={signOut}>Log out</button>
      </div>
    )
  if (!ready) return <Skeleton />

  return (
    <div className="app-shell">
      <Header />
      <main className="page">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/statements" element={<Statements />} />
          <Route path="/loan" element={<Loan />} />
          <Route path="/add-account" element={<AddAccount />} />
          <Route path="/rates" element={<Rates />} />
          <Route path="/pay" element={<Pay />} />
          <Route path="/checks" element={<Checks />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <BottomBar />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/admin/*" element={<AdminLayout />} />
      <Route path="/*" element={<BankLayout />} />
    </Routes>
  )
}
