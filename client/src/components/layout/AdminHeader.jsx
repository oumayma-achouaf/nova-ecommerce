import {
  Search,
  Bell,
  ChevronDown,
  Check,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
  adminProfileChangedEvent,
  getAdminProfile,
} from '../../services/adminService.js'

const searchTargets = [
  {
    label: 'Tableau de bord',
    keywords: ['dashboard', 'stats', 'ventes', 'tableau'],
    to: '/admin',
  },
  {
    label: 'Commandes',
    keywords: ['commande', 'orders', 'facture', 'livraison'],
    to: '/admin/commandes',
  },
  {
    label: 'Produits',
    keywords: ['produit', 'stock', 'sku', 'catalogue'],
    to: '/admin/produits',
  },
  {
    label: 'Categories',
    keywords: ['categorie', 'collection', 'rayon'],
    to: '/admin/categories',
  },
  {
    label: 'Clients',
    keywords: ['client', 'customer', 'notes', 'tags'],
    to: '/admin/clients',
  },
  {
    label: 'Promotions',
    keywords: ['promotion', 'coupon', 'code', 'remise'],
    to: '/admin/promotions',
  },
  {
    label: 'Analyses',
    keywords: ['analyse', 'analytics', 'rapport', 'performance'],
    to: '/admin/analyses',
  },
  {
    label: 'Messages',
    keywords: ['message', 'support', 'conversation'],
    to: '/admin/messages',
  },
  {
    label: 'Parametres',
    keywords: ['parametre', 'settings', 'paiement', 'securite'],
    to: '/admin/parametres',
  },
  {
    label: 'Profil administrateur',
    keywords: ['profil', 'admin', 'avatar'],
    to: '/admin/profil',
  },
]

const initialNotifications = [
  {
    id: 1,
    title: 'Commande #10024 en attente',
    detail: 'Un client attend une confirmation.',
    unread: true,
  },
  {
    id: 2,
    title: 'Stock faible',
    detail: 'Pull en cachemire atteint le seuil.',
    unread: true,
  },
  {
    id: 3,
    title: 'Message client',
    detail: 'Nouvelle reponse dans Messages.',
    unread: false,
  },
]

export default function AdminHeader({
  searchPlaceholder = 'Rechercher une commande, un produit, un client...',
}) {
  const navigate = useNavigate()
  const panelRef = useRef(null)
  const [query, setQuery] = useState('')
  const [profile, setProfile] = useState(() => getAdminProfile())
  const [notifications, setNotifications] = useState(initialNotifications)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  useEffect(() => {
    const handleProfileChange = (event) => {
      setProfile(event.detail || getAdminProfile())
    }

    window.addEventListener(adminProfileChangedEvent, handleProfileChange)

    return () => {
      window.removeEventListener(
        adminProfileChangedEvent,
        handleProfileChange,
      )
    }
  }, [])

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [])

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return []
    }

    return searchTargets.filter((target) => {
      const searchable = [
        target.label,
        ...target.keywords,
      ]
        .join(' ')
        .toLowerCase()

      return searchable.includes(normalizedQuery)
    })
  }, [query])

  const unreadCount = notifications.filter(
    (notification) => notification.unread,
  ).length

  const submitSearch = (event) => {
    event.preventDefault()

    if (results[0]) {
      navigate(results[0].to)
      setQuery('')
    }
  }

  const openResult = (to) => {
    navigate(to)
    setQuery('')
  }

  const markAllRead = () => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({
        ...notification,
        unread: false,
      })),
    )
  }

  return (
    <header className="admin-header">
      <form
        className="admin-header__search"
        onSubmit={submitSearch}
      >
        <Search size={19} strokeWidth={1.8} />
        <input
          type="search"
          value={query}
          placeholder={searchPlaceholder}
          onChange={(event) => setQuery(event.target.value)}
        />

        {results.length > 0 ? (
          <div className="admin-header__search-results">
            {results.slice(0, 5).map((result) => (
              <button
                key={result.to}
                type="button"
                onClick={() => openResult(result.to)}
              >
                {result.label}
              </button>
            ))}
          </div>
        ) : null}
      </form>

      <div className="admin-header__right">
        <div
          className="admin-header__notification-wrap"
          ref={panelRef}
        >
          <button
            className="admin-header__notification"
            type="button"
            aria-label="Notifications"
            aria-expanded={isNotificationOpen}
            onClick={() =>
              setIsNotificationOpen((isOpen) => !isOpen)
            }
          >
            <Bell size={20} strokeWidth={1.8} />
            {unreadCount > 0 ? (
              <span className="admin-header__notification-dot">
                {unreadCount}
              </span>
            ) : null}
          </button>

          {isNotificationOpen ? (
            <div className="admin-header__notification-panel">
              <div className="admin-header__notification-heading">
                <strong>Notifications</strong>
                <button type="button" onClick={markAllRead}>
                  <Check size={14} />
                  Tout lu
                </button>
              </div>

              {notifications.map((notification) => (
                <button
                  type="button"
                  className={
                    notification.unread ? 'is-unread' : ''
                  }
                  key={notification.id}
                  onClick={() => {
                    setNotifications((currentNotifications) =>
                      currentNotifications.map((item) =>
                        item.id === notification.id
                          ? {
                              ...item,
                              unread: false,
                            }
                          : item,
                      ),
                    )
                  }}
                >
                  <strong>{notification.title}</strong>
                  <span>{notification.detail}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <span className="admin-header__divider" />

        <Link
          className="admin-header__profile"
          to="/admin/profil"
          aria-label="Ouvrir le profil administrateur"
        >
          <div className="admin-header__avatar">
            <span>{profile.initials}</span>
          </div>

          <div className="admin-header__profile-text">
            <strong>{profile.fullName}</strong>
            <span>{profile.role}</span>
          </div>

          <ChevronDown size={17} strokeWidth={1.8} />
        </Link>
      </div>
    </header>
  )
}
