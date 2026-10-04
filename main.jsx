import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ThemeProvider } from './theme.jsx'
import { AuthProvider } from './auth.jsx'
import { UIProvider } from './ui.jsx'
import './styles.css'

class ErrorBoundary extends React.Component {
  state = { error: null }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (!this.state.error) return this.props.children
    return (
      <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: 560, margin: '0 auto' }}>
        <h2>Something went wrong</h2>
        <p style={{ color: '#b3261e' }}>{String(this.state.error.message || this.state.error)}</p>
        <p>Try reloading the page. If it keeps happening, send this message to the site owner.</p>
      </div>
    )
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <ThemeProvider>
        <AuthProvider>
          <UIProvider>
            <App />
          </UIProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
