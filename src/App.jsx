import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import Accueil from './pages/Accueil'
import Signalement from './pages/Signalement'
import LoginCitoyen from './pages/LoginCitoyen'
import RegisterCitoyen from './pages/RegisterCitoyen'
import EspaceCitoyen from './pages/EspaceCitoyen'
import LoginAdmin from './pages/LoginAdmin'
import Dashboard from './pages/Dashboard'

function AdminRoute({ children }) {
  const { isAdminConnected, loading } = useAuth()
  if (loading) return <div>Chargement...</div>
  return isAdminConnected ? children : <Navigate to="/admin/login" />
}

function CitoyenRoute({ children }) {
  const { isCitoyenConnected, loading } = useAuth()
  if (loading) return <div>Chargement...</div>
  return isCitoyenConnected ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <Routes>
      <Route path="/"           element={<Accueil />} />
      <Route path="/signaler"   element={<Signalement />} />
      <Route path="/login"      element={<LoginCitoyen />} />
      <Route path="/register"   element={<RegisterCitoyen />} />

      <Route path="/mon-espace" element={
        <CitoyenRoute><EspaceCitoyen /></CitoyenRoute>
      } />

      <Route path="/admin/login" element={<LoginAdmin />} />
      <Route path="/admin/dashboard" element={
        <AdminRoute><Dashboard /></AdminRoute>
      } />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}