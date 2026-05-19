import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Parametres() {
  const { admin, loginAdmin } = useAuth()

  const [form, setForm] = useState({
    nom:             admin?.nom     || '',
    prenom:          admin?.prenom  || '',
    email:           admin?.email   || '',
    password_actuel: '',
    password:        '',
    password_confirmation: '',
  })

  const [showPasswords, setShowPasswords] = useState({
    actuel: false, nouveau: false, confirm: false
  })

  const [loading, setLoading]   = useState(false)
  const [succes, setSucces]     = useState('')
  const [erreurs, setErreurs]   = useState({})

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSucces('')
    setErreurs({})

    try {
      const res = await api.put('/admin/profil', form)
      setSucces(res.data.message)
      // Mettre à jour les infos admin dans le contexte
      const token = localStorage.getItem('admin_token')
      loginAdmin(token, res.data.admin)
      // Réinitialiser les champs mot de passe
      setForm(prev => ({ ...prev, password_actuel: '', password: '', password_confirmation: '' }))
    } catch (err) {
      if (err.response?.status === 422) {
        setErreurs(err.response.data.errors || {})
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleShow = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>
          Paramètres du compte
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Modifiez vos informations personnelles et votre mot de passe.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>

        {/* ── Informations personnelles ── */}
        <div style={S.card}>
          <div style={S.cardHeader}>
            <div style={S.cardIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <h3 style={S.cardTitle}>Informations personnelles</h3>
              <p style={S.cardSubtitle}>Nom, prénom et adresse email</p>
            </div>
          </div>

          {succes && (
            <div style={S.succes}>{succes}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              <div className="input-group">
                <label>Nom</label>
                <input name="nom" value={form.nom} onChange={handleChange} required />
                {erreurs.nom && <span className="error-msg">{erreurs.nom[0]}</span>}
              </div>
              <div className="input-group">
                <label>Prénom</label>
                <input name="prenom" value={form.prenom} onChange={handleChange} required />
              </div>
            </div>
            <div className="input-group">
              <label>Adresse email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
              {erreurs.email && <span className="error-msg">{erreurs.email[0]}</span>}
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </form>
        </div>

        {/* ── Changer le mot de passe ── */}
        <div style={S.card}>
          <div style={S.cardHeader}>
            <div style={{ ...S.cardIcon, background: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
            </div>
            <div>
              <h3 style={S.cardTitle}>Mot de passe</h3>
              <p style={S.cardSubtitle}>Changez votre mot de passe de connexion</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Mot de passe actuel */}
            <div className="input-group">
              <label>Mot de passe actuel</label>
              <div style={S.passwordField}>
                <input
                  type={showPasswords.actuel ? 'text' : 'password'}
                  name="password_actuel"
                  value={form.password_actuel}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{ border: 'none', outline: 'none', flex: 1, fontSize: 14, background: 'transparent' }}
                />
                <button type="button" onClick={() => toggleShow('actuel')} style={S.eyeBtn}>
                  {showPasswords.actuel
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {erreurs.password_actuel && <span className="error-msg">{erreurs.password_actuel[0]}</span>}
            </div>

            {/* Nouveau mot de passe */}
            <div className="input-group">
              <label>Nouveau mot de passe</label>
              <div style={S.passwordField}>
                <input
                  type={showPasswords.nouveau ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 caractères"
                  style={{ border: 'none', outline: 'none', flex: 1, fontSize: 14, background: 'transparent' }}
                />
                <button type="button" onClick={() => toggleShow('nouveau')} style={S.eyeBtn}>
                  {showPasswords.nouveau
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {erreurs.password && <span className="error-msg">{erreurs.password[0]}</span>}
            </div>

            {/* Confirmation */}
            <div className="input-group">
              <label>Confirmer le nouveau mot de passe</label>
              <div style={S.passwordField}>
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  name="password_confirmation"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{ border: 'none', outline: 'none', flex: 1, fontSize: 14, background: 'transparent' }}
                />
                <button type="button" onClick={() => toggleShow('confirm')} style={S.eyeBtn}>
                  {showPasswords.confirm
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-full" disabled={loading}
              style={{ marginTop: 8, background: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)', color: '#fff', padding: '10px 20px', borderRadius: 8, border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              {loading ? 'Enregistrement...' : 'Changer le mot de passe'}
            </button>
          </form>
        </div>

        {/* ── Informations du compte ── */}
        <div style={{ ...S.card, gridColumn: '1 / -1' }}>
          <div style={S.cardHeader}>
            <div style={{ ...S.cardIcon, background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div>
              <h3 style={S.cardTitle}>Informations du compte</h3>
              <p style={S.cardSubtitle}>Détails de votre compte administrateur</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {[
              { label: 'Identifiant', val: `#${admin?.id}` },
              { label: 'Rôle', val: admin?.role === 'super_admin' ? '⭐ Super Administrateur' : 'Administrateur' },
              { label: 'Membre depuis', val: admin?.created_at ? new Date(admin.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '-                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        ' },
            ].map((info, i) => (
              <div key={i} style={{ background: 'var(--surface-2)', borderRadius: 12, padding: '1rem' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{info.label}</div>
                <div style={{ fontWeight: 600, color: 'var(--navy)', fontSize: 14 }}>{info.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const S = {
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem', boxShadow: 'var(--shadow-sm)' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' },
  cardIcon: { width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, var(--navy) 0%, var(--blue) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cardTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--navy)', marginBottom: 2 },
  cardSubtitle: { fontSize: 12, color: 'var(--text-muted)' },
  succes: { background: '#D1FAE5', color: '#065F46', padding: '10px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500, marginBottom: '1rem', border: '1px solid #6EE7B7' },
  passwordField: { display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: 8, padding: '0 12px', background: 'var(--surface)', transition: 'border-color 0.2s' },
  eyeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '8px 0 8px 8px', display: 'flex', alignItems: 'center' },
}