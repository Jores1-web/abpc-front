import CarteSinistres from '../components/CarteSinistres'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Utilisateurs from './Utilisateurs'
import Parametres from './Parametres'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
 
export default function Dashboard() {
  const { admin, logoutAdmin }    = useAuth()
  const [stats, setStats]         = useState(null)
  const [sinistres, setSinistres] = useState([])
  const [loading, setLoading]     = useState(true)
  const [filtre, setFiltre]       = useState({ statut: '', gravite: '' })
  const [onglet, setOnglet]       = useState('liste')
  const [selected, setSelected]   = useState(null)
 
  useEffect(() => {
    Promise.all([
      api.get('/admin/dashboard/stats'),
      api.get('/admin/sinistres'),
    ]).then(([s, sin]) => {
      setStats(s.data)
      setSinistres(sin.data.data || [])
    }).finally(() => setLoading(false))
  }, [])
 
  const chargerSinistres = () => {
    const params = {}
    if (filtre.statut)  params.statut  = filtre.statut
    if (filtre.gravite) params.gravite = filtre.gravite
    api.get('/admin/sinistres', { params }).then(res => setSinistres(res.data.data || []))
  }
 
  const updateStatut = async (id, statut) => {
    await api.patch(`/admin/sinistres/${id}/statut`, { statut })
    chargerSinistres()
    api.get('/admin/dashboard/stats').then(res => setStats(res.data))
    setSelected(null)
  }
 
  const graviteInfo = {
    rouge:  { bg: '#FECACA', color: '#991B1B', border: '#EF4444', dot: '#EF4444', label: 'Rouge' },
    orange: { bg: '#FED7AA', color: '#9A3412', border: '#F97316', dot: '#F97316', label: 'Orange' },
    jaune:  { bg: '#FEF08A', color: '#854D0E', border: '#EAB308', dot: '#EAB308', label: 'Jaune' },
  }
 
  const statutInfo = {
    nouveau:  { bg: '#DBEAFE', color: '#1D4ED8', label: 'Nouveau' },
    en_cours: { bg: '#FED7AA', color: '#9A3412', label: 'En cours' },
    cloture:  { bg: '#D1FAE5', color: '#065F46', label: 'Clôturé' },
  }
 
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', fontFamily: 'var(--font-body)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: '3px solid var(--border)', borderTopColor: 'var(--blue)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ color: 'var(--text-muted)' }}>Chargement du tableau de bord...</p>
      </div>
    </div>
  )
 
  return (
    <div style={D.page}>
      {/* ── SIDEBAR ─────────────────────────────────────────── */}
    <aside style={D.sidebar}>
      <div style={D.sidebarTop}>
        <div style={D.sidebarLogo}>
          <Link to="/">
            <img 
              src="/logo-header.png" 
              alt="ABPC" 
              style={{ height: 32, maxWidth: '200px', width: 'auto', cursor: 'pointer' }} 
            />
          </Link>
        </div>

        <div style={D.navSection}>
          <div style={D.navSectionLabel}>Principal</div>
          <nav style={D.nav}>
            {[
              {
                id: 'liste', label: 'Signalements',
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              },
              {
                id: 'carte', label: 'Carte interactive',
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
              },
              {
                id: 'stats', label: 'Statistiques',
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>
              },
            ].map(item => (
              <button key={item.id} onClick={() => setOnglet(item.id)}
                style={{ ...D.navItem, ...(onglet === item.id ? D.navItemActive : {}) }}>
                <span style={{ opacity: onglet === item.id ? 1 : 0.6 }}>{item.icon}</span>
                <span>{item.label}</span>
                {onglet === item.id && (
                  <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-light)' }} />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div style={D.navSection}>
          <div style={D.navSectionLabel}>Gestion</div>
          <nav style={D.nav}>
            {[
              {
                id: 'utilisateurs', label: 'Utilisateurs',
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
              },

              { id: 'parametres', label: 'Paramètres',
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
              },
              
            ].map(item => (
              <button key={item.id} onClick={() => setOnglet(item.id)}
                style={{ ...D.navItem, ...(onglet === item.id ? D.navItemActive : {}) }}>
                <span style={{ opacity: onglet === item.id ? 1 : 0.6 }}>{item.icon}</span>
                <span>{item.label}</span>
                {onglet === item.id && (
                  <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-light)' }} />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div style={D.sidebarBottom}>
        {/* Carte admin */}
        <div style={D.adminCard}>
          <div style={D.adminAvatar}>
            {admin?.prenom?.[0]}{admin?.nom?.[0]}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={D.adminName}>{admin?.prenom} {admin?.nom}</div>
            <div style={D.adminRole}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80', display: 'inline-block', marginRight: 5 }} />
              En ligne
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0.5rem 0' }} />

        <button onClick={logoutAdmin} style={D.logoutBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Déconnexion
        </button>
      </div>
    </aside>
 
      {/* ── CONTENU PRINCIPAL ──────────────────────────────── */}
      <main style={D.main}>
        {/* Métriques */}
        {stats && (
          <div style={D.metricsGrid} className="stagger">
            {[
              {
                val: stats.total,
                label: 'Total signalements',
                color: '#1E56A0',
                bg: 'linear-gradient(135deg, #1E56A0 0%, #2E73CC 100%)',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                )
              },
              {
                val: stats.gravites.rouge,
                label: 'Critiques',
                color: '#DC2626',
                bg: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                )
              },
              {
                val: stats.statuts.nouveau,
                label: 'Nouveaux',
                color: '#2563EB',
                bg: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="16"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                  </svg>
                )
              },
              {
                val: stats.statuts.en_cours,
                label: 'En traitement',
                color: '#D97706',
                bg: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                    <polyline points="23 4 23 10 17 10"/>
                    <polyline points="1 20 1 14 7 14"/>
                    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
                  </svg>
                )
              },
              {
                val: stats.statuts.cloture,
                label: 'Clôturés',
                color: '#059669',
                bg: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                )
              },
            ].map((m, i) => (
              <div key={i} style={D.metricCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ ...D.metricIcon, background: m.bg }}>{m.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'right' }}>
                    {m.label}
                  </div>
                </div>
                <div style={{ ...D.metricVal, color: m.color }}>{m.val}</div>
                <div style={{ height: 3, background: 'var(--border)', borderRadius: 2, marginTop: 12, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: stats.total > 0 ? `${(m.val / stats.total) * 100}%` : '0%', background: m.bg, borderRadius: 2, transition: 'width 1s ease' }} />
                </div>
              </div>
            ))}
          </div>
        )}
 
        {/* ── LISTE ─────────────────────────────────────────── */}
        {onglet === 'liste' && (
          <div className="animate-fadeIn">
            <style>{`
              @keyframes pulse-border {
                0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4), var(--shadow-sm); }
                50% { box-shadow: 0 0 0 6px rgba(239,68,68,0), var(--shadow-sm); }
              }
              @keyframes pulse-border-blue {
                0%, 100% { box-shadow: 0 0 0 0 rgba(37,99,235,0.4), var(--shadow-sm); }
                50% { box-shadow: 0 0 0 6px rgba(37,99,235,0), var(--shadow-sm); }
              }
              .sin-card-nouveau { animation: pulse-border-blue 2s ease-in-out infinite; }
              .sin-card-rouge-nouveau { animation: pulse-border 2s ease-in-out infinite; }
              .sin-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md) !important; }
            `}</style>

            <div style={D.sectionHeader}>
              <div>
                <h2 style={{ ...D.sectionTitle, marginBottom: 4 }}>Signalements</h2>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  {sinistres.filter(s => s.statut === 'nouveau').length} nouveau(x) · {sinistres.length} au total
                </p>
              </div>
              <div style={D.filtres}>
                <select value={filtre.statut} onChange={e => setFiltre({...filtre, statut: e.target.value})} style={D.select}>
                  <option value="">Tous statuts</option>
                  <option value="nouveau">Nouveau</option>
                  <option value="en_cours">En cours</option>
                  <option value="cloture">Clôturé</option>
                </select>
                <select value={filtre.gravite} onChange={e => setFiltre({...filtre, gravite: e.target.value})} style={D.select}>
                  <option value="">Toutes gravités</option>
                  <option value="rouge">Rouge</option>
                  <option value="orange">Orange</option>
                  <option value="jaune">Jaune</option>
                </select>
                <button onClick={chargerSinistres} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>
                  Filtrer
                </button>
              </div>
            </div>

            {sinistres.length === 0 && (
              <div style={D.empty}>
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--border-dark)" strokeWidth="1.5" style={{ marginBottom: 16 }}>
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
                <p style={{ color: 'var(--text-secondary)', fontSize: 16, fontWeight: 600 }}>Aucun signalement trouvé</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>Les signalements des citoyens apparaîtront ici.</p>
              </div>
            )}

            <div style={D.cardGrid}>
              {sinistres.map(s => {
                const g  = graviteInfo[s.gravite]  || graviteInfo.jaune
                const st = statutInfo[s.statut]    || statutInfo.nouveau
                const isNew = s.statut === 'nouveau'
                const isRougeNew = s.statut === 'nouveau' && s.gravite === 'rouge'
                const cardClass = `sin-card ${isRougeNew ? 'sin-card-rouge-nouveau' : isNew ? 'sin-card-nouveau' : ''}`

                return (
                  <div key={s.id}
                    className={cardClass}
                    style={D.sinCard}
                    onClick={() => setSelected(selected?.id === s.id ? null : s)}
                  >
                    {/* Bande gravité */}
                    <div style={{ ...D.gravBand, background: g.dot }} />

                    <div style={D.sinContent}>
                      {/* Badge NOUVEAU clignotant */}
                      {isNew && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 6 }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            background: isRougeNew ? '#FEF2F2' : '#EFF6FF',
                            color: isRougeNew ? '#DC2626' : '#2563EB',
                            fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                            border: `1px solid ${isRougeNew ? '#FECACA' : '#BFDBFE'}`,
                            animation: 'fadeIn 0.3s ease',
                          }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: isRougeNew ? '#DC2626' : '#2563EB', animation: 'pulse-border 1.5s infinite' }} />
                            NOUVEAU
                          </span>
                        </div>
                      )}

                      <div style={D.sinTop}>
                        <span style={D.sinRef}>{s.reference}</span>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          <span style={{ ...D.badge, background: g.bg, color: g.color, border: `1px solid ${g.border}` }}>
                            ● {g.label}
                          </span>
                          <span style={{ ...D.badge, background: st.bg, color: st.color }}>
                            {st.label}
                          </span>
                        </div>
                      </div>

                      {/* Type avec icône */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: g.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={g.color} strokeWidth="2.5">
                            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                          </svg>
                        </div>
                        <div style={D.sinType}>{s.type_sinistre?.nom || '—'}</div>
                      </div>

                      <p style={D.sinDesc}>{s.description}</p>

                      {/* Infos supplémentaires */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          {s.prenom_citoyen} {s.nom_citoyen}
                          {s.contact_citoyen && <span style={{ color: 'var(--text-muted)', marginLeft: 4 }}>· {s.contact_citoyen}</span>}
                        </div>
                        {s.adresse && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            {s.adresse}
                          </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          {new Date(s.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      {/* Photos */}
                      {s.photos?.length > 0 && (
                        <div style={{ marginBottom: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--blue)', marginBottom: 8, fontWeight: 600 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                            {s.photos.length} photo(s) jointe(s)
                          </div>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {s.photos.map((photo, j) => (
                              <a key={j} href={`http://127.0.0.1:8000/storage/${photo.chemin}`} target="_blank" rel="noopener noreferrer">
                                <img
                                  src={`http://127.0.0.1:8000/storage/${photo.chemin}`}
                                  alt={photo.nom_original}
                                  style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, border: '2px solid var(--border)', cursor: 'pointer', transition: 'transform 0.2s' }}
                                  onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
                                  onMouseOut={e => e.target.style.transform = 'scale(1)'}
                                />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Panneau d'actions */}
                      {selected?.id === s.id && (
                        <div style={D.actionPanel} className="animate-fadeIn" onClick={e => e.stopPropagation()}>
                          <div style={D.actionTitle}>Actions disponibles</div>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {s.statut !== 'en_cours' && s.statut !== 'cloture' && (
                              <button onClick={() => updateStatut(s.id, 'en_cours')}
                                style={{ ...D.actionBtn, background: '#FFFBEB', color: '#D97706', borderColor: '#FCD34D' }}>
                                ⚡ Prendre en charge
                              </button>
                            )}
                            {s.statut !== 'cloture' && (
                              <button onClick={() => updateStatut(s.id, 'cloture')}
                                style={{ ...D.actionBtn, background: '#F0FDF4', color: '#065F46', borderColor: '#6EE7B7' }}>
                                ✅ Clôturer
                              </button>
                            )}
                            {s.statut === 'cloture' && (
                              <span style={{ fontSize: 13, color: 'var(--text-muted)', padding: '6px 0' }}>
                                ✅ Ce sinistre est clôturé.
                              </span>
                            )}
                          </div>
                          {s.latitude && (
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
                              GPS : {parseFloat(s.latitude).toFixed(5)}°, {parseFloat(s.longitude).toFixed(5)}°
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        {/* ── CARTE ─────────────────────────────────────────── */}
        {onglet === 'carte' && (
          <div className="animate-fadeIn">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={D.sectionTitle}>Carte des sinistres</h2>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#EF4444' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>Rouge</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#F97316' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>Orange</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#EAB308' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>Jaune</span>
                </div>
              </div>
            </div>
            <CarteSinistres sinistres={sinistres} />
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 12, textAlign: 'center' }}>
              {sinistres.filter(s => s.latitude && s.longitude).length} sinistre(s) géolocalisé(s) affiché(s)
            </p>
          </div>
        )}
 
        {/* ── STATS ─────────────────────────────────────────── */}
        {onglet === 'stats' && stats && (
          <div className="animate-fadeIn">
            <h2 style={D.sectionTitle}>Statistiques</h2>
            <div style={D.statsGrid}>
              <div style={D.chartCard}>
                <h3 style={D.chartTitle}>Répartition par gravité</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={[
                      { name: 'Rouge',  value: stats.gravites.rouge },
                      { name: 'Orange', value: stats.gravites.orange },
                      { name: 'Jaune',  value: stats.gravites.jaune },
                    ]} cx="50%" cy="50%" outerRadius={80} innerRadius={40} dataKey="value" label>
                      {['#EF4444','#F97316','#EAB308'].map((c,i) => <Cell key={i} fill={c} />)}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
 
              <div style={D.chartCard}>
                <h3 style={D.chartTitle}>Sinistres par type</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stats.par_type} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="type" tick={{ fontSize: 11 }} width={100} />
                    <Tooltip />
                    <Bar dataKey="total" fill="var(--blue)" radius={[0,4,4,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
 
              <div style={{ ...D.chartCard, gridColumn: '1 / -1' }}>
                <h3 style={D.chartTitle}>Évolution des 30 derniers jours</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={stats.evolution}>
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="total" fill="var(--success)" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
 
              {/* Résumé statuts */}
              <div style={D.chartCard}>
                <h3 style={D.chartTitle}>Statuts</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
                  {[
                    { label: 'Nouveaux',    val: stats.statuts.nouveau,  color: '#2563EB', total: stats.total },
                    { label: 'En cours',    val: stats.statuts.en_cours, color: '#D97706', total: stats.total },
                    { label: 'Clôturés',    val: stats.statuts.cloture,  color: '#059669', total: stats.total },
                  ].map((s, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
                        <span style={{ fontWeight: 700, color: 'var(--navy)' }}>{s.val}</span>
                      </div>
                      <div style={{ height: 8, background: 'var(--surface-2)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${s.total > 0 ? (s.val / s.total * 100) : 0}%`, background: s.color, borderRadius: 4, transition: 'width 1s ease' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {onglet === 'utilisateurs' && (
          <div className="animate-fadeIn">
            <Utilisateurs />
          </div>
        )}

        {onglet === 'parametres' && (
          <div className="animate-fadeIn">
            <Parametres />
          </div>
        )}
      </main>
    </div>
  )
}
 
// ── Styles Dashboard ──────────────────────────────────────────
const D = {
  page: { display: 'flex', minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-body)' },
  sidebar: { width: 240, background: 'var(--navy)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'sticky', top: 0, height: '100vh', flexShrink: 0 },
  sidebarTop: { padding: '1.5rem 1rem' },
  sidebarLogo: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2rem', padding: '0 0.5rem' },
  logoIcon: { width: 38, height: 38, borderRadius: 10, background: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  logoName: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: '#fff' },
  logoSub: { fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' },
  nav: { display: 'flex', flexDirection: 'column', gap: 4 },
  navItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.55)', fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left', fontFamily: 'var(--font-body)', width: '100%' },
  navItemActive: { background: 'rgba(255,255,255,0.1)', color: '#fff' },
  sidebarBottom: { padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' },
  adminCard: { display: 'flex', alignItems: 'center', gap: 10, padding: '0.75rem', marginBottom: '0.75rem' },
  adminAvatar: { width: 36, height: 36, borderRadius: '50%', background: 'var(--blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 },
  adminName: { fontSize: 13, fontWeight: 600, color: '#fff' },
  adminRole: { fontSize: 11, color: 'rgba(255,255,255,0.4)' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: 13, cursor: 'pointer', width: '100%', fontFamily: 'var(--font-body)' },
  main: { flex: 1, padding: '2rem', overflow: 'auto' },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '2rem' },
  metricCard: { background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 4 },
  metricIcon: { 
  width: 42, height: 42, borderRadius: 12, 
  display: 'flex', alignItems: 'center', justifyContent: 'center', 
  flexShrink: 0,
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
},
metricVal: { 
  fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, lineHeight: 1 
},
  metricLabel: { fontSize: 12, color: 'var(--text-muted)' },
  sectionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' },
  sectionTitle: { fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--navy)', marginBottom: '1.25rem' },
  filtres: { display: 'flex', gap: '0.75rem', alignItems: 'center' },
  select: { padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, background: 'var(--surface)', color: 'var(--text-primary)', outline: 'none' },
  empty: { textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' },
  sinCard: { background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s, transform 0.15s', display: 'flex', boxShadow: 'var(--shadow-sm)' },
  gravBand: { width: 4, flexShrink: 0 },
  sinContent: { flex: 1, padding: '1.25rem' },
  sinTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, gap: 8 },
  sinRef: { fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: 'var(--blue)', background: '#EFF6FF', padding: '3px 8px', borderRadius: 6 },
  badge: { fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 20, whiteSpace: 'nowrap' },
  sinType: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--navy)', marginBottom: 6 },
  sinDesc: { fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  sinMeta: { display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' },
  actionPanel: { marginTop: 12, padding: 12, background: 'var(--surface-2)', borderRadius: 10, border: '1px solid var(--border)' },
  actionTitle: { fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 },
  actionBtn: { padding: '6px 14px', borderRadius: 8, border: '1px solid', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' },
  statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
  chartCard: { background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' },
  chartTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--navy)', marginBottom: '1rem' },
}