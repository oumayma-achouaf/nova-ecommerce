import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  Download,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  ReceiptText,
  Truck,
  UserRound,
  XCircle,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import AdminHeader from '../../components/layout/AdminHeader.jsx'
import AdminSidebar from '../../components/layout/AdminSidebar.jsx'
import {
  getOrders,
  orderStatusLabels,
  printInvoice,
  saveOrders,
} from '../../services/adminService.js'

const timelineProgressByStatus = {
  pending: 0,
  confirmed: 1,
  preparing: 2,
  shipped: 3,
  delivered: 4,
  cancelled: -1,
}

const statusActions = [
  {
    label: 'Confirmer',
    statusKey: 'confirmed',
    icon: CheckCircle2,
    primary: true,
  },
  {
    label: 'Preparer',
    statusKey: 'preparing',
    icon: PackageCheck,
  },
  {
    label: 'Marquer comme expediee',
    statusKey: 'shipped',
    icon: Truck,
  },
  {
    label: 'Marquer comme livree',
    statusKey: 'delivered',
    icon: CheckCircle2,
  },
]

const timelineItems = [
  ['created', 'Commande creee', '30 sept. 2026, 14:32'],
  ['paid', 'Paiement confirme', 'Carte bancaire validee'],
  ['preparing', 'Commande preparee', 'Articles en preparation'],
  ['shipped', 'Expediee', 'Transporteur Amana Express'],
  ['delivered', 'Livree', 'Confirmation client attendue'],
]

function normalizeOrderId(id) {
  return id ? id.replace(/^#/, '') : ''
}

function DetailRow({ label, value }) {
  return (
    <div className="order-details-info-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

export default function OrderDetails() {
  const { id } = useParams()
  const [orders, setOrders] = useState(() => getOrders())
  const [notice, setNotice] = useState('')
  const order = useMemo(
    () =>
      orders.find(
        (currentOrder) =>
          normalizeOrderId(currentOrder.id) === normalizeOrderId(id),
      ),
    [id, orders],
  )

  if (!order) {
    return (
      <div className="admin-layout">
        <AdminSidebar />

        <div className="admin-main">
          <AdminHeader />

          <main className="admin-dashboard order-details-page">
            <section className="order-details-heading">
              <div>
                <h1>Commande introuvable</h1>
                <p>Aucune commande locale ne correspond a cet identifiant.</p>
              </div>
              <Link
                className="order-details-action order-details-action--primary"
                to="/admin/commandes"
              >
                Retour aux commandes
              </Link>
            </section>
          </main>
        </div>
      </div>
    )
  }

  const updateStatus = (nextStatusKey) => {
    const nextOrders = orders.map((currentOrder) =>
      currentOrder.id === order.id
        ? {
            ...currentOrder,
            statusClass: nextStatusKey,
            status: orderStatusLabels[nextStatusKey],
          }
        : currentOrder,
    )

    setOrders(nextOrders)
    saveOrders(nextOrders)
    setNotice(`Statut mis a jour : ${orderStatusLabels[nextStatusKey]}.`)
  }

  const progressIndex = timelineProgressByStatus[order.statusClass] ?? -1
  const trackingNumber =
    order.statusClass === 'shipped' || order.statusClass === 'delivered'
      ? `NVA-CASA-${normalizeOrderId(order.id)}`
      : 'Non attribue'

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
        <AdminHeader />

        <main className="admin-dashboard order-details-page">
          <section className="order-details-breadcrumb">
            <Link to="/admin">Accueil</Link>
            <ChevronRight size={14} strokeWidth={1.7} />
            <Link to="/admin/commandes">Commandes</Link>
            <ChevronRight size={14} strokeWidth={1.7} />
            <strong>Commande {order.id}</strong>
          </section>

          <section className="order-details-heading">
            <div className="order-details-heading__title">
              <Link
                className="order-details-back"
                to="/admin/commandes"
                aria-label="Retour aux commandes"
              >
                <ArrowLeft size={18} strokeWidth={1.8} />
              </Link>
              <div>
                <div className="order-details-title-line">
                  <h1>Commande {order.id}</h1>
                  <span
                    className={`orders-status orders-status--${order.statusClass}`}
                  >
                    {order.status}
                  </span>
                </div>
                <p>Commande passee le {order.date}</p>
              </div>
            </div>

            <div className="order-details-actions">
              {statusActions.map((action) => {
                const Icon = action.icon

                return (
                  <button
                    className={
                      action.primary
                        ? 'order-details-action order-details-action--primary'
                        : 'order-details-action'
                    }
                    key={action.statusKey}
                    type="button"
                    onClick={() => updateStatus(action.statusKey)}
                  >
                    <Icon size={16} strokeWidth={1.8} />
                    <span>{action.label}</span>
                  </button>
                )
              })}

              <button
                className="order-details-action order-details-action--danger"
                type="button"
                onClick={() => updateStatus('cancelled')}
              >
                <XCircle size={16} strokeWidth={1.8} />
                <span>Annuler</span>
              </button>
              <button
                className="order-details-action"
                type="button"
                onClick={() => printInvoice(order)}
              >
                <Download size={16} strokeWidth={1.8} />
                <span>Imprimer / telecharger facture</span>
              </button>
            </div>
          </section>

          {notice ? <p className="order-details-notice">{notice}</p> : null}

          <section className="order-details-summary-grid">
            <div className="dashboard-card order-details-summary-card">
              <CalendarDays size={19} strokeWidth={1.7} />
              <span>Date</span>
              <strong>{order.date}</strong>
            </div>
            <div className="dashboard-card order-details-summary-card">
              <CreditCard size={19} strokeWidth={1.7} />
              <span>Paiement</span>
              <strong>{order.payment}</strong>
            </div>
            <div className="dashboard-card order-details-summary-card">
              <Truck size={19} strokeWidth={1.7} />
              <span>Livraison</span>
              <strong>{trackingNumber}</strong>
            </div>
            <div className="dashboard-card order-details-summary-card">
              <ReceiptText size={19} strokeWidth={1.7} />
              <span>Total</span>
              <strong>{order.amount}</strong>
            </div>
          </section>

          <section className="order-details-grid">
            <div className="order-details-main-column">
              <div className="dashboard-card order-details-card">
                <div className="order-details-card__header">
                  <h2>Resume de la commande</h2>
                </div>
                <div className="order-details-info-grid">
                  <DetailRow label="Numero de commande" value={order.id} />
                  <DetailRow label="Date" value={order.date} />
                  <DetailRow label="Statut" value={order.status} />
                  <DetailRow label="Mode de paiement" value={order.payment} />
                  <DetailRow label="Mode de livraison" value="Standard 48h" />
                  <DetailRow label="Numero de suivi" value={trackingNumber} />
                </div>
              </div>

              <div className="dashboard-card order-details-card">
                <div className="order-details-card__header">
                  <h2>Produits commandes</h2>
                  <span>{order.products}</span>
                </div>
                <div className="order-details-table-wrap">
                  <table className="order-details-products-table">
                    <thead>
                      <tr>
                        <th>Produit</th>
                        <th>SKU</th>
                        <th>Prix unitaire</th>
                        <th>Qte</th>
                        <th>Sous-total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className="order-details-product-cell">
                            <div className="order-details-product-thumb order-details-product-thumb--sneakers" />
                            <div>
                              <strong>Selection NOVA</strong>
                              <span>Articles de la commande</span>
                            </div>
                          </div>
                        </td>
                        <td>LOCAL</td>
                        <td>{order.amount}</td>
                        <td>{order.products}</td>
                        <td>
                          <strong>{order.amount}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="dashboard-card order-details-card">
                <div className="order-details-card__header">
                  <h2>Chronologie</h2>
                </div>
                <div className="order-details-timeline">
                  {timelineItems.map(([key, label, detail], index) => {
                    const isComplete =
                      index <= progressIndex && order.statusClass !== 'cancelled'

                    return (
                      <div
                        className={
                          isComplete
                            ? 'order-details-timeline__item is-complete'
                            : 'order-details-timeline__item'
                        }
                        key={key}
                      >
                        <span />
                        <div>
                          <strong>{label}</strong>
                          <small>{detail}</small>
                        </div>
                      </div>
                    )
                  })}
                  {order.statusClass === 'cancelled' ? (
                    <div className="order-details-timeline__item is-cancelled">
                      <span />
                      <div>
                        <strong>Commande annulee</strong>
                        <small>Action enregistree localement</small>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <aside className="order-details-side-column">
              <div className="dashboard-card order-details-card">
                <div className="order-details-card__header">
                  <h2>Client</h2>
                  <Link to={`/admin/clients/${order.customerId}`}>
                    Voir le profil
                  </Link>
                </div>
                <div className="order-details-customer-card">
                  <div className="order-details-avatar">{order.initials}</div>
                  <div>
                    <strong>{order.customer}</strong>
                    <span>
                      <Mail size={14} strokeWidth={1.7} />
                      client@nova.local
                    </span>
                    <span>
                      <Phone size={14} strokeWidth={1.7} />
                      +212 6 61 23 45 67
                    </span>
                  </div>
                </div>
                <div className="order-details-customer-meta">
                  <div>
                    <UserRound size={16} strokeWidth={1.7} />
                    <span>Client local NOVA</span>
                  </div>
                  <div>
                    <ReceiptText size={16} strokeWidth={1.7} />
                    <span>{order.products}</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-card order-details-card">
                <div className="order-details-card__header">
                  <h2>Adresse de livraison</h2>
                </div>
                <div className="order-details-address">
                  <MapPin size={18} strokeWidth={1.8} />
                  <p>
                    <span>{order.customer}</span>
                    <span>123 Avenue Mohammed V</span>
                    <span>Casablanca, Maroc</span>
                  </p>
                </div>
              </div>

              <div className="dashboard-card order-details-card">
                <div className="order-details-card__header">
                  <h2>Totaux</h2>
                </div>
                <div className="order-details-totals">
                  <div>
                    <span>Sous-total</span>
                    <strong>{order.amount}</strong>
                  </div>
                  <div>
                    <span>Livraison</span>
                    <strong>Incluse</strong>
                  </div>
                  <div className="order-details-totals__final">
                    <strong>Total</strong>
                    <strong>{order.amount}</strong>
                  </div>
                </div>
              </div>

              <div className="dashboard-card order-details-card order-details-delivery-card">
                <Clock3 size={18} strokeWidth={1.8} />
                <div>
                  <strong>Creneau estime</strong>
                  <span>2 oct. 2026, entre 10:00 et 14:00</span>
                </div>
              </div>
            </aside>
          </section>
        </main>
      </div>
    </div>
  )
}
