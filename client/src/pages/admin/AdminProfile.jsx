import {
  BarChart3,
  Box,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Edit3,
  FileText,
  KeyRound,
  Laptop,
  LogIn,
  Mail,
  MapPin,
  MessageSquare,
  Moon,
  Phone,
  ReceiptText,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Tag,
  Upload,
  UserRound,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import AdminHeader from '../../components/layout/AdminHeader.jsx'
import AdminSidebar from '../../components/layout/AdminSidebar.jsx'
import {
  getAdminProfile,
  saveAdminProfile,
} from '../../services/adminService.js'

const adminIdentity = {
  firstName: 'Omaima',
  lastName: 'Achouaf',
  fullName: 'Omaima Achouaf',
  initials: 'OA',
  role: 'Administrateur',
  email: 'omaima.achouaf@nova.ma',
  phone: '+212 6 12 34 56 78',
  location: 'Maroc',
  memberSince: '12 mars 2023',
  address: '123 Avenue Mohammed V\nCasablanca, Maroc',
}

const securityRows = [
  {
    icon: KeyRound,
    title: 'Mot de passe',
    description: 'Changez votre mot de passe régulièrement.',
    value: 'Modifier',
  },
  {
    icon: Smartphone,
    title: 'Authentification à deux facteurs',
    description: 'Sécurisez votre compte avec la 2FA.',
    value: 'Activée',
    success: true,
  },
  {
    icon: Laptop,
    title: 'Sessions actives',
    description: 'Gérez vos sessions sur tous vos appareils.',
    value: '2 sessions',
  },
  {
    icon: ShieldCheck,
    title: 'Appareils connectés',
    description: 'Consultez vos appareils de confiance.',
    value: '3 appareils',
  },
]

const activityItems = [
  {
    icon: Box,
    title: 'Produit ajouté',
    description: 'Vous avez ajouté le produit "Robe Élégance"',
    time: 'Il y a 2 heures',
  },
  {
    icon: ShoppingCart,
    title: 'Commande confirmée',
    description: 'Commande #NOVA-2026-0283 confirmée',
    time: 'Il y a 5 heures',
  },
  {
    icon: Tag,
    title: 'Promotion créée',
    description: 'Vous avez créé la promotion "Été 2026"',
    time: 'Il y a 1 jour',
  },
  {
    icon: LogIn,
    title: 'Connexion récente',
    description: 'Connexion depuis Casablanca, Maroc',
    time: 'Il y a 2 jours',
  },
]

const statItems = [
  {
    icon: ShoppingCart,
    label: 'Commandes gérées',
    value: '1 248',
    change: '+12%',
  },
  {
    icon: Box,
    label: 'Produits ajoutés',
    value: '356',
    change: '+8%',
  },
  {
    icon: Mail,
    label: 'Messages traités',
    value: '89',
    change: '+24%',
  },
  {
    icon: Clock3,
    label: 'Dernière connexion',
    value: "Aujourd'hui",
    detail: 'à 10:24',
  },
]

const profilePreferencesStorageKey = 'nova_admin_profile_preferences'

const defaultProfilePreferences = {
  email: true,
  sms: true,
  newsletter: true,
  darkMode: false,
  language: 'Français',
  timezone: 'Maroc (GMT+1)',
}

function loadProfilePreferences() {
  if (typeof window === 'undefined') {
    return defaultProfilePreferences
  }

  try {
    return (
      JSON.parse(
        window.localStorage.getItem(profilePreferencesStorageKey),
      ) || defaultProfilePreferences
    )
  } catch {
    return defaultProfilePreferences
  }
}

function ProfileToggle({
  checked,
  onClick,
}) {
  return (
    <button
      className={
        checked ? 'admin-profile-toggle is-on' : 'admin-profile-toggle'
      }
      type="button"
      onClick={onClick}
      aria-pressed={checked}
    >
      <span />
    </button>
  )
}

function ProfileCard({
  icon: Icon,
  title,
  subtitle,
  children,
  className = '',
}) {
  return (
    <section className={`dashboard-card admin-profile-card ${className}`}>
      <div className="admin-profile-card__header">
        <div className="admin-profile-card__icon">
          <Icon size={22} strokeWidth={1.8} />
        </div>

        <div>
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </div>

      {children}
    </section>
  )
}

export default function AdminProfile() {
  const fileInputRef = useRef(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [profile, setProfile] = useState(() => getAdminProfile())
  const [profileForm, setProfileForm] = useState(() => {
    const currentProfile = getAdminProfile()

    return {
      firstName: currentProfile.firstName,
      lastName: currentProfile.lastName,
      email: currentProfile.email,
      phone: currentProfile.phone,
      role: currentProfile.role,
      address: currentProfile.address,
    }
  })
  const [preferences, setPreferences] = useState(() =>
    loadProfilePreferences(),
  )
  const [notice, setNotice] = useState('')

  useEffect(
    () => () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview)
      }
    },
    [avatarPreview],
  )

  const updateProfileField = (event) => {
    const { name, value } = event.target

    setProfileForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
    setNotice('')
  }

  const updatePreference = (key, value) => {
    setPreferences((currentPreferences) => {
      const nextPreferences = {
        ...currentPreferences,
        [key]: value,
      }

      window.localStorage.setItem(
        profilePreferencesStorageKey,
        JSON.stringify(nextPreferences),
      )

      return nextPreferences
    })
    setNotice('')
  }

  const handleAvatarChange = (event) => {
    const [file] = Array.from(event.target.files || [])

    if (!file) {
      return
    }

    setAvatarPreview((currentPreview) => {
      if (currentPreview) {
        URL.revokeObjectURL(currentPreview)
      }

      return URL.createObjectURL(file)
    })
    setNotice('Photo prévisualisée localement.')
    event.target.value = ''
  }

  const saveProfile = () => {
    const nextProfile = saveAdminProfile({
      ...profile,
      ...profileForm,
      location: profile.location || adminIdentity.location,
      memberSince: profile.memberSince || adminIdentity.memberSince,
    })

    setProfile(nextProfile)
    setNotice('Profil mis à jour localement.')
  }

  const handleSecurityAction = (title) => {
    setNotice(`Action de securite locale ouverte : ${title}.`)
  }

  const showFullActivity = () => {
    setNotice('Historique complet disponible apres connexion backend.')
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
        <AdminHeader />

        <main className="admin-dashboard admin-profile-page">
          <section className="admin-profile-breadcrumb">
            <Link to="/admin">Accueil</Link>
            <ChevronRight size={14} strokeWidth={1.7} />
            <strong>Profil</strong>
          </section>

          <section className="admin-profile-heading">
            <h1>Mon profil</h1>
            <p>
              Gérez vos informations personnelles, votre compte et vos
              préférences.
            </p>
          </section>

          {notice ? (
            <div className="admin-profile-notice">{notice}</div>
          ) : null}

          <section className="admin-profile-grid">
            <ProfileCard
              icon={UserRound}
              title="Aperçu du profil"
              className="admin-profile-overview-card"
            >
              <span className="admin-profile-verified">
                Compte vérifié
                <CheckCircle2 size={15} strokeWidth={2} />
              </span>

              <div className="admin-profile-overview">
                <div className="admin-profile-avatar-large">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt={profile.fullName} />
                  ) : (
                    <span>{profile.initials}</span>
                  )}
                </div>

                <div className="admin-profile-summary">
                  <strong>{profile.fullName}</strong>
                  <span>{profile.role}</span>

                  <div>
                    <Mail size={16} strokeWidth={1.8} />
                    <span>{profile.email}</span>
                  </div>

                  <div>
                    <Phone size={16} strokeWidth={1.8} />
                    <span>{profile.phone}</span>
                  </div>

                  <div>
                    <MapPin size={16} strokeWidth={1.8} />
                    <span>{profile.location}</span>
                  </div>

                  <div>
                    <CalendarDays size={16} strokeWidth={1.8} />
                    <span>Membre depuis le {profile.memberSince}</span>
                  </div>
                </div>
              </div>

              <div className="admin-profile-overview-actions">
                <button type="button" onClick={saveProfile}>
                  <Edit3 size={16} strokeWidth={1.8} />
                  <span>Modifier le profil</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={16} strokeWidth={1.8} />
                  <span>Télécharger la photo</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>
            </ProfileCard>

            <ProfileCard
              icon={ReceiptText}
              title="Informations personnelles"
              subtitle="Mettez à jour vos informations personnelles."
            >
              <div className="admin-profile-form-grid">
                <label>
                  <span>Prénom</span>
                  <input
                    name="firstName"
                    value={profileForm.firstName}
                    onChange={updateProfileField}
                  />
                </label>

                <label>
                  <span>Nom</span>
                  <input
                    name="lastName"
                    value={profileForm.lastName}
                    onChange={updateProfileField}
                  />
                </label>

                <label className="admin-profile-form-grid__wide">
                  <span>Email</span>
                  <input
                    name="email"
                    type="email"
                    value={profileForm.email}
                    onChange={updateProfileField}
                  />
                </label>

                <label>
                  <span>Téléphone</span>
                  <input
                    name="phone"
                    value={profileForm.phone}
                    onChange={updateProfileField}
                  />
                </label>

                <label>
                  <span>Poste</span>
                  <input
                    name="role"
                    value={profileForm.role}
                    onChange={updateProfileField}
                  />
                </label>

                <label className="admin-profile-form-grid__wide">
                  <span>Adresse</span>
                  <textarea
                    name="address"
                    value={profileForm.address}
                    onChange={updateProfileField}
                  />
                </label>
              </div>

              <button
                className="admin-profile-save-button"
                type="button"
                onClick={saveProfile}
              >
                Enregistrer les informations
              </button>
            </ProfileCard>

            <ProfileCard
              icon={Settings}
              title="Préférences du compte"
              subtitle="Personnalisez votre expérience d'administration."
            >
              <div className="admin-profile-preferences">
                {[
                  [
                    'email',
                    Mail,
                    'Notifications par email',
                    'Recevoir des notifications sur les commandes, les clients et les activités importantes.',
                  ],
                  [
                    'sms',
                    MessageSquare,
                    'Notifications par SMS',
                    'Recevoir les alertes importantes par SMS.',
                  ],
                  [
                    'newsletter',
                    FileText,
                    'Newsletter interne',
                    'Recevoir les actualités et conseils de la plateforme.',
                  ],
                  [
                    'darkMode',
                    Moon,
                    'Mode sombre',
                    "Utiliser le thème sombre pour l'interface.",
                  ],
                ].map(([key, Icon, label, description]) => (
                  <div className="admin-profile-preference-row" key={key}>
                    <Icon size={20} strokeWidth={1.8} />
                    <div>
                      <strong>{label}</strong>
                      <span>{description}</span>
                    </div>
                    <ProfileToggle
                      checked={preferences[key]}
                      onClick={() =>
                        updatePreference(key, !preferences[key])
                      }
                    />
                  </div>
                ))}

                <label className="admin-profile-select-row">
                  <Settings size={20} strokeWidth={1.8} />
                  <span>Langue</span>
                  <select
                    value={preferences.language}
                    onChange={(event) =>
                      updatePreference('language', event.target.value)
                    }
                  >
                    <option>Français</option>
                    <option>English</option>
                    <option>العربية</option>
                  </select>
                </label>

                <label className="admin-profile-select-row">
                  <Clock3 size={20} strokeWidth={1.8} />
                  <span>Fuseau horaire</span>
                  <select
                    value={preferences.timezone}
                    onChange={(event) =>
                      updatePreference('timezone', event.target.value)
                    }
                  >
                    <option>Maroc (GMT+1)</option>
                    <option>UTC</option>
                    <option>Europe/Paris</option>
                  </select>
                </label>
              </div>
            </ProfileCard>

            <ProfileCard
              icon={ShieldCheck}
              title="Sécurité du compte"
              subtitle="Protégez votre compte et vos données."
            >
              <div className="admin-profile-security-list">
                {securityRows.map((row) => {
                  const Icon = row.icon

                  return (
                    <button
                      type="button"
                      key={row.title}
                      onClick={() => handleSecurityAction(row.title)}
                    >
                      <Icon size={23} strokeWidth={1.8} />
                      <div>
                        <strong>{row.title}</strong>
                        <span>{row.description}</span>
                      </div>
                      <small className={row.success ? 'is-success' : ''}>
                        {row.value}
                      </small>
                      <ChevronRight size={17} strokeWidth={1.7} />
                    </button>
                  )
                })}
              </div>
            </ProfileCard>

            <ProfileCard
              icon={Clock3}
              title="Activité récente"
              subtitle="Vos dernières actions sur la plateforme."
            >
              <div className="admin-profile-activity-list">
                {activityItems.map((item) => {
                  const Icon = item.icon

                  return (
                    <div key={item.title}>
                      <span className="admin-profile-activity-dot" />
                      <Icon size={20} strokeWidth={1.8} />
                      <div>
                        <strong>{item.title}</strong>
                        <span>{item.description}</span>
                      </div>
                      <small>{item.time}</small>
                    </div>
                  )
                })}
              </div>

              <button
                className="admin-profile-activity-button"
                type="button"
                onClick={showFullActivity}
              >
                Voir toute l'activité
                <ChevronRight size={15} strokeWidth={1.7} />
              </button>
            </ProfileCard>

            <ProfileCard
              icon={BarChart3}
              title="Statistiques du compte"
              subtitle="Votre activité en quelques chiffres."
            >
              <div className="admin-profile-stats-grid">
                {statItems.map((stat) => {
                  const Icon = stat.icon

                  return (
                    <div className="admin-profile-stat-mini" key={stat.label}>
                      <Icon size={22} strokeWidth={1.8} />
                      <div>
                        <span>{stat.label}</span>
                        <strong>{stat.value}</strong>
                        {stat.change ? (
                          <small>↗ {stat.change} vs. mois dernier</small>
                        ) : (
                          <small className="is-online">
                            {stat.detail} · En ligne
                          </small>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </ProfileCard>
          </section>
        </main>
      </div>
    </div>
  )
}
