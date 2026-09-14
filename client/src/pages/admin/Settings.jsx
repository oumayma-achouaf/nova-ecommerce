import {
  ChevronRight,
  Cloud,
  Code2,
  Copy,
  CreditCard,
  Database,
  Gift,
  Globe2,
  HelpCircle,
  KeyRound,
  Lock,
  Mail,
  Monitor,
  Package,
  RefreshCcw,
  Save,
  Settings as SettingsIcon,
  ShieldCheck,
  Smartphone,
  Store,
  Truck,
  Wrench,
} from 'lucide-react'
import { useState } from 'react'

import AdminHeader from '../../components/layout/AdminHeader.jsx'
import AdminSidebar from '../../components/layout/AdminSidebar.jsx'

const initialStoreSettings = {
  storeName: 'NOVA',
  email: 'contact@nova.ma',
  phone: '+212 6 12 34 56 78',
  address: '123 Avenue Mohammed V\nCasablanca, Maroc',
  currency: 'DH (Dirham marocain)',
  language: 'Français',
}

const initialPreferences = {
  emailNotifications: true,
  maintenanceMode: false,
  stockDisplay: true,
  timezone: 'Maroc (GMT+1)',
}

const initialShipping = {
  standard: '40',
  express: '70',
  freeFrom: '600',
}

const supportItems = [
  {
    icon: Cloud,
    title: 'Dernière sauvegarde',
    detail: '28 sept. 2024 à 02:30',
    badge: 'Réussie',
  },
  {
    icon: Code2,
    title: 'Clé API',
    detail: 'sk_live_••••••••••••••••',
    badge: 'Active',
    copy: true,
  },
  {
    icon: HelpCircle,
    title: 'Centre d’aide',
    detail:
      'Consultez notre documentation ou contactez notre équipe support.',
    arrow: true,
  },
]

const securityRows = [
  {
    icon: KeyRound,
    title: 'Changer le mot de passe',
    detail: 'Choisissez un mot de passe sécurisé.',
  },
  {
    icon: Smartphone,
    title: 'Authentification à deux facteurs',
    detail: 'Renforcez la sécurité de votre compte.',
    badge: 'Désactivée',
  },
  {
    icon: Monitor,
    title: 'Sessions actives',
    detail: 'Gérez vos sessions sur tous vos appareils.',
    badge: '2 sessions',
  },
]

const paymentRows = [
  {
    icon: CreditCard,
    title: 'Carte bancaire',
    detail: 'Visa, Mastercard, CMI',
  },
  {
    type: 'paypal',
    title: 'PayPal',
    detail: 'Paiements sécurisés',
  },
  {
    icon: CreditCard,
    title: 'Paiement à la livraison',
    detail: 'Règlement à la réception',
  },
]

const settingsStorageKey = 'nova_admin_settings'

const initialPaymentState = paymentRows.reduce((state, row) => {
  state[row.title] = true
  return state
}, {})

function loadStoredSettings() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return JSON.parse(window.localStorage.getItem(settingsStorageKey))
  } catch {
    return null
  }
}

function Toggle({
  checked,
  onChange,
  label,
}) {
  return (
    <button
      className={`settings-toggle ${checked ? 'is-on' : ''}`}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
    >
      <span />
    </button>
  )
}

function SettingsCardHeader({
  icon: Icon,
  title,
  subtitle,
}) {
  return (
    <div className="settings-card-header">
      <div className="settings-card-header__icon">
        <Icon size={26} strokeWidth={1.7} />
      </div>

      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  )
}

export default function Settings() {
  const [storeSettings, setStoreSettings] = useState(
    () => loadStoredSettings()?.storeSettings || initialStoreSettings,
  )
  const [preferences, setPreferences] = useState(
    () => loadStoredSettings()?.preferences || initialPreferences,
  )
  const [shipping, setShipping] = useState(
    () => loadStoredSettings()?.shipping || initialShipping,
  )
  const [paymentMethods, setPaymentMethods] = useState(
    () => loadStoredSettings()?.paymentMethods || initialPaymentState,
  )
  const [saved, setSaved] = useState(false)
  const [feedback, setFeedback] = useState('')

  const updateStoreSetting = (key, value) => {
    setStoreSettings((currentSettings) => ({
      ...currentSettings,
      [key]: value,
    }))
    setSaved(false)
  }

  const updatePreference = (key) => {
    setPreferences((currentPreferences) => ({
      ...currentPreferences,
      [key]: !currentPreferences[key],
    }))
    setSaved(false)
  }

  const updateShipping = (key, value) => {
    setShipping((currentShipping) => ({
      ...currentShipping,
      [key]: value,
    }))
    setSaved(false)
  }

  const resetSettings = () => {
    setStoreSettings(initialStoreSettings)
    setPreferences(initialPreferences)
    setShipping(initialShipping)
    setPaymentMethods(initialPaymentState)
    setSaved(false)
    setFeedback('Parametres locaux reinitialises.')
    window.localStorage.removeItem(settingsStorageKey)
  }

  const saveSettings = () => {
    const shippingValues = Object.values(shipping).map((value) =>
      Number(value),
    )

    if (!storeSettings.email.includes('@')) {
      setSaved(false)
      setFeedback('Veuillez saisir une adresse email valide.')
      return
    }

    if (
      shippingValues.some(
        (value) => Number.isNaN(value) || value < 0,
      )
    ) {
      setSaved(false)
      setFeedback('Les frais de livraison doivent etre des nombres positifs.')
      return
    }

    window.localStorage.setItem(
      settingsStorageKey,
      JSON.stringify({
        storeSettings,
        preferences,
        shipping,
        paymentMethods,
      }),
    )
    setSaved(true)
    setFeedback('Modifications enregistrees localement.')
  }

  const openSecurityPanel = (title) => {
    setFeedback(`Section securite ouverte : ${title}.`)
  }

  const copyApiKey = async () => {
    const apiKey = 'sk_live_local_nova_demo'

    try {
      await navigator.clipboard.writeText(apiKey)
      setFeedback('Cle API copiee dans le presse-papiers.')
    } catch {
      setFeedback(`Cle API locale : ${apiKey}`)
    }
  }

  const openHelpCenter = () => {
    setFeedback('Centre d aide local ouvert : support@nova.ma.')
  }

  const togglePaymentMethod = (title) => {
    setPaymentMethods((currentMethods) => ({
      ...currentMethods,
      [title]: !currentMethods[title],
    }))
    setSaved(false)
    setFeedback(`Moyen de paiement mis a jour : ${title}.`)
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
        <AdminHeader />

        <main className="admin-dashboard settings-page">
          <section className="settings-page__breadcrumb">
            <span>Accueil</span>
            <ChevronRight size={14} strokeWidth={1.7} />
            <strong>Paramètres</strong>
          </section>

          <section className="settings-page__heading">
            <h1>Paramètres</h1>
            <p>
              Configurez votre boutique, vos préférences et votre
              sécurité.
            </p>
          </section>

          {feedback ? <p className="admin-local-notice">{feedback}</p> : null}

          <section className="settings-grid">
            <div className="settings-main-column">
              <div className="dashboard-card settings-card settings-store-card">
                <SettingsCardHeader
                  icon={Store}
                  title="Informations de la boutique"
                  subtitle="Ces informations seront visibles par vos clients."
                />

                <div className="settings-form-grid">
                  <label>
                    <span>Nom de la boutique</span>
                    <input
                      value={storeSettings.storeName}
                      onChange={(event) =>
                        updateStoreSetting(
                          'storeName',
                          event.target.value,
                        )
                      }
                    />
                  </label>

                  <label>
                    <span>Email</span>
                    <input
                      type="email"
                      value={storeSettings.email}
                      onChange={(event) =>
                        updateStoreSetting(
                          'email',
                          event.target.value,
                        )
                      }
                    />
                  </label>

                  <label>
                    <span>Téléphone</span>
                    <input
                      value={storeSettings.phone}
                      onChange={(event) =>
                        updateStoreSetting(
                          'phone',
                          event.target.value,
                        )
                      }
                    />
                  </label>

                  <label>
                    <span>Adresse</span>
                    <textarea
                      value={storeSettings.address}
                      onChange={(event) =>
                        updateStoreSetting(
                          'address',
                          event.target.value,
                        )
                      }
                    />
                  </label>

                  <label>
                    <span>Devise</span>
                    <select
                      value={storeSettings.currency}
                      onChange={(event) =>
                        updateStoreSetting(
                          'currency',
                          event.target.value,
                        )
                      }
                    >
                      <option>DH (Dirham marocain)</option>
                      <option>EUR</option>
                      <option>USD</option>
                    </select>
                  </label>

                  <label>
                    <span>Langue</span>
                    <select
                      value={storeSettings.language}
                      onChange={(event) =>
                        updateStoreSetting(
                          'language',
                          event.target.value,
                        )
                      }
                    >
                      <option>Français</option>
                      <option>Anglais</option>
                      <option>Arabe</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="dashboard-card settings-card settings-security-card">
                <SettingsCardHeader
                  icon={Lock}
                  title="Sécurité du compte"
                  subtitle="Sécurisez votre compte administrateur."
                />

                <div className="settings-list">
                  {securityRows.map((row) => {
                    const Icon = row.icon

                    return (
                      <button
                        type="button"
                        className="settings-list-row"
                        key={row.title}
                        onClick={() => openSecurityPanel(row.title)}
                      >
                        <Icon size={25} strokeWidth={1.8} />

                        <span>
                          <strong>{row.title}</strong>
                          <em>{row.detail}</em>
                        </span>

                        {row.badge ? (
                          <small>{row.badge}</small>
                        ) : null}

                        <ChevronRight size={18} strokeWidth={1.7} />
                      </button>
                    )
                  })}
                </div>

                <button
                  type="button"
                  className="settings-dark-button"
                  onClick={() => openSecurityPanel('Mot de passe')}
                >
                  <Lock size={17} strokeWidth={1.8} />
                  <span>Mettre à jour le mot de passe</span>
                </button>
              </div>
            </div>

            <div className="settings-main-column">
              <div className="dashboard-card settings-card settings-preferences-card">
                <SettingsCardHeader
                  icon={SettingsIcon}
                  title="Préférences générales"
                  subtitle="Personnalisez le fonctionnement de votre boutique."
                />

                <div className="settings-preferences-list">
                  <div>
                    <Mail size={25} strokeWidth={1.8} />
                    <span>
                      <strong>Notifications par email</strong>
                      <em>
                        Recevoir des notifications sur les
                        commandes, les clients et les activités
                        importantes.
                      </em>
                    </span>
                    <Toggle
                      checked={preferences.emailNotifications}
                      label="Notifications par email"
                      onChange={() =>
                        updatePreference('emailNotifications')
                      }
                    />
                  </div>

                  <div>
                    <Wrench size={25} strokeWidth={1.8} />
                    <span>
                      <strong>Mode maintenance</strong>
                      <em>
                        Mettre temporairement votre boutique hors
                        ligne.
                      </em>
                    </span>
                    <Toggle
                      checked={preferences.maintenanceMode}
                      label="Mode maintenance"
                      onChange={() =>
                        updatePreference('maintenanceMode')
                      }
                    />
                  </div>

                  <div>
                    <Package size={25} strokeWidth={1.8} />
                    <span>
                      <strong>Affichage des stocks</strong>
                      <em>
                        Afficher le niveau de stock aux clients.
                      </em>
                    </span>
                    <Toggle
                      checked={preferences.stockDisplay}
                      label="Affichage des stocks"
                      onChange={() =>
                        updatePreference('stockDisplay')
                      }
                    />
                  </div>

                  <label className="settings-timezone-row">
                    <Globe2 size={25} strokeWidth={1.8} />
                    <span>Fuseau horaire</span>
                    <select
                      value={preferences.timezone}
                      onChange={(event) => {
                        setPreferences((currentPreferences) => ({
                          ...currentPreferences,
                          timezone: event.target.value,
                        }))
                        setSaved(false)
                      }}
                    >
                      <option>Maroc (GMT+1)</option>
                      <option>Europe/Paris (GMT+2)</option>
                      <option>UTC</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="dashboard-card settings-card settings-shipping-card">
                <SettingsCardHeader
                  icon={Truck}
                  title="Expédition et livraison"
                  subtitle="Configurez vos options de livraison."
                />

                <div className="settings-shipping-list">
                  <div>
                    <ShieldCheck size={24} strokeWidth={1.8} />
                    <span>
                      <strong>Livraison standard</strong>
                      <em>2 à 5 jours ouvrés</em>
                    </span>
                    <label>
                      <input
                        value={shipping.standard}
                        onChange={(event) =>
                          updateShipping(
                            'standard',
                            event.target.value,
                          )
                        }
                      />
                      <small>DH</small>
                    </label>
                  </div>

                  <div>
                    <ShieldCheck size={24} strokeWidth={1.8} />
                    <span>
                      <strong>Livraison express</strong>
                      <em>24 à 48 heures</em>
                    </span>
                    <label>
                      <input
                        value={shipping.express}
                        onChange={(event) =>
                          updateShipping(
                            'express',
                            event.target.value,
                          )
                        }
                      />
                      <small>DH</small>
                    </label>
                  </div>

                  <div>
                    <Gift size={24} strokeWidth={1.8} />
                    <span>
                      <strong>Livraison gratuite dès</strong>
                      <em>Montant minimum de commande</em>
                    </span>
                    <label>
                      <input
                        value={shipping.freeFrom}
                        onChange={(event) =>
                          updateShipping(
                            'freeFrom',
                            event.target.value,
                          )
                        }
                      />
                      <small>DH</small>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <aside className="settings-side-column">
              <div className="dashboard-card settings-card settings-support-card">
                <SettingsCardHeader
                  icon={Database}
                  title="Sauvegarde & support"
                  subtitle="Gérez vos données et accédez à l’assistance."
                />

                <div className="settings-support-list">
                  {supportItems.map((item) => {
                    const Icon = item.icon

                    return (
                      <div key={item.title}>
                        <Icon size={27} strokeWidth={1.7} />

                        <span>
                          <strong>{item.title}</strong>
                          <em>{item.detail}</em>
                        </span>

                        {item.badge ? (
                          <small>{item.badge}</small>
                        ) : null}

                        {item.copy ? (
                          <button
                            type="button"
                            onClick={copyApiKey}
                            aria-label="Copier la clé API"
                          >
                            <Copy
                              size={18}
                              strokeWidth={1.7}
                            />
                          </button>
                        ) : null}

                        {item.arrow ? (
                          <button
                            type="button"
                            aria-label="Ouvrir le centre d'aide"
                            onClick={openHelpCenter}
                          >
                            <ChevronRight
                              size={19}
                              strokeWidth={1.7}
                            />
                          </button>
                        ) : null}
                      </div>
                    )
                  })}
                </div>

                <button
                  type="button"
                  className="settings-dark-button"
                  onClick={saveSettings}
                >
                  <Save size={17} strokeWidth={1.8} />
                  <span>Enregistrer les modifications</span>
                </button>

                <button
                  type="button"
                  className="settings-reset-button"
                  onClick={resetSettings}
                >
                  <RefreshCcw size={17} strokeWidth={1.8} />
                  <span>Réinitialiser</span>
                </button>

                <p className="settings-reset-note">
                  Cette action réinitialisera uniquement les
                  paramètres de cette page.
                </p>

                {saved ? (
                  <p className="settings-save-note">
                    Modifications enregistrées localement.
                  </p>
                ) : null}
              </div>

              <div className="dashboard-card settings-card settings-payments-card">
                <SettingsCardHeader
                  icon={CreditCard}
                  title="Paiements"
                  subtitle="Gérez les moyens de paiement acceptés."
                />

                <div className="settings-payment-list">
                  {paymentRows.map((row) => {
                    const Icon = row.icon

                    return (
                      <button
                        className="settings-payment-row"
                        type="button"
                        key={row.title}
                        onClick={() => togglePaymentMethod(row.title)}
                      >
                        {row.type === 'paypal' ? (
                          <span className="settings-paypal-icon">
                            P
                          </span>
                        ) : (
                          <Icon
                            size={24}
                            strokeWidth={1.8}
                          />
                        )}

                        <span>
                          <strong>{row.title}</strong>
                          <em>{row.detail}</em>
                        </span>

                        <small>
                          {paymentMethods[row.title] ? 'Actif' : 'Inactif'}
                        </small>
                        <ChevronRight
                          size={18}
                          strokeWidth={1.7}
                        />
                      </button>
                    )
                  })}
                </div>
              </div>
            </aside>
          </section>
        </main>
      </div>
    </div>
  )
}
