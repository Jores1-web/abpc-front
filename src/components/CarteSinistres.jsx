import { useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const couleurGravite = {
  rouge:  '#EF4444',
  orange: '#F97316',
  jaune:  '#EAB308',
}

const statutInfo = {
  nouveau:  'Nouveau',
  en_cours: 'En cours',
  cloture:  'Clôturé',
}

// Composant pour faire pulser les marqueurs nouveaux
function PulsingMarker({ s, couleur }) {
  const isNew = s.statut === 'nouveau'

  return (
    <>
      {/* Cercle pulsant pour les nouveaux */}
      {isNew && (
        <CircleMarker
          center={[parseFloat(s.latitude), parseFloat(s.longitude)]}
          radius={22}
          pathOptions={{
            color: couleur,
            fillColor: couleur,
            fillOpacity: 0.15,
            weight: 1.5,
            dashArray: '4 4',
            className: 'pulsing-marker',
          }}
        />
      )}
      {/* Cercle principal */}
      <CircleMarker
        center={[parseFloat(s.latitude), parseFloat(s.longitude)]}
        radius={s.gravite === 'rouge' ? 14 : s.gravite === 'orange' ? 11 : 8}
        pathOptions={{
          color: '#fff',
          fillColor: couleur,
          fillOpacity: 0.9,
          weight: 2.5,
        }}
      >
        <Popup>
          <div style={{ fontFamily: 'sans-serif', minWidth: 210 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: '#0B1E3D' }}>{s.reference}</div>
              {isNew && (
                <span style={{ background: '#EFF6FF', color: '#2563EB', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, border: '1px solid #BFDBFE' }}>
                  NOUVEAU
                </span>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: 13, color: '#444' }}>
                <strong>Type :</strong> {s.type_sinistre?.nom || '—'}
              </div>
              <div style={{ fontSize: 13, color: '#444' }}>
                <strong>Gravité :</strong>{' '}
                <span style={{ color: couleur, fontWeight: 700 }}>
                  {s.gravite?.charAt(0).toUpperCase() + s.gravite?.slice(1)}
                </span>
              </div>
              <div style={{ fontSize: 13, color: '#444' }}>
                <strong>Statut :</strong> {statutInfo[s.statut] || s.statut}
              </div>
              {s.adresse && (
                <div style={{ fontSize: 12, color: '#888' }}>📍 {s.adresse}</div>
              )}
              <div style={{ fontSize: 12, color: '#888' }}>
                👤 {s.prenom_citoyen} {s.nom_citoyen}
              </div>
              {s.contact_citoyen && (
                <div style={{ fontSize: 12, color: '#888' }}>📞 {s.contact_citoyen}</div>
              )}
              <div style={{ fontSize: 11, color: '#aaa', borderTop: '1px solid #eee', paddingTop: 6, marginTop: 2 }}>
                {new Date(s.created_at).toLocaleDateString('fr-FR', {
                  day: '2-digit', month: 'long', year: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </Popup>
      </CircleMarker>
    </>
  )
}

export default function CarteSinistres({ sinistres }) {
  const centre = [9.3077, 2.3158]

  return (
    <>
      <style>{`
        @keyframes leaflet-pulse {
          0%   { opacity: 0.8; transform: scale(1); }
          50%  { opacity: 0.2; transform: scale(1.6); }
          100% { opacity: 0.8; transform: scale(1); }
        }
        .pulsing-marker {
          animation: leaflet-pulse 2s ease-in-out infinite;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15) !important;
          border: 1px solid #eee;
        }
        .leaflet-popup-tip { display: none; }
      `}</style>

      <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', height: 500, boxShadow: 'var(--shadow-md)' }}>
        <MapContainer center={centre} zoom={7} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {sinistres
            .filter(s => s.latitude && s.longitude)
            .map(s => (
              <PulsingMarker
                key={s.id}
                s={s}
                couleur={couleurGravite[s.gravite] || '#EAB308'}
              />
            ))
          }
        </MapContainer>
      </div>
    </>
  )
}