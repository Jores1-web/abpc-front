import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Accueil() {

  const { isCitoyenConnected, isAdminConnected } = useAuth()

  const [menuOpen, setMenuOpen] = useState(false)

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }

  const hero = {
  section: {
    background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 60%, #1A4A8A 100%)',
    padding: isMobile ? '3rem 1.25rem' : '4rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '3rem',
    position: 'relative',
    overflow: 'hidden',
    flexWrap: 'wrap',
    flexDirection: isMobile ? 'column' : 'row',
    textAlign: isMobile ? 'center' : 'left',
  },
  content: { flex: '1 1 280px', maxWidth: 560, position: 'relative', zIndex: 1 },
  badge: { display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: '6px 14px', fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem' },
  title: { fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: '1.25rem', letterSpacing: '-0.02em' },
  titleAccent: { color: 'var(--accent-light)' },
  subtitle: { color: 'rgba(255,255,255,0.65)', fontSize: 15, lineHeight: 1.7, marginBottom: '2rem', maxWidth: 460, margin: isMobile ? '0 auto 2rem' : '0 0 2rem' },
  actions: { display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem', justifyContent: isMobile ? 'center' : 'flex-start' },
  stats: { display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start' },
  stat: { textAlign: 'center' },
  statVal: { fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: '#fff' },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  visual: { flex: '1 1 260px', maxWidth: isMobile ? '100%' : 320, display: isMobile ? 'none' : 'block' },
  visualCard: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, overflow: 'hidden' },
  visualHeader: { background: 'rgba(0,0,0,0.2)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 6 },
  visualRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  visualLabel: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  visualVal: { fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-display)' },
  visualRef: { marginTop: 16, textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' },
  pattern: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', pointerEvents: 'none' },
  circle: { position: 'absolute', right: '-60px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)' },
}
  return () => window.removeEventListener('resize', handleResize)
}, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-body)' }}>

      {/* ── NAVBAR ───────────────────────────────────────────── */}
      <nav style={nav.bar}>
        <div style={nav.inner}>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <img src="/logo-header.png" alt="ABPC" style={{ height: 44, width: 'auto', cursor: 'pointer' }} />
          </Link>

          {/* Burger button — visible uniquement sur mobile */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={nav.burger}>
            {menuOpen
              ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            }
          </button>

          {/* Liens desktop — cachés sur mobile */}
          {!isMobile && (
            <div style={nav.links}>
              {isCitoyenConnected
                ? <Link to="/mon-espace" style={nav.ghostBtn}>Mon espace</Link>
                : <>
                    <Link to="/login" style={nav.link}>Connexion</Link>
                    <Link to="/register" style={nav.primaryBtn}>S'inscrire</Link>
                  </>
              }
              {isAdminConnected &&
                <Link to="/admin/dashboard" style={nav.primaryBtn}>Dashboard</Link>
              }
            </div>
          )}
        </div>

        {/* Menu mobile déroulant */}
        {isMobile && menuOpen && (
          <div style={nav.mobileMenu}>
            {isCitoyenConnected
              ? <Link to="/mon-espace" style={nav.mobileLink} onClick={() => setMenuOpen(false)}>Mon espace</Link>
              : <>
                  <Link to="/login" style={nav.mobileLink} onClick={() => setMenuOpen(false)}>Connexion</Link>
                  <Link to="/register" style={nav.mobilePrimary} onClick={() => setMenuOpen(false)}>S'inscrire</Link>
                </>
            }
            {isAdminConnected &&
              <Link to="/admin/dashboard" style={nav.mobilePrimary} onClick={() => setMenuOpen(false)}>Dashboard</Link>
            }
            <Link to="/signaler" style={nav.mobileDanger} onClick={() => setMenuOpen(false)}>🚨 Signaler un sinistre</Link>
          </div>
        )}
      </nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={hero.section}>
        <div style={hero.pattern} aria-hidden="true">
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ ...hero.circle, width: `${120 + i*80}px`, height: `${120 + i*80}px`, opacity: 0.03 + i*0.015 }} />
          ))}
        </div>

        <div
          style={{
            ...hero.content,
            textAlign: isMobile ? 'center' : 'left',
            alignItems: isMobile ? 'center' : 'flex-start',
          }}
          className="animate-fadeUp"
        >
          <div style={hero.badge}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ADE80', display: 'inline-block' }} />
            Système opérationnel
          </div>
          <h1 style={hero.title}>
            Signalez un sinistre<br />
            <span style={hero.titleAccent}>en temps réel</span>
          </h1>
          <p style={hero.subtitle} className="hero-subtitle">
            L'Agence Béninoise de Protection Civile vous offre un outil numérique
            pour signaler tout incident et coordonner les interventions d'urgence
            sur l'ensemble du territoire béninois.
          </p>
          <div
            style={{
              ...hero.actions,
              justifyContent: isMobile ? 'center' : 'flex-start',
            }}
          >
            <Link to="/signaler" className="btn btn-danger btn-lg" style={{ width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              </svg>
              Signaler un sinistre
            </Link>

            {!isCitoyenConnected && (
              <Link to="/register" className="btn btn-primary btn-lg" style={{ width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}>
                Créer un compte
              </Link>
            )}
          </div>

          <div
            style={{
              ...hero.stats,
              justifyContent: isMobile ? 'center' : 'flex-start',
            }}
          >
            {[
              { val: '+ 1 284', label: 'Signalements reçus' },
              { val: '+ 842', label: 'Interventions effectuées' },
              { val: '97%', label: 'Taux de traitement' },
            ].map((s, i) => (
              <div key={i} style={hero.stat}>
                <div style={hero.statVal}>{s.val}</div>
                <div style={hero.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={hero.visual} className="animate-fadeIn">
          <div style={hero.visualCard}>
            <div style={hero.visualHeader}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEBC2E' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840' }} />
              <span style={{ marginLeft: 8, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Nouveau signalement</span>
            </div>
            <div style={{ padding: '1.25rem' }}>
              {[
                { label: 'Type', val: 'Inondation', color: '#60A5FA' },
                { label: 'Gravité', val: '🔴 Urgence absolue', color: '#F87171' },
                { label: 'Localisation', val: 'Détectée (GPS)', color: '#34D399' },
                { label: 'Statut', val: 'Nouveau', color: '#FBBF24' },
              ].map((item, i) => (
                <div key={i} style={hero.visualRow}>
                  <span style={hero.visualLabel}>{item.label}</span>
                  <span style={{ ...hero.visualVal, color: item.color }}>{item.val}</span>
                </div>
              ))}
              <div style={hero.visualRef}>Réf : SIN-2026-0042</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FONCTIONNALITÉS ──────────────────────────────────── */}
      <section style={S.section}>
        <div style={S.inner}>
          <div style={S.header}>
            <div style={S.tag}>Fonctionnalités</div>
            <h2 style={S.title}>Un outil conçu pour l'urgence</h2>
            <p style={S.subtitle}>Simple, rapide et accessible depuis n'importe quel appareil.</p>
          </div>
          <div style={S.featGrid} className="stagger">
            {[
              { color: '#3B82F6', bg: '#EFF6FF', title: 'Géolocalisation GPS', desc: "Votre position est capturée automatiquement pour localiser l'incident avec précision.", detail: 'Coordonnées transmises en temps réel',
                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8" strokeDasharray="2 2"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>
              },
              { color: '#8B5CF6', bg: '#F5F3FF', title: 'Photos du sinistre', desc: "Joignez plusieurs photos directement depuis votre appareil pour documenter l'incident.", detail: 'Jusqu\'à 5 photos par signalement',
                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="15" rx="2"/><circle cx="12" cy="13" r="3"/><path d="M8 5l1.5-2h5L16 5"/><circle cx="18" cy="9" r="1" fill="currentColor"/></svg>
              },
              { color: '#EF4444', bg: '#FEF2F2', title: 'Degrés de gravité', desc: "Évaluez le niveau d'urgence de l'incident pour que les agents puissent prioriser les interventions.", detail: '3 niveaux : Jaune, Orange, Rouge',
                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" fill="currentColor" opacity="0.15"/><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>
              },
              { color: '#10B981', bg: '#F0FDF4', title: 'Suivi en temps réel', desc: "Consultez l'état de traitement de chaque signalement et l'historique complet des actions.", detail: 'Historique complet des statuts',
                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              },
              { color: '#F59E0B', bg: '#FFFBEB', title: 'Cartographie interactive', desc: "Visualisez l'ensemble des sinistres géolocalisés sur une carte dynamique pour une vue d'ensemble.", detail: 'Mise à jour en temps réel',
                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" fill="currentColor" opacity="0.1"/><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
              },
              { color: '#6366F1', bg: '#EEF2FF', title: 'Analyses & Rapports', desc: "Des tableaux de bord statistiques complets pour orienter les décisions opérationnelles de l'ABPC.", detail: 'Graphiques et tendances',
                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="18" rx="2" fill="currentColor" opacity="0.08"/><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="2" y1="9" x2="22" y2="9"/><rect x="5" y="13" width="2" height="5" rx="1" fill="currentColor" opacity="0.5"/><rect x="9" y="11" width="2" height="7" rx="1" fill="currentColor" opacity="0.5"/><rect x="13" y="14" width="2" height="4" rx="1" fill="currentColor" opacity="0.5"/><rect x="17" y="12" width="2" height="6" rx="1" fill="currentColor" opacity="0.5"/></svg>
              },
            ].map((f, i) => (
              <div key={i} style={S.featCard}>
                <div style={{ ...S.featIcon, background: f.bg, color: f.color }}>{f.icon}</div>
                <h3 style={S.featTitle}>{f.title}</h3>
                <p style={S.featDesc}>{f.desc}</p>
                <div style={{ ...S.featDetail, color: f.color }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: f.color, display: 'inline-block', flexShrink: 0 }} />
                  {f.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── À PROPOS ABPC ────────────────────────────────────── */}
      <section style={{ ...S.section, background: 'var(--surface)' }}>
        <div style={S.inner}>
          <div style={S.aboutGrid}>
            <div>
              <div style={S.tag}>À propos</div>
              <h2 style={{ ...S.title, textAlign: 'left', marginTop: 16 }}>
                L'Agence Béninoise de<br />Protection Civile
              </h2>
              <p style={S.aboutIntro}>
                L'ABPC a pour mission de contribuer à la conception et à la mise en œuvre
                de la politique et des stratégies gouvernementales en matière de protection
                civile et de réduction des risques de catastrophe.
              </p>
              <p style={S.aboutText}>
                Elle assure le secrétariat permanent de la plate-forme nationale de réduction
                des risques de catastrophe et d'adaptation aux changements climatiques, et
                exerce le leadership de la prévention, de la préparation, des réponses aux
                crises et catastrophes ainsi que la coordination du système national de
                prévention et de gestion des catastrophes.
              </p>
            </div>
            <div style={S.missionsCard}>
              <div style={S.missionsTitle}>Missions principales</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  "Identifier, prévenir et gérer tout risque de catastrophes, puis organiser les secours en cas d'urgence et de sinistres.",
                  "Assurer la protection des réfugiés et des apatrides.",
                  "Assurer la formation et le renforcement de capacités du personnel et des acteurs de la protection civile.",
                  "Donner un avis motivé dans le domaine de la sécurité incendie sur les dossiers de construction.",
                  "Assister la plate-forme nationale dans la mise en œuvre des mesures de prévention et de gestion des catastrophes.",
                ].map((mission, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--blue)', flexShrink: 0, marginTop: 6 }} />
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{mission}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DEGRÉS DE GRAVITÉ ────────────────────────────────── */}
      <section style={S.section}>
        <div style={S.inner}>
          <div style={S.header}>
            <div style={S.tag}>Niveaux d'alerte</div>
            <h2 style={S.title}>Degrés de gravité</h2>
          </div>
          <div style={S.gravGrid}>
            {[
              {
                bg: '#FEF08A', border: '#EAB308', text: '#854D0E', dot: '#EAB308',
                level: 'Jaune', label: 'Mineur', priorite: '🟡 À surveiller',
                desc: "Incident sans danger immédiat pour les personnes ou les biens. La situation doit être surveillée car elle peut évoluer rapidement.",
                exemples: ["Fuite d'eau mineure", 'Petit éboulement', 'Arbre tombé sur route'],
              },
              {
                bg: '#FED7AA', border: '#F97316', text: '#9A3412', dot: '#F97316',
                level: 'Orange', label: 'Modéré', priorite: '🟠 Intervention rapide',
                desc: "Situation préoccupante qui présente un risque potentiel pour les personnes ou les biens. Une intervention rapide est nécessaire.",
                exemples: ['Inondation partielle', 'Incendie maîtrisé', 'Accident avec blessés légers'],
              },
              {
                bg: '#FECACA', border: '#EF4444', text: '#991B1B', dot: '#EF4444',
                level: 'Rouge', label: 'Critique', priorite: '🔴 Urgence absolue',
                desc: "Urgence absolue mettant en danger des vies humaines. Une intervention immédiate est impérative.",
                exemples: ['Incendie majeur', 'Noyade en cours', 'Effondrement de bâtiment'],
              },
            ].map((g, i) => (
              <div key={i} style={{ ...S.gravCard, background: g.bg, borderColor: g.border }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', background: g.dot, flexShrink: 0, boxShadow: `0 0 0 4px ${g.dot}30` }} />
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: g.text, fontSize: 20 }}>{g.level}</div>
                      <div style={{ fontSize: 12, color: g.text, opacity: 0.7, fontWeight: 500 }}>{g.label}</div>
                    </div>
                  </div>
                  <div style={{ background: g.dot, color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                    {g.priorite}
                  </div>
                </div>
                <p style={{ fontSize: 14, color: g.text, lineHeight: 1.7, marginBottom: 16, opacity: 0.85 }}>{g.desc}</p>
                <div style={{ borderTop: `1px solid ${g.border}50`, paddingTop: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: g.text, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Exemples</div>
                  {g.exemples.map((ex, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: g.text, marginBottom: 5 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: g.dot, flexShrink: 0 }} />
                      {ex}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section style={S.ctaSection}>
        <div style={S.ctaInner}>
          <h2 style={S.ctaTitle}>Prêt à signaler un incident ?</h2>
          <p style={S.ctaSubtitle}>Aucune inscription requise pour un signalement d'urgence.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signaler" className="btn btn-danger btn-lg">Signaler maintenant</Link>
            <Link to="/register" className="btn btn-primary btn-lg">Créer un compte</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={S.footer}>
        <div style={S.footerInner}>
          <img src="/logo-header.png" alt="ABPC" style={{ height: 32, width: 'auto', opacity: 0.5 }} />
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>© 2026 Tous droits réservés - République du Bénin</span>
        </div>
      </footer>
    </div>
  )
}

/* ── Styles ──────────────────────────────────────────────────── */
const nav = {
  bar: { background: 'var(--navy)', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, zIndex: 100 },
  inner: { maxWidth: 1140, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 },
  
  // Desktop links — cachés sur mobile via CSS-in-JS conditionnel
  links: { display: 'flex', alignItems: 'center', gap: 12 },

  // Burger — visible sur mobile uniquement
  burger: {
    display: 'none', // on gère ça avec un hook
    background: 'transparent', border: 'none', cursor: 'pointer', padding: 4,
  },

  // Menu mobile
  mobileMenu: {
    display: 'flex', flexDirection: 'column', gap: 8,
    padding: '1rem 1.5rem 1.5rem',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    background: 'var(--navy)',
  },
  mobileLink: { color: 'rgba(255,255,255,0.8)', fontSize: 15, fontWeight: 500, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  mobilePrimary: { background: 'var(--blue)', color: '#fff', padding: '12px 16px', borderRadius: 8, fontSize: 14, fontWeight: 600, textAlign: 'center', marginTop: 4 },
  mobileDanger: { background: 'var(--danger)', color: '#fff', padding: '12px 16px', borderRadius: 8, fontSize: 14, fontWeight: 600, textAlign: 'center', marginTop: 4 },

  link: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 500 },
  primaryBtn: { background: 'var(--blue)', color: '#fff', padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600 },
  ghostBtn: { background: 'transparent', color: '#fff', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: '1px solid rgba(255,255,255,0.3)' },
}

const hero = {
  section: { background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 60%, #1A4A8A 100%)', padding: '4rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3rem', position: 'relative', overflow: 'hidden', flexWrap: 'wrap' },
  pattern: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', pointerEvents: 'none' },
  circle: { position: 'absolute', right: '-60px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)' },
  content: { flex: '1 1 280px', maxWidth: 560, position: 'relative', zIndex: 1, },
  badge: { display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: '6px 14px', fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem' },
  title: { fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: '1.25rem', letterSpacing: '-0.02em' },
  titleAccent: { color: 'var(--accent-light)' },
  subtitle: { color: 'rgba(255,255,255,0.65)', fontSize: 15, lineHeight: 1.7, marginBottom: '2rem', maxWidth: 460 },
  actions: {  display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' },
  stats: { display: 'flex', gap: '2rem', flexWrap: 'wrap' },
  stat: { textAlign: 'center' },
  statVal: { fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: '#fff' },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  visual: { flex: '1 1 260px', maxWidth: 320 },
  visualCard: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, overflow: 'hidden' },
  visualHeader: { background: 'rgba(0,0,0,0.2)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 6 },
  visualRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  visualLabel: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  visualVal: { fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-display)' },
  visualRef: { marginTop: 16, textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' },
}

const S = {
  section: { padding: '4rem 1.5rem', background: 'var(--bg)' },
  inner: { maxWidth: 1140, margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: '3rem' },
  tag: { display: 'inline-block', background: 'rgba(30,86,160,0.1)', color: 'var(--blue)', fontSize: 12, fontWeight: 700, padding: '4px 14px', borderRadius: 20, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 },
  title: { fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3vw, 2.25rem)', fontWeight: 800, color: 'var(--navy)', marginBottom: 12, letterSpacing: '-0.02em' },
  subtitle: { color: 'var(--text-secondary)', fontSize: 16, maxWidth: 500, margin: '0 auto' },

  featGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' },
  featCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem' },
  featIcon: { width: 56, height: 56, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' },
  featTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--navy)', marginBottom: 8 },
  featDesc: { fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 },
  featDetail: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)', fontSize: 12, fontWeight: 600 },

  aboutGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'start' },
  aboutIntro: { fontSize: 16, color: 'var(--text-primary)', lineHeight: 1.8, fontWeight: 500, marginBottom: '1rem', marginTop: '1rem' },
  aboutText: { fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8 },
  missionsCard: { background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 20, padding: '2rem', boxShadow: 'var(--shadow-md)' },
  missionsTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid var(--accent)' },

  gravGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' },
  gravCard: { border: '2px solid', borderRadius: 16, padding: '1.5rem' },

  ctaSection: { background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%)', padding: '4rem 1.5rem', textAlign: 'center' },
  ctaInner: { maxWidth: 600, margin: '0 auto' },
  ctaTitle: { fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, color: '#fff', marginBottom: 12 },
  ctaSubtitle: { color: 'rgba(255,255,255,0.6)', fontSize: 16, marginBottom: '2rem' },

  footer: { background: 'var(--navy)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '1.5rem' },
  footerInner: { maxWidth: 1140, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', padding: '0 1.5rem' },
}