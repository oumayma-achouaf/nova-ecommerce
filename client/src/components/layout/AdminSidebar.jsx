import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Grid2X2,
  Users,
  Tag,
  BarChart3,
  MessageSquare,
  Settings,
  LogOut,
} from 'lucide-react'

import { NavLink, useNavigate } from 'react-router-dom'

import useAuth from '../../hooks/useAuth.js'

const menuItems = [
  {
    label: 'Tableau de bord',
    icon: LayoutDashboard,
    to: '/admin',
    end: true,
  },
  {
    label: 'Commandes',
    icon: ShoppingBag,
    to: '/admin/commandes',
    badge: 12,
  },
  {
    label: 'Produits',
    icon: Package,
    to: '/admin/produits',
  },
  {
    label: 'Catégories',
    icon: Grid2X2,
    to: '/admin/categories',
  },
  {
    label: 'Clients',
    icon: Users,
    to: '/admin/clients',
  },
  {
    label: 'Promotions',
    icon: Tag,
    to: '/admin/promotions',
  },
  {
    label: 'Analyses',
    icon: BarChart3,
    to: '/admin/analyses',
  },
  {
    label: 'Messages',
    icon: MessageSquare,
    to: '/admin/messages',
    badge: 3,
  },
  {
    label: 'Paramètres',
    icon: Settings,
    to: '/admin/parametres',
  },
]

export default function AdminSidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/connexion', {
      replace: true,
    })
  }

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <h1>NOVA</h1>
        <span>ADMIN</span>
      </div>

      <nav className="admin-sidebar__nav">
        {menuItems.map(
          ({
            label,
            icon: Icon,
            to,
            badge,
            end,
          }) => (
            <NavLink
              key={label}
              to={to}
              end={end}
              className={({ isActive }) =>
                `admin-sidebar__item ${
                  isActive ? 'is-active' : ''
                }`
              }
              style={{
                textDecoration: 'none',
              }}
            >
              <div className="admin-sidebar__item-left">
                <Icon
                  size={20}
                  strokeWidth={1.8}
                />

                <span>{label}</span>
              </div>

              {badge ? (
                <span className="admin-sidebar__badge">
                  {badge}
                </span>
              ) : null}
            </NavLink>
          ),
        )}
      </nav>

      <button
        className="admin-sidebar__logout"
        type="button"
        onClick={handleLogout}
      >
        <LogOut
          size={20}
          strokeWidth={1.8}
        />

        <span>Déconnexion</span>
      </button>
    </aside>
  )
}
