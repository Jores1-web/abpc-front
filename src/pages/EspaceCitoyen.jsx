import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function EspaceCitoyen() {
  const { citoyen, logoutCitoyen } = useAuth()
  const [sinistres, setSinistres] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/citoyen/mes-sinistres')
      .then(res => setSinistres(res.data))
      .finally(() => setLoading(false))
  }, [])
 
  const graviteInfo = {
    rouge:  { bg: '#FECACA', color: '#991B1B', dot: '#EF4444', label: 'Rouge' },
    orange: { bg: '#FED7AA', color: '#9A3412', dot: '#F97316', label: 'Orange' },
    jaune:  { bg: '#FEF08A', color: '#854D0E', dot: '#EAB308', label: 'Jaune' },
  }
  const statutInfo = {
    nouveau:  { bg: '#DBEAFE', color: '#1D4ED8', label: 'Nouveau', icon: '🆕' },
    en_cours: { bg: '#FED7AA', color: '#9A3412', label: 'En cours', icon: '⚡' },
    cloture:  { bg: '#D1FAE5', color: '#065F46', label: 'Clôturé',  icon: '✅' },
  }
 
  return (
    <div style={E.page}>
      {/* Header */}
      <header style={E.header}>
        <div style={E.headerInner}>
          <Link to="/">
              <img 
                src="/logo-header.png" 
                alt="ABPC - Agence Béninoise de Protection Civile" 
                style={{ height: 48, width: 'auto', cursor: 'pointer' }} 
              />
          </Link>
          <div style={E.headerRight}>
            <div style={E.userPill}>
              <div style={E.userAvatar}>{citoyen?.prenom?.[0]}</div>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>{citoyen?.prenom} {citoyen?.nom}</span>
            </div>
            <button onClick={logoutCitoyen} style={E.logoutBtn}>Déconnexion</button>
          </div>
        </div>
      </header>
 
      <main style={E.main}>
        {/* Hero personnel */}
        <div style={E.hero} className="animate-fadeUp">
          <div>
            <h1 style={E.heroTitle}>Bonjour, {citoyen?.prenom} 👋</h1>
            <p style={E.heroSubtitle}>Suivez vos signalements et contribuez à la sécurité de votre communauté.</p>
          </div>
          <Link to="/signaler" className="btn btn-danger btn-lg">
            + Nouveau signalement
          </Link>
        </div>
 
        {/* Stats rapides */}
        <div style={E.statsRow} className="stagger">
          {[
            { val: sinistres.length,                                              label: 'Total',       color: 'var(--blue)' },
            { val: sinistres.filter(s => s.statut === 'nouveau').length,          label: 'En attente',  color: '#2563EB' },
            { val: sinistres.filter(s => s.statut === 'en_cours').length,         label: 'En cours',    color: '#D97706' },
            { val: sinistres.filter(s => s.statut === 'cloture').length,          label: 'Clôturés',    color: 'var(--success)' },
          ].map((s, i) => (
            <div key={i} style={E.statCard}>
              <div style={{ ...E.statVal, color: s.color }}>{s.val}</div>
              <div style={E.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
 
        {/* Liste */}
        <h2 style={E.listTitle}>Mes signalements</h2>
 
        {loading && <div style={E.loading}>Chargement...</div>}
 
        {!loading && sinistres.length === 0 && (
          <div style={E.empty}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📭</div>
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)', marginBottom: 8 }}>Aucun signalement</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Vous n'avez pas encore fait de signalement.</p>
            <Link to="/signaler" className="btn btn-primary">Faire un signalement</Link>
          </div>
        )}
 
        <div style={E.cardGrid}>
          {sinistres.map(s => {
            const g  = graviteInfo[s.gravite]  || graviteInfo.jaune
            const st = statutInfo[s.statut]    || statutInfo.nouveau
            return (
              <div key={s.id} style={E.card} className="animate-fadeUp">
                <div style={{ ...E.cardGravBand, background: g.dot }} />
                <div style={E.cardBody}>
                  <div style={E.cardTop}>
                    <span style={E.cardRef}>{s.reference}</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <span style={{ ...E.badge, background: g.bg, color: g.color }}>● {g.label}</span>
                      <span style={{ ...E.badge, background: st.bg, color: st.color }}>{st.icon} {st.label}</span>
                    </div>
                  </div>
                  <div style={E.cardType}>{s.type_sinistre?.nom}</div>
                  <p style={E.cardDesc}>{s.description}</p>
                  {s.adresse && <div style={E.cardAdresse}>📍 {s.adresse}</div>}
                  <div style={E.cardFooter}>
                    <span style={E.cardDate}>
                      {new Date(s.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </span>
                    {s.photos?.length > 0 && (
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>📸 {s.photos.length} photo(s)</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
// ── Styles EspaceCitoyen ──────────────────────────────────────
const E = {
  page: { minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-body)' },
  header: { background: 'var(--navy)', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, zIndex: 10 },
  headerInner: { maxWidth: 1000, margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 },
  brand: { display: 'flex', alignItems: 'center', gap: 10 },
  brandIcon: { width: 34, height: 34, borderRadius: 8, background: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  userPill: { display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: '5px 12px' },
  userAvatar: { width: 26, height: 26, borderRadius: '50%', background: 'var(--blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' },
  logoutBtn: { background: 'transparent', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)' },
  main: { maxWidth: 1000, margin: '0 auto', padding: '2.5rem 2rem' },
  hero: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%)', borderRadius: 20, padding: '2rem 2.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' },
  heroTitle: { fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.6)', maxWidth: 400 },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' },
  statCard: { background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)', padding: '1.25rem', textAlign: 'center', boxShadow: 'var(--shadow-sm)' },
  statVal: { fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, lineHeight: 1, marginBottom: 4 },
  statLabel: { fontSize: 13, color: 'var(--text-muted)' },
  listTitle: { fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--navy)', marginBottom: '1rem' },
  loading: { textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' },
  empty: { textAlign: 'center', padding: '4rem', background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)' },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' },
  card: { background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden', display: 'flex', boxShadow: 'var(--shadow-sm)', transition: 'box-shadow 0.2s' },
  cardGravBand: { width: 4, flexShrink: 0 },
  cardBody: { flex: 1, padding: '1.25rem' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 8 },
  cardRef: { fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: 'var(--blue)', background: '#EFF6FF', padding: '3px 8px', borderRadius: 6 },
  badge: { fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 20, whiteSpace: 'nowrap' },
  cardType: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--navy)', marginBottom: 6 },
  cardDesc: { fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  cardAdresse: { fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 },
  cardFooter: { display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 10 },
  cardDate: { fontSize: 12, color: 'var(--text-muted)' },
}
 