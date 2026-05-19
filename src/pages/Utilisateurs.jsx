import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function Utilisateurs() {
  const [admins, setAdmins]       = useState([])
  const [citoyens, setCitoyens]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [onglet, setOnglet]       = useState('citoyens')
  const [modal, setModal]         = useState(null) // 'creer' | 'editer'
  const [selected, setSelected]   = useState(null)
  const [erreurs, setErreurs]     = useState({})
  const [form, setForm]           = useState({ nom: '', prenom: '', email: '', password: '' })

  useEffect(() => { charger() }, [])

  const charger = () => {
    setLoading(true)
    api.get('/admin/utilisateurs')
      .then(res => {
        setAdmins(res.data.admins)
        setCitoyens(res.data.citoyens)
      })
      .finally(() => setLoading(false))
  }

  const ouvrirCreer = () => {
    setForm({ nom: '', prenom: '', email: '', password: '' })
    setErreurs({})
    setSelected(null)
    setModal('creer')
  }

  const ouvrirEditer = (admin) => {
    setForm({ nom: admin.nom, prenom: admin.prenom, email: admin.email, password: '' })
    setErreurs({})
    setSelected(admin)
    setModal('editer')
  }

  const soumettre = async (e) => {
    e.preventDefault()
    setErreurs({})
    try {
      if (modal === 'creer') {
        await api.post('/admin/utilisateurs/admins', form)
      } else {
        await api.put(`/admin/utilisateurs/admins/${selected.id}`, form)
      }
      setModal(null)
      charger()
    } catch (err) {
      if (err.response?.status === 422) setErreurs(err.response.data.errors || {})
    }
  }

  const supprimerAdmin = async (id) => {
    if (!confirm('Supprimer cet administrateur ?')) return
    await api.delete(`/admin/utilisateurs/admins/${id}`)
    charger()
  }

  const supprimerCitoyen = async (id) => {
    if (!confirm('Supprimer ce citoyen ?')) return
    await api.delete(`/admin/utilisateurs/citoyens/${id}`)
    charger()
  }

  const toggleCitoyen = async (id) => {
    await api.patch(`/admin/utilisateurs/citoyens/${id}/toggle`)
    charger()
  }

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Onglets */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>
            Gestion des utilisateurs
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {admins.length} administrateur(s) · {citoyens.length} citoyen(s)
          </p>
        </div>
        {onglet === 'admins' && (
          <button onClick={ouvrirCreer} className="btn btn-primary" style={{ fontSize: 13 }}>
            + Nouvel administrateur
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
        {[
          { id: 'citoyens', label: `Citoyens (${citoyens.length})` },
          { id: 'admins',   label: `Administrateurs (${admins.length})` },
        ].map(t => (
          <button key={t.id} onClick={() => setOnglet(t.id)}
            style={{ padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-body)',
              background: onglet === t.id ? 'var(--navy)' : 'transparent',
              color: onglet === t.id ? '#fff' : 'var(--text-secondary)',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {loading && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Chargement...</p>}

      {/* ── CITOYENS ────────────────────────────────────────── */}
      {!loading && onglet === 'citoyens' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {citoyens.length === 0 && (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Aucun citoyen inscrit.</p>
          )}
          {citoyens.map(c => (
            <div key={c.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-sm)' }}>
              {/* Avatar */}
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: c.actif ? 'var(--blue)' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                {c.prenom?.[0]}{c.nom?.[0]}
              </div>
              {/* Infos */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--navy)' }}>{c.prenom} {c.nom}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.email} · {c.contact}</div>
              </div>
              {/* Statut */}
              <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                background: c.actif ? '#D1FAE5' : '#F3F4F6',
                color: c.actif ? '#065F46' : '#6B7280',
              }}>
                {c.actif ? '● Actif' : '○ Désactivé'}
              </span>
              {/* Date */}
              <span style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                {new Date(c.created_at).toLocaleDateString('fr-FR')}
              </span>
              {/* Actions */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => toggleCitoyen(c.id)}
                  style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)',
                    background: c.actif ? '#FEF2F2' : '#F0FDF4',
                    color: c.actif ? '#DC2626' : '#059669',
                    borderColor: c.actif ? '#FECACA' : '#6EE7B7',
                  }}>
                  {c.actif ? 'Désactiver' : 'Activer'}
                </button>
                <button onClick={() => supprimerCitoyen(c.id)}
                  style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #FECACA', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: '#FEF2F2', color: '#DC2626', fontFamily: 'var(--font-body)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── ADMINS ──────────────────────────────────────────── */}
      {!loading && onglet === 'admins' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {admins.length === 0 && (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Aucun administrateur.</p>
          )}
          {admins.map(a => (
            <div key={a.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, var(--navy) 0%, var(--blue) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                {a.prenom?.[0]}{a.nom?.[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--navy)' }}>{a.prenom} {a.nom}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.email}</div>
              </div>
              <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: '#EFF6FF', color: '#1D4ED8' }}>
                Administrateur
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                {a.derniere_connexion
                  ? `Dernière connexion : ${new Date(a.derniere_connexion).toLocaleDateString('fr-FR')}`
                  : 'Jamais connecté'
                }
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => ouvrirEditer(a)}
                  style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: 'var(--surface-2)', color: 'var(--navy)', fontFamily: 'var(--font-body)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button onClick={() => supprimerAdmin(a.id)}
                  style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #FECACA', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: '#FEF2F2', color: '#DC2626', fontFamily: 'var(--font-body)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── MODAL ───────────────────────────────────────────── */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'var(--surface)', borderRadius: 20, padding: '2rem', width: '100%', maxWidth: 460, boxShadow: 'var(--shadow-xl)' }} className="animate-fadeUp">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--navy)' }}>
                {modal === 'creer' ? 'Nouvel administrateur' : 'Modifier l\'administrateur'}
              </h3>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 20 }}>×</button>
            </div>

            <form onSubmit={soumettre}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <div className="input-group">
                  <label>Nom</label>
                  <input value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} placeholder="Nom" required />
                  {erreurs.nom && <span className="error-msg">{erreurs.nom[0]}</span>}
                </div>
                <div className="input-group">
                  <label>Prénom</label>
                  <input value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} placeholder="Prénom" required />
                </div>
              </div>
              <div className="input-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Adresse e-mail" required />
                {erreurs.email && <span className="error-msg">{erreurs.email[0]}</span>}
              </div>
              <div className="input-group">
                <label>{modal === 'editer' ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe'}</label>
                <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Mot de passe" {...(modal === 'creer' ? { required: true } : {})} />
                {erreurs.password && <span className="error-msg">{erreurs.password[0]}</span>}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: 8 }}>
                <button type="button" onClick={() => setModal(null)} className="btn btn-ghost" style={{ flex: 1 }}>Annuler</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {modal === 'creer' ? 'Créer' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}