import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'

const AuthContext = createContext()

const TIMEOUT_DURATION = 15 * 60 * 1000 // 15 minutes d'inactivité

export function AuthProvider({ children }) {
  const [admin, setAdmin]     = useState(null)
  const [citoyen, setCitoyen] = useState(null)
  const [loading, setLoading] = useState(true)
  const timerRef              = useRef(null)

  useEffect(() => {
    const adminData   = localStorage.getItem('admin_data')
    const citoyenData = localStorage.getItem('citoyen_data')
    if (adminData)   setAdmin(JSON.parse(adminData))
    if (citoyenData) setCitoyen(JSON.parse(citoyenData))
    setLoading(false)
  }, [])

  // Déconnexion automatique
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (admin || citoyen) {
      timerRef.current = setTimeout(() => {
        logoutAdmin()
        logoutCitoyen()
        alert('Vous avez été déconnecté pour inactivité.')
      }, TIMEOUT_DURATION)
    }
  }, [admin, citoyen])

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    events.forEach(e => window.addEventListener(e, resetTimer))
    resetTimer()
    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer))
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [resetTimer])

  const loginAdmin = (token, adminData) => {
    localStorage.setItem('admin_token', token)
    localStorage.setItem('admin_data', JSON.stringify(adminData))
    setAdmin(adminData)
  }

  const loginCitoyen = (token, citoyenData) => {
    localStorage.setItem('citoyen_token', token)
    localStorage.setItem('citoyen_data', JSON.stringify(citoyenData))
    setCitoyen(citoyenData)
  }

  const logoutAdmin = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_data')
    setAdmin(null)
  }

  const logoutCitoyen = () => {
    localStorage.removeItem('citoyen_token')
    localStorage.removeItem('citoyen_data')
    setCitoyen(null)
  }

  return (
    <AuthContext.Provider value={{
      admin, citoyen, loading,
      loginAdmin, loginCitoyen,
      logoutAdmin, logoutCitoyen,
      isAdminConnected:   !!admin,
      isCitoyenConnected: !!citoyen,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}