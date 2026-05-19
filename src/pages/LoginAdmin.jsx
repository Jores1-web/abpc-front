// ============================================================
// LoginAdmin.jsx — Redesign professionnel
// ============================================================
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function LoginAdmin() {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [erreur, setErreur]   = useState('')
  const [loading, setLoading] = useState(false)
  const { loginAdmin }        = useAuth()
  const navigate              = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setErreur('')
    try {
      const res = await api.post('/admin/login', form)
      loginAdmin(res.data.token, res.data.admin)
      navigate('/admin/dashboard')
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur de connexion.')
    } finally { setLoading(false) }
  }

  return (
    <div style={authStyle.page}>
      {/* Panneau gauche */}
      <div style={authStyle.panel}>
        <div style={authStyle.panelContent}>
          <Link to="/">
              <img 
                src="/logo-header.png" 
                alt="ABPC - Agence Béninoise de Protection Civile" 
                style={{ height: 48, width: 'auto', cursor: 'pointer' }} 
              />
          </Link>
          <div style={authStyle.panelDivider} />
          <p style={authStyle.panelDesc}>
            Plateforme sécurisée de gestion et de suivi des sinistres sur l'ensemble du territoire béninois.
          </p>
          <div style={authStyle.panelBadge}>🔒 Accès réservé aux agents ABPC</div>
        </div>
        {/* Cercles décoratifs */}
        <div style={{ position: 'absolute', bottom: -60, right: -60, width: 200, height: 200, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} />
        <div style={{ position: 'absolute', bottom: -30, right: -30, width: 120, height: 120, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)' }} />
      </div>

      {/* Panneau droit — Formulaire */}
      <div style={authStyle.form}>
        <div style={authStyle.formInner} className="animate-fadeUp">
          <div style={authStyle.formHeader}>
            <Link to="/" style={authStyle.backLink}>← Retour à l'accueil</Link>
            <h2 style={authStyle.formTitle}>Connexion administrateur</h2>
            <p style={authStyle.formSubtitle}>Entrez vos identifiants pour accéder au tableau de bord.</p>
          </div>

          {erreur && <div style={authStyle.alert}>{erreur}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Adresse email</label>
              <input type="email" placeholder="Votre adresse mail" value={form.email}
                onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <div className="input-group">
              <label>Mot de passe</label>
              <input type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm({...form, password: e.target.value})} required />
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}


// ============================================================
// Styles partagés Auth
// ============================================================
const authStyle = {
  // Layout 2 colonnes (LoginAdmin)
  page: { display: 'flex', minHeight: '100vh', fontFamily: 'var(--font-body)' },
  panel: { flex: '0 0 420px', background: 'linear-gradient(160deg, var(--navy) 0%, var(--navy-mid) 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem', position: 'relative', overflow: 'hidden' },
  panelContent: { position: 'relative', zIndex: 1 },
  panelLogo: { width: 56, height: 56, borderRadius: 16, background: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' },
  panelTitle: { fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 800, color: '#fff', lineHeight: 1, marginBottom: 8 },
  panelSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, marginBottom: '2rem' },
  panelDivider: { width: 40, height: 3, background: 'var(--accent)', borderRadius: 2, marginBottom: '2rem' },
  panelDesc: { fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '2rem' },
  panelBadge: { display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 14px', fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  form: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem', background: 'var(--bg)' },
  formInner: { width: '100%', maxWidth: 420 },
  formHeader: { marginBottom: '2rem' },
  backLink: { fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: '1.5rem' },
  formTitle: { fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--navy)', marginBottom: 8 },
  formSubtitle: { fontSize: 15, color: 'var(--text-secondary)' },

  // Layout centré (LoginCitoyen, RegisterCitoyen)
  centerPage: { minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', fontFamily: 'var(--font-body)' },
  centerCard: { background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', boxShadow: 'var(--shadow-xl)', width: '100%', maxWidth: 440, overflow: 'hidden' },
  centerHeader: { background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%)', padding: '2.5rem 2rem 2rem', textAlign: 'center' },
  centerLogo: { width: 52, height: 52, borderRadius: 14, background: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' },
  centerTitle: { fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 },
  centerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.55)' },
  centerFooter: { padding: '1.25rem 2rem 2rem', textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)', borderTop: '1px solid var(--border)' },
  centerDivider: { height: 1, background: 'var(--border)', margin: '1rem 0' },
  footerLink: { color: 'var(--blue)', fontWeight: 600 },

  // Alertes
  alert: { background: 'var(--danger-light)', color: 'var(--danger)', padding: '10px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500, margin: '0 2rem 1rem', border: '1px solid rgba(192,57,43,0.2)' },
}