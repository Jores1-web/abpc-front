import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function RegisterCitoyen() {
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', contact: '', password: '', password_confirmation: '' })
  const [erreurs, setErreurs]   = useState({})
  const [loading, setLoading]   = useState(false)
  const { loginCitoyen }        = useAuth()
  const navigate                = useNavigate()
 
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setErreurs({})
    try {
      const res = await api.post('/citoyen/register', form)
      loginCitoyen(res.data.token, res.data.citoyen)
      navigate('/mon-espace')
    } catch (err) {
      if (err.response?.status === 422) setErreurs(err.response.data.errors || {})
    } finally { setLoading(false) }
  }
 
  const field = (name, label, type = 'text', placeholder = '') => (
    <div className="input-group">
      <label>{label}</label>
      <input type={type} placeholder={placeholder} value={form[name]}
        onChange={e => setForm({...form, [name]: e.target.value})} required />
      {erreurs[name] && <span className="error-msg">{erreurs[name][0]}</span>}
    </div>
  )
 
  return (
    <div style={authStyle.centerPage}>
      <div style={{ ...authStyle.centerCard, maxWidth: 520 }} className="animate-fadeUp">
        <div style={authStyle.centerHeader}>
          <Link to="/">
              <img 
                src="/logo-header.png" 
                alt="ABPC - Agence Béninoise de Protection Civile" 
                style={{ height: 48, width: 'auto', cursor: 'pointer' }} 
              />
          </Link>
          <h1 style={authStyle.centerTitle}>Créer un compte</h1>
          <p style={authStyle.centerSubtitle}>Rejoignez la plateforme ABPC</p>
        </div>
 
        <form onSubmit={handleSubmit} style={{ padding: '0 2rem 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            {field('nom', 'Nom', 'text', 'Entrez votre nom')}
            {field('prenom', 'Prénom', 'text', 'Entrez votre prénom')}
          </div>
          {field('email', 'Adresse email', 'email', 'votre@email.com')}
          {field('contact', 'Contact téléphonique', 'text', '+229 01 XX XX XX XX')}
          {field('password', 'Mot de passe', 'password', 'Entrez votre mot de passe (Min. 8 caractères)')}
          {field('password_confirmation', 'Confirmer le mot de passe', 'password', 'Confirmez votre mot de passe')}
 
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Inscription...' : "Créer mon compte"}
          </button>
        </form>
 
        <div style={authStyle.centerFooter}>
          <p>Déjà un compte ? <Link to="/login" style={authStyle.footerLink}>Se connecter</Link></p>
          <div style={authStyle.centerDivider} />
          <Link to="/" style={{ color: 'var(--text-muted)', fontSize: 13 }}>← Retour à l'accueil</Link>
        </div>
      </div>
    </div>
  )
}

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