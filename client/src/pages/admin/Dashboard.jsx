import {
  CalendarDays,
  ClipboardList,
  FileText,
  MoreHorizontal,
  ShoppingCart,
  Tag,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import AdminSidebar from '../../components/layout/AdminSidebar'
import AdminHeader from '../../components/layout/AdminHeader'
import StatCard from '../../components/admin/StatCard'
import SalesChart from '../../components/admin/SalesChart'
import StatusChart from '../../components/admin/StatusChart'

const dateRanges = [
  '1 sept. 2026 - 30 sept. 2026',
  '1 oct. 2026 - 31 oct. 2026',
  'Derniers 7 jours',
]

export default function Dashboard() {
  const [dateRangeIndex, setDateRangeIndex] = useState(0)
  const [chartPeriod, setChartPeriod] = useState('monthly')
  const bestProducts = [
    {
      name: 'Baskets Nova Premium',
      sales: '320 ventes',
      price: '680 DH',
    },
    {
      name: 'Sac Élise',
      sales: '280 ventes',
      price: '1 290 DH',
    },
    {
      name: 'Pull en cachemire',
      sales: '250 ventes',
      price: '850 DH',
    },
    {
      name: 'Montre Horizon',
      sales: '190 ventes',
      price: '1 490 DH',
    },
    {
      name: 'Lunettes Solis',
      sales: '150 ventes',
      price: '550 DH',
    },
  ]

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
        <AdminHeader />

        <main className="admin-dashboard">
          {/* HEADER */}

          <section className="dashboard-heading">
            <div>
              <p className="dashboard-welcome">
                Bienvenue 👋
              </p>

              <h1>Tableau de bord</h1>
            </div>

            <button
              className="dashboard-date-filter"
              type="button"
              onClick={() =>
                setDateRangeIndex((currentIndex) =>
                  currentIndex + 1 >= dateRanges.length
                    ? 0
                    : currentIndex + 1,
                )
              }
            >
              <CalendarDays
                size={18}
                strokeWidth={1.8}
              />

              <span>{dateRanges[dateRangeIndex]}</span>

              <span className="dashboard-date-filter__static" hidden>
                1 sept. 2026 – 30 sept. 2026
              </span>

              <span className="dashboard-date-filter__arrow">
                ⌄
              </span>
            </button>
          </section>

          {/* STATISTIQUES */}

          <section className="dashboard-stats">
            <StatCard
              icon={ShoppingCart}
              value="1 248"
              label="Commandes"
              growth="+12%"
            />

            <StatCard
              icon={Users}
              value="8 532"
              label="Clients"
              growth="+18%"
            />

            <StatCard
              icon={Tag}
              value="4 320"
              label="Produits vendus"
              growth="+24%"
            />

            <StatCard
              icon={FileText}
              value="125 600 DH"
              label="Chiffre d’affaires"
              growth="+16%"
            />
          </section>

          {/* CONTENT */}

          <section className="dashboard-grid">
            {/* LEFT */}

            <div className="dashboard-left">
              {/* VENTES */}

              <div className="dashboard-card dashboard-sales-card">
                <div className="dashboard-card__header">
                  <h2>Ventes</h2>

                  <div className="sales-card__actions">
                    <div className="sales-card__legend">
                      <span>
                        <i className="legend-dot legend-dot--current" />
                        Ce mois
                      </span>

                      <span>
                        <i className="legend-dot legend-dot--previous" />
                        Mois dernier
                      </span>
                    </div>

                    <select
                      value={chartPeriod}
                      onChange={(event) =>
                        setChartPeriod(event.target.value)
                      }
                    >
                      <option value="monthly">
                        Mensuel
                      </option>

                      <option value="weekly">
                        Hebdomadaire
                      </option>

                      <option value="daily">
                        Journalier
                      </option>
                    </select>
                  </div>
                </div>

                <SalesChart period={chartPeriod} />
              </div>

              {/* DERNIERES COMMANDES */}

              <div className="dashboard-card latest-orders">
                <div className="dashboard-card__header">
                  <h2>
                    Dernières commandes
                  </h2>

                  <Link
                    className="dashboard-link"
                    to="/admin/commandes"
                  >
                    Voir tout
                  </Link>
                </div>

                <div className="latest-orders__table-wrap">
                  <table className="latest-orders__table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Client</th>
                        <th>Produits</th>
                        <th>Montant</th>
                        <th>Statut</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td>#10024</td>

                        <td>
                          <div className="client-cell">
                            <div className="client-avatar">
                              YB
                            </div>

                            <span>
                              Yassine Benali
                            </span>
                          </div>
                        </td>

                        <td>3 articles</td>

                        <td>1 290 DH</td>

                        <td>
                          <span className="status-badge status-badge--confirmed">
                            Confirmée
                          </span>
                        </td>

                        <td>30 sept. 2026</td>

                        <td>
                          <Link
                            className="dashboard-row-action"
                            to="/admin/commandes/10024"
                            aria-label="Voir la commande 10024"
                          >
                            <MoreHorizontal size={18} strokeWidth={1.8} />
                          </Link>
                        </td>
                      </tr>

                      <tr>
                        <td>#10023</td>

                        <td>
                          <div className="client-cell">
                            <div className="client-avatar">
                              SA
                            </div>

                            <span>
                              Sara El Amrani
                            </span>
                          </div>
                        </td>

                        <td>1 article</td>

                        <td>850 DH</td>

                        <td>
                          <span className="status-badge status-badge--preparing">
                            En préparation
                          </span>
                        </td>

                        <td>29 sept. 2026</td>

                        <td>
                          <Link
                            className="dashboard-row-action"
                            to="/admin/commandes/10023"
                            aria-label="Voir la commande 10023"
                          >
                            <MoreHorizontal size={18} strokeWidth={1.8} />
                          </Link>
                        </td>
                      </tr>

                      <tr>
                        <td>#10022</td>

                        <td>
                          <div className="client-cell">
                            <div className="client-avatar">
                              OH
                            </div>

                            <span>
                              Omar Haddad
                            </span>
                          </div>
                        </td>

                        <td>2 articles</td>

                        <td>1 490 DH</td>

                        <td>
                          <span className="status-badge status-badge--shipped">
                            Expédiée
                          </span>
                        </td>

                        <td>29 sept. 2026</td>

                        <td>
                          <Link
                            className="dashboard-row-action"
                            to="/admin/commandes/10022"
                            aria-label="Voir la commande 10022"
                          >
                            <MoreHorizontal size={18} strokeWidth={1.8} />
                          </Link>
                        </td>
                      </tr>

                      <tr>
                        <td>#10021</td>

                        <td>
                          <div className="client-cell">
                            <div className="client-avatar">
                              LK
                            </div>

                            <span>
                              Lina Kettani
                            </span>
                          </div>
                        </td>

                        <td>1 article</td>

                        <td>680 DH</td>

                        <td>
                          <span className="status-badge status-badge--delivered">
                            Livrée
                          </span>
                        </td>

                        <td>28 sept. 2026</td>

                        <td>
                          <Link
                            className="dashboard-row-action"
                            to="/admin/commandes/10021"
                            aria-label="Voir la commande 10021"
                          >
                            <MoreHorizontal size={18} strokeWidth={1.8} />
                          </Link>
                        </td>
                      </tr>

                      <tr>
                        <td>#10020</td>

                        <td>
                          <div className="client-cell">
                            <div className="client-avatar">
                              MR
                            </div>

                            <span>
                              Mehdi Rachid
                            </span>
                          </div>
                        </td>

                        <td>4 articles</td>

                        <td>2 350 DH</td>

                        <td>
                          <span className="status-badge status-badge--confirmed">
                            Confirmée
                          </span>
                        </td>

                        <td>27 sept. 2026</td>

                        <td>
                          <Link
                            className="dashboard-row-action"
                            to="/admin/commandes/10020"
                            aria-label="Voir la commande 10020"
                          >
                            <MoreHorizontal size={18} strokeWidth={1.8} />
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* RIGHT */}

            <aside className="dashboard-right">
              {/* REPARTITION */}

              <div className="dashboard-card sales-distribution">
                <h2>
                  Répartition des ventes
                </h2>

                <div className="sales-distribution__content">
                  <div className="donut-chart">
                    <div className="donut-chart__center">
                      <strong>
                        125 600 DH
                      </strong>

                      <span>Total</span>
                    </div>
                  </div>

                  <div className="sales-distribution__legend">
                    <div>
                      <span>
                        <i className="legend-dot legend-dot--web" />
                        Site web
                      </span>

                      <strong>68%</strong>
                    </div>

                    <div>
                      <span>
                        <i className="legend-dot legend-dot--mobile" />
                        Mobile
                      </span>

                      <strong>22%</strong>
                    </div>

                    <div>
                      <span>
                        <i className="legend-dot legend-dot--other" />
                        Autre
                      </span>

                      <strong>10%</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* STATUS CHART */}

              <div className="dashboard-card order-status-card">
                <div className="dashboard-card__header">
                  <h2>
                    Statut des commandes
                  </h2>

                  <Link
                    className="dashboard-link"
                    to="/admin/commandes"
                  >
                    Voir tout
                  </Link>
                </div>

                <StatusChart />
              </div>

              {/* BEST PRODUCTS */}

              <div className="dashboard-card best-products-card">
                <div className="dashboard-card__header">
                  <h2>
                    Produits les plus vendus
                  </h2>

                  <Link
                    className="dashboard-link"
                    to="/admin/produits"
                  >
                    Voir tout
                  </Link>
                </div>

                <div className="best-products-list">
                  {bestProducts.map(
                    (product) => (
                      <div
                        className="best-product-item"
                        key={product.name}
                      >
                        <div className="best-product-item__image">
                          <ClipboardList
                            size={19}
                            strokeWidth={1.6}
                          />
                        </div>

                        <div className="best-product-item__info">
                          <strong>
                            {product.name}
                          </strong>

                          <span>
                            {product.sales}
                          </span>
                        </div>

                        <strong className="best-product-item__price">
                          {product.price}
                        </strong>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </aside>
          </section>
        </main>
      </div>
    </div>
  )
}
