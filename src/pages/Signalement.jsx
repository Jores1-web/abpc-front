import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Signalement() {
  const { citoyen } = useAuth()
  const navigate    = useNavigate()
  const [gpsPrecision, setGpsPrecision] = useState(null)
  const [types, setTypes]           = useState([])
  const [loading, setLoading]       = useState(false)
  const [success, setSuccess]       = useState(null)
  const [erreurs, setErreurs]       = useState({})
  const [gpsLoading, setGpsLoading] = useState(false)
  const [step, setStep]             = useState(1) // étape courante

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth < 768)
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])

  const [form, setForm] = useState({
    nom_citoyen:      citoyen?.nom     || '',
    prenom_citoyen:   citoyen?.prenom  || '',
    contact_citoyen:  citoyen?.contact || '',
    type_sinistre_id: '',
    description:      '',
    latitude:         '',
    longitude:        '',
    adresse:          '',
    gravite:          '',
    photos:           [],
  })

  useEffect(() => {
    api.get('/types-sinistres').then(res => setTypes(res.data))
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handlePhotos = (e) => setForm({ ...form, photos: Array.from(e.target.files) })

  const handleGPS = () => {
    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm(prev => ({
          ...prev,
          latitude: pos.coords.latitude.toString(),
          longitude: pos.coords.longitude.toString(),
        }))
        // Afficher la précision à l'utilisateur
        const precision = Math.round(pos.coords.accuracy)
        setGpsPrecision(precision)
        setGpsLoading(false)
      },
      (err) => {
        alert('Impossible de récupérer la position GPS. Activez la localisation sur votre appareil.')
        setGpsLoading(false)
      },
      {
        enableHighAccuracy: true,  // Force le GPS chip sur mobile
        timeout: 15000,            // Attend 15 secondes max
        maximumAge: 0              // Refuse les positions en cache
      }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setErreurs({})
    try {
      const formData = new FormData()
      Object.keys(form).forEach(key => {
        if (key === 'photos') form.photos.forEach(p => formData.append('photos[]', p))
        else formData.append(key, form[key])
      })
      const res = await api.post(
        citoyen ? '/citoyen/sinistres' : '/sinistres',
        formData, { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      setSuccess(res.data.reference)
    } catch (err) {
      if (err.response?.status === 422) setErreurs(err.response.data.errors || {})
    } finally { setLoading(false) }
  }

  const gravites = [
    { value: 'jaune',  label: 'Jaune',  desc: 'Mineur',   color: '#854D0E', bg: '#FEF08A', border: '#EAB308', dot: '#EAB308' },
    { value: 'orange', label: 'Orange', desc: 'Modéré',   color: '#9A3412', bg: '#FED7AA', border: '#F97316', dot: '#F97316' },
    { value: 'rouge',  label: 'Rouge',  desc: 'Critique', color: '#991B1B', bg: '#FECACA', border: '#EF4444', dot: '#EF4444' },
  ]

  if (success) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', fontFamily: 'var(--font-body)' }}>
      <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', boxShadow: 'var(--shadow-xl)', padding: '2.5rem 1.5rem', maxWidth: 480, width: '100%', textAlign: 'center' }} className="animate-fadeUp">
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/><polyline points="9 12 12 15 16 10"/>
          </svg>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: 'var(--navy)', marginBottom: 8 }}>
          Signalement envoyé !
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          Votre signalement a été enregistré et transmis aux agents ABPC.
        </p>
        <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Numéro de référence</span>
          <span style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 700, color: 'var(--navy)', letterSpacing: '0.05em' }}>{success}</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
          Conservez ce numéro pour suivre l'état de traitement de votre signalement.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              setSuccess(null)
              setForm({ nom_citoyen: citoyen?.nom||'', prenom_citoyen: citoyen?.prenom||'', contact_citoyen: citoyen?.contact||'', type_sinistre_id:'', description:'', latitude:'', longitude:'', adresse:'', gravite:'', photos:[] })
              setStep(1)
            }}
            className="btn btn-ghost"
          >
            Nouveau signalement
          </button>
          <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
        </div>
      </div>
    </div>
  )
}

  const S = {
    page: { minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-body)' },
    header: { background: 'var(--navy)', borderBottom: '1px solid rgba(255,255,255,0.08)' },
    headerInner: { maxWidth: 1140, margin: '0 auto', padding: '0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 },
    main: { maxWidth: 1140, margin: '0 auto', padding: isMobile ? '1.5rem 1rem' : '2.5rem 2rem' },
    pageHeader: { marginBottom: '1.5rem' },
    pageTitle: { fontFamily: 'var(--font-display)', fontSize: isMobile ? 22 : 28, fontWeight: 800, color: 'var(--navy)', marginBottom: 8 },
    pageSubtitle: { color: 'var(--text-secondary)', fontSize: 14 },
    steps: { display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: 0, overflowX: 'auto' },
    stepItem: { display: 'flex', alignItems: 'center', gap: 6 },
    stepDot: { width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-display)', flexShrink: 0 },
    stepLabel: { fontSize: isMobile ? 11 : 13, whiteSpace: 'nowrap' },
    stepLine: { width: isMobile ? 20 : 40, height: 2, background: 'var(--border)', margin: '0 6px' },
    formGrid: { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 340px', gap: isMobile ? '1rem' : '2rem', alignItems: 'start' },
    formLeft: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
    formRight: { display: isMobile ? 'none' : 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '1rem' },
    section: { background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)', padding: isMobile ? '1.25rem' : '1.75rem', boxShadow: 'var(--shadow-sm)' },
    sectionHeader: { display: 'flex', gap: '1rem', marginBottom: '1.25rem' },
    sectionNum: { width: 32, height: 32, borderRadius: '50%', background: 'var(--navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, flexShrink: 0 },
    sectionTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--navy)', marginBottom: 4 },
    sectionDesc: { fontSize: 13, color: 'var(--text-secondary)' },
    graviteGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: 8 },
    graviteCard: { padding: isMobile ? '0.75rem 0.5rem' : '1rem', borderRadius: 12, border: '2px solid', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'center' },
    uploadZone: { border: '2px dashed var(--border)', borderRadius: 12, padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', position: 'relative', background: 'var(--surface-2)', transition: 'border-color 0.2s' },
    gpsBtn: { width: '100%', padding: '14px 18px', border: '2px solid', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'all 0.2s', background: 'none' },
    recap: { background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' },
    recapTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--navy)', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' },
    recapGrid: { display: 'flex', flexDirection: 'column', gap: 10 },
    recapRow: { display: 'flex', justifyContent: 'space-between', fontSize: 13 },
    recapLabel: { color: 'var(--text-muted)' },
    recapVal: { fontWeight: 600, color: 'var(--navy)', textAlign: 'right', maxWidth: '60%' },
    urgenceBox: { background: 'linear-gradient(135deg, var(--danger) 0%, #E74C3C 100%)', borderRadius: 16, padding: '1.5rem', textAlign: 'center' },
    urgenceTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 8 },
    urgenceText: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 12, lineHeight: 1.5 },
    urgenceNum: { fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 800, color: '#fff', lineHeight: 1 },
    successPage: { minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', fontFamily: 'var(--font-body)' },
    successCard: { background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', boxShadow: 'var(--shadow-xl)', padding: isMobile ? '2rem 1.5rem' : '3rem 2.5rem', maxWidth: 480, width: '100%', textAlign: 'center' },
    successIcon: { width: 72, height: 72, borderRadius: '50%', background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' },
    successTitle: { fontFamily: 'var(--font-display)', fontSize: isMobile ? 22 : 26, fontWeight: 800, color: 'var(--navy)', marginBottom: 8 },
    successText: { color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 },
    successRef: { background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem' },
  }

  return (
    <div style={S.page}>
      {/* Header */}
      <header style={S.header}>
        <div style={S.headerInner}>
          <Link to="/">
              <img 
                src="/logo-header.png" 
                alt="ABPC - Agence Béninoise de Protection Civile" 
                style={{ height: 48, width: 'auto', cursor: 'pointer' }} 
              />
          </Link>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {!citoyen && <Link to="/login" style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Connexion</Link>}
            {citoyen && <Link to="/mon-espace" style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Mon espace</Link>}
          </div>
        </div>
      </header>

      {/* Contenu */}
      <main style={S.main}>
        {/* Titre */}
        <div style={S.pageHeader} className="animate-fadeUp">
          <h1 style={S.pageTitle}>Signaler un sinistre</h1>
          <p style={S.pageSubtitle}>
            {citoyen
              ? `Bonjour ${citoyen.prenom}, vos informations sont pré-remplies.`
              : <>Pas de compte ? <Link to="/login" style={{ color: 'var(--blue)', fontWeight: 600 }}>Connectez-vous</Link> pour accélérer le processus.</>
            }
          </p>
        </div>

        {/* Indicateur d'étapes */}
        <div style={S.steps} className="animate-fadeUp">
          {['Vos informations', 'Le sinistre', 'Localisation'].map((label, i) => {
            const num = i + 1
            const active = step === num
            const done = step > num
            return (
              <div key={i} style={S.stepItem}>
                <div style={{ ...S.stepDot, background: done ? 'var(--success)' : active ? 'var(--blue)' : 'var(--border)', color: done || active ? '#fff' : 'var(--text-muted)' }}>
                  {done ? '✓' : num}
                </div>
                <span style={{ ...S.stepLabel, color: active ? 'var(--navy)' : 'var(--text-muted)', fontWeight: active ? 600 : 400 }}>{label}</span>
                {i < 2 && <div style={S.stepLine} />}
              </div>
            )
          })}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={S.formGrid}>
            {/* Colonne gauche */}
            <div style={S.formLeft}>

              {/* ÉTAPE 1 — Informations personnelles */}
              <div style={{ ...S.section, display: step >= 1 ? 'block' : 'none' }}>
                <div style={S.sectionHeader}>
                  <div style={S.sectionNum}>1</div>
                  <div>
                    <h3 style={S.sectionTitle}>Vos informations</h3>
                    <p style={S.sectionDesc}>Ces informations permettent aux agents de vous recontacter si nécessaire.</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                  <div className="input-group">
                    <label>Nom *</label>
                    <input name="nom_citoyen" value={form.nom_citoyen} onChange={handleChange} placeholder="Votre nom" required />
                    {erreurs.nom_citoyen && <span className="error-msg">{erreurs.nom_citoyen[0]}</span>}
                  </div>
                  <div className="input-group">
                    <label>Prénom *</label>
                    <input name="prenom_citoyen" value={form.prenom_citoyen} onChange={handleChange} placeholder="Votre prénom" required />
                  </div>
                </div>
                <div className="input-group">
                  <label>Contact téléphonique *</label>
                  <input name="contact_citoyen" value={form.contact_citoyen} onChange={handleChange} placeholder="+229 01 XX XX XX XX" required />
                  {erreurs.contact_citoyen && <span className="error-msg">{erreurs.contact_citoyen[0]}</span>}
                </div>
                <button type="button" className="btn btn-primary" onClick={() => setStep(2)} style={{ marginTop: 8 }}>
                  Continuer →
                </button>
              </div>

              {/* ÉTAPE 2 — Détails du sinistre */}
              {step >= 2 && (
                <div style={S.section}>
                  <div style={S.sectionHeader}>
                    <div style={S.sectionNum}>2</div>
                    <div>
                      <h3 style={S.sectionTitle}>Détails du sinistre</h3>
                      <p style={S.sectionDesc}>Décrivez l'incident avec le plus de précision possible.</p>
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Type de sinistre *</label>
                    <select name="type_sinistre_id" value={form.type_sinistre_id} onChange={handleChange} required>
                      <option value="">Sélectionnez un type...</option>
                      {types.map(t => <option key={t.id} value={t.id}>{t.nom}</option>)}
                    </select>
                    {erreurs.type_sinistre_id && <span className="error-msg">{erreurs.type_sinistre_id[0]}</span>}
                  </div>

                  <div className="input-group">
                    <label>Description *</label>
                    <textarea name="description" value={form.description} onChange={handleChange}
                      placeholder="Décrivez précisément ce que vous observez : nature du sinistre, nombre de personnes affectées, dangers immédiats..."
                      rows={4} style={{ resize: 'vertical' }} required />
                    {erreurs.description && <span className="error-msg">{erreurs.description[0]}</span>}
                  </div>

                  {/* Gravité */}
                  <div className="input-group">
                    <label>Niveau de gravité *</label>
                    <div style={S.graviteGrid}>
                      {gravites.map(g => (
                        <div key={g.value} onClick={() => setForm(prev => ({...prev, gravite: g.value }))}
                          style={{ ...S.graviteCard, background: form.gravite === g.value ? g.bg : 'var(--surface-2)', borderColor: form.gravite === g.value ? g.border : 'var(--border)', boxShadow: form.gravite === g.value ? `0 0 0 2px ${g.border}40` : 'none' }}>
                          <div style={{ width: 12, height: 12, borderRadius: '50%', background: g.dot, marginBottom: 8 }} />
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: g.color }}>{g.label}</div>
                          <div style={{ fontSize: 12, color: g.color, opacity: 0.7 }}>{g.desc}</div>
                        </div>
                      ))}
                    </div>
                    {erreurs.gravite && <span className="error-msg">{erreurs.gravite[0]}</span>}
                  </div>

                  {/* Photos */}
                  <div className="input-group">
                    <label>Photos (optionnel)</label>
                    <div style={S.uploadZone}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8 }}>
                        {form.photos.length > 0 ? `${form.photos.length} photo(s) sélectionnée(s)` : 'Cliquez pour ajouter des photos'}
                      </span>
                      <input type="file" accept="image/*" multiple onChange={handlePhotos}
                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                    </div>

                    {/* Aperçu des photos */}
                    {form.photos.length > 0 && (
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                        {form.photos.map((photo, i) => (
                          <div key={i} style={{ position: 'relative' }}>
                            <img
                              src={URL.createObjectURL(photo)}
                              alt={`photo ${i + 1}`}
                              style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '2px solid var(--border)' }}
                            />
                            <button
                              type="button"
                              onClick={() => setForm(prev => ({...prev, photos: prev.photos.filter((_, j) => j !== i)}))}
                              style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: 'var(--danger)', border: 'none', color: '#fff', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>← Retour</button>
                    <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>Continuer →</button>
                  </div>
                </div>
              )}

              {/* ÉTAPE 3 — Localisation */}
              {step >= 3 && (
                <div style={S.section}>
                  <div style={S.sectionHeader}>
                    <div style={S.sectionNum}>3</div>
                    <div>
                      <h3 style={S.sectionTitle}>Localisation</h3>
                      <p style={S.sectionDesc}>Indiquez l'emplacement précis du sinistre.</p>
                    </div>
                  </div>

                  <button type="button" onClick={handleGPS}
                    style={{ ...S.gpsBtn, background: form.latitude ? 'var(--success-light)' : 'var(--surface-2)', borderColor: form.latitude ? 'var(--success)' : 'var(--border)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={form.latitude ? 'var(--success)' : 'var(--text-secondary)'} strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
                      <line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/>
                      <line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>
                    </svg>
                    <span style={{ color: form.latitude ? 'var(--success)' : 'var(--text-secondary)', fontWeight: 600, fontSize: 14 }}>
                      {gpsLoading ? 'Détection en cours...' : form.latitude ? `Position détectée : ${parseFloat(form.latitude).toFixed(4)}°, ${parseFloat(form.longitude).toFixed(4)}°` : 'Détecter ma position GPS'}
                    </span>
                  </button>

                  {/* Indicateur de précision */}
                  {form.latitude && (
                    <p style={{
                      fontSize: 13, marginTop: 8, marginBottom: '0.75rem',
                      padding: '8px 12px', borderRadius: 8,
                      background: gpsPrecision && gpsPrecision < 50 ? '#F0FDF4' : '#FFFBEB',
                      color: gpsPrecision && gpsPrecision < 50 ? 'var(--success)' : '#D97706',
                      border: `1px solid ${gpsPrecision && gpsPrecision < 50 ? '#6EE7B7' : '#FCD34D'}`
                    }}>
                      {gpsPrecision && gpsPrecision < 50
                        ? `✅ Position précise (±${gpsPrecision}m)`
                        : `⚠️ Position approximative (±${gpsPrecision}m)`
                      }
                    </p>
                  )}

                  {/* Conseil mobile */}
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, textAlign: 'center' }}>
                    Pour une localisation précise, utilisez un téléphone mobile avec la localisation activée
                  </p>

                  <div className="input-group" style={{ marginTop: '1rem' }}>
                    <label>Adresse précise (optionnel)</label>
                    <input name="adresse" value={form.adresse} onChange={handleChange}
                      placeholder="Quartier, rue, point de repère..." />
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: 8 }}>
                    <button type="button" className="btn btn-ghost" onClick={() => setStep(2)}>← Retour</button>
                    <button type="submit" className="btn btn-danger" style={{ flex: 1 }} disabled={loading}>
                      {loading ? 'Envoi en cours...' : 'Envoyer le signalement'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Colonne droite — Récapitulatif */}
            <div style={S.formRight}>
              <div style={S.recap}>
                <h4 style={S.recapTitle}>Récapitulatif</h4>
                <div style={S.recapGrid}>
                  {[
                    { label: 'Déclarant', val: form.nom_citoyen && form.prenom_citoyen ? `${form.prenom_citoyen} ${form.nom_citoyen}` : '—' },
                    { label: 'Contact', val: form.contact_citoyen || '—' },
                    { label: 'Type', val: types.find(t => t.id == form.type_sinistre_id)?.nom || '—' },
                    { label: 'Gravité', val: form.gravite ? form.gravite.charAt(0).toUpperCase() + form.gravite.slice(1) : '—' },
                    { label: 'GPS', val: form.latitude ? `Détecté ✓ ${gpsPrecision ? `(±${gpsPrecision}m)` : ''}` : 'Non détecté' },
                    { label: 'Photos', val: form.photos.length > 0 ? `${form.photos.length} fichier(s)` : 'Aucune' },
                  ].map((r, i) => (
                    <div key={i} style={S.recapRow}>
                      <span style={S.recapLabel}>{r.label}</span>
                      <span style={S.recapVal}>{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aide urgence */}
              <div style={S.urgenceBox}>
                <div style={S.urgenceTitle}>🆘 Urgence extrême ?</div>
                <p style={S.urgenceText}>En cas de danger immédiat pour des vies humaines, composez le :</p>
                <div style={S.urgenceNum}>118</div>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>Protection Civile</p>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
