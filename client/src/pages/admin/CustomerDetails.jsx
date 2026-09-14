import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  CreditCard,
  Eye,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  ReceiptText,
  ShoppingBag,
  Tag,
  UserRound,
  WalletCards,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import AdminHeader from '../../components/layout/AdminHeader.jsx'
import AdminSidebar from '../../components/layout/AdminSidebar.jsx'
import {
  getCustomers,
  saveCustomers,
} from '../../services/adminService.js'

const recentOrders = [
  {
    id: '10024',
    date: '30 sept. 2026',
    products: '3 articles',
    amount: '1 290 DH',
    payment: 'Payee',
    status: 'En attente',
    statusClass: 'pending',
  },
  {
    id: '10019',
    date: '26 sept. 2026',
    products: '2 articles',
    amount: '980 DH',
    payment: 'Payee',
    status: 'Confirmee',
    statusClass: 'confirmed',
  },
  {
    id: '10012',
    date: '18 sept. 2026',
    products: '1 article',
    amount: '680 DH',
    payment: 'Payee',
    status: 'Livree',
    statusClass: 'delivered',
  },
]

const activityItems = [
  'Commande #10024 creee',
  'Paiement carte valide',
  'Adresse de livraison confirmee',
]

const tagPool = [
  'VIP',
  'Casablanca',
  'Paiement carte',
  'Fidele',
  'Reactivation',
  'Support',
]

function CustomerStatCard({ icon: Icon, value, label }) {
  return (
    <div className="customer-details-stat-card">
      <div className="customer-details-stat-card__icon">
        <Icon size={24} strokeWidth={1.7} />
      </div>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  )
}

function formatAmount(amount) {
  return new Intl.NumberFormat('fr-FR').format(amount).replace(/\u202f/g, ' ')
}

export default function CustomerDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [customers, setCustomers] = useState(() => getCustomers())
  const customer = useMemo(
    () =>
      customers.find(
        (currentCustomer) => String(currentCustomer.id) === String(id),
      ),
    [customers, id],
  )
  const [notice, setNotice] = useState('')

  if (!customer) {
    return (
      <div className="admin-layout">
        <AdminSidebar />

        <div className="admin-main">
          <AdminHeader />

          <main className="admin-dashboard customer-details-page">
            <section className="customer-details-heading">
              <div>
                <h1>Client introuvable</h1>
                <p>Aucun client local ne correspond a cet identifiant.</p>
              </div>
              <Link
                className="customer-details-status-toggle"
                to="/admin/clients"
              >
                Retour aux clients
              </Link>
            </section>
          </main>
        </div>
      </div>
    )
  }

  const updateCustomer = (nextPatch) => {
    const nextCustomers = customers.map((currentCustomer) =>
      currentCustomer.id === customer.id
        ? {
            ...currentCustomer,
            ...nextPatch,
          }
        : currentCustomer,
    )

    setCustomers(nextCustomers)
    saveCustomers(nextCustomers)
    setNotice('Client mis a jour localement.')
  }

  const isActive = customer.statusType === 'active'

  const toggleTag = (tagName) => {
    const tags = customer.tags || []
    const nextTags = tags.includes(tagName)
      ? tags.filter((tag) => tag !== tagName)
      : [...tags, tagName]

    updateCustomer({
      tags: nextTags,
    })
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
        <AdminHeader />

        <main className="admin-dashboard customer-details-page">
          <section className="customer-details-breadcrumb">
            <Link to="/admin">Accueil</Link>
            <ChevronRight size={14} strokeWidth={1.7} />
            <Link to="/admin/clients">Clients</Link>
            <ChevronRight size={14} strokeWidth={1.7} />
            <strong>{customer.name}</strong>
          </section>

          <section className="customer-details-heading">
            <div className="customer-details-heading__title">
              <Link
                className="customer-details-back"
                to="/admin/clients"
                aria-label="Retour aux clients"
              >
                <ArrowLeft size={18} strokeWidth={1.8} />
              </Link>

              <div>
                <h1>{customer.name}</h1>
                <p>Details du client et historique commercial.</p>
              </div>
            </div>

            <button
              className={
                isActive
                  ? 'customer-details-status-toggle'
                  : 'customer-details-status-toggle is-muted'
              }
              type="button"
              onClick={() =>
                updateCustomer({
                  statusType: isActive ? 'inactive' : 'active',
                  status: isActive ? 'Inactif' : 'Actif',
                })
              }
            >
              <UserRound size={17} strokeWidth={1.8} />
              <span>{isActive ? 'Suspendre' : 'Reactiver'}</span>
            </button>
          </section>

          {notice ? <p className="admin-local-notice">{notice}</p> : null}

          <section className="customer-details-profile-grid">
            <div className="dashboard-card customer-details-profile-card">
              <div className="customer-details-profile-main">
                <div className="customer-details-avatar">
                  {customer.initials}
                </div>
                <div>
                  <div className="customer-details-profile-title">
                    <h2>{customer.name}</h2>
                    <span
                      className={`admin-listing-status admin-listing-status--${customer.statusType}`}
                    >
                      {customer.status}
                    </span>
                  </div>
                  <div className="customer-details-contact-grid">
                    <span>
                      <Mail size={15} strokeWidth={1.7} />
                      {customer.email}
                    </span>
                    <span>
                      <Phone size={15} strokeWidth={1.7} />
                      {customer.phone}
                    </span>
                    <span>
                      <MapPin size={15} strokeWidth={1.7} />
                      {customer.city}
                    </span>
                    <span>
                      <CalendarDays size={15} strokeWidth={1.7} />
                      Inscrit le {customer.date}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="customer-details-stats">
              <CustomerStatCard
                icon={ShoppingBag}
                value={customer.orders}
                label="Total commandes"
              />
              <CustomerStatCard
                icon={WalletCards}
                value={`${formatAmount(customer.spent)} DH`}
                label="Montant depense"
              />
              <CustomerStatCard
                icon={CreditCard}
                value={
                  customer.orders
                    ? `${formatAmount(Math.round(customer.spent / customer.orders))} DH`
                    : '0 DH'
                }
                label="Panier moyen"
              />
              <CustomerStatCard
                icon={ReceiptText}
                value="#10024"
                label="Derniere commande"
              />
            </div>
          </section>

          <section className="customer-details-content-grid">
            <div className="customer-details-main-column">
              <div className="dashboard-card customer-details-card">
                <div className="customer-details-card__header">
                  <h2>Commandes recentes</h2>
                  <span>{recentOrders.length} commandes</span>
                </div>

                <div className="customer-details-table-wrap">
                  <table className="customer-details-orders-table">
                    <thead>
                      <tr>
                        <th>Commande</th>
                        <th>Date</th>
                        <th>Produits</th>
                        <th>Montant</th>
                        <th>Paiement</th>
                        <th>Statut</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td>
                            <strong>#{order.id}</strong>
                          </td>
                          <td>{order.date}</td>
                          <td>{order.products}</td>
                          <td>{order.amount}</td>
                          <td>{order.payment}</td>
                          <td>
                            <span
                              className={`orders-status orders-status--${order.statusClass}`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <button
                              className="customer-details-order-action"
                              type="button"
                              aria-label={`Voir la commande #${order.id}`}
                              onClick={() =>
                                navigate(`/admin/commandes/${order.id}`)
                              }
                            >
                              <Eye size={17} strokeWidth={1.8} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <aside className="customer-details-side-column">
              <div className="dashboard-card customer-details-card">
                <div className="customer-details-card__header">
                  <h2>Adresse principale</h2>
                </div>
                <div className="customer-details-address">
                  <MapPin size={18} strokeWidth={1.8} />
                  <p>
                    <strong>{customer.name}</strong>
                    <span>{customer.city}, Maroc</span>
                    <span>{customer.phone}</span>
                  </p>
                </div>
              </div>

              <div className="dashboard-card customer-details-card">
                <div className="customer-details-card__header">
                  <h2>Tags</h2>
                </div>
                <div className="customer-details-tags">
                  {tagPool.map((tagName) => (
                    <button
                      className={
                        customer.tags?.includes(tagName) ? 'is-selected' : ''
                      }
                      key={tagName}
                      type="button"
                      onClick={() => toggleTag(tagName)}
                    >
                      <Tag size={13} strokeWidth={1.8} />
                      <span>{tagName}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="dashboard-card customer-details-card">
                <div className="customer-details-card__header">
                  <h2>Notes</h2>
                </div>
                <label className="customer-details-note">
                  <MessageSquareText size={17} strokeWidth={1.8} />
                  <textarea
                    value={customer.note || ''}
                    onChange={(event) =>
                      updateCustomer({
                        note: event.target.value,
                      })
                    }
                  />
                </label>
              </div>

              <div className="dashboard-card customer-details-card">
                <div className="customer-details-card__header">
                  <h2>Activite recente</h2>
                </div>
                <div className="customer-details-activity">
                  {activityItems.map((item) => (
                    <div key={item}>
                      <span />
                      <strong>{item}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </section>
        </main>
      </div>
    </div>
  )
}
