import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Download,
  FileText,
  Monitor,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Tablet,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import AdminHeader from '../../components/layout/AdminHeader.jsx'
import AdminSidebar from '../../components/layout/AdminSidebar.jsx'

const salesData = [
  1800,
  3100,
  4300,
  5200,
  3600,
  4200,
  5600,
  7100,
  8900,
  7600,
  6100,
  7200,
  6900,
  9100,
  11300,
  9800,
  7400,
  6800,
  8200,
  9300,
  7900,
  6800,
  8600,
  10500,
  9100,
  7800,
  10300,
  12100,
  13400,
  11900,
  12800,
  16600,
]

const previousSalesData = [
  900,
  1600,
  2300,
  2600,
  2100,
  1900,
  2500,
  3100,
  3900,
  2800,
  3400,
  3900,
  2800,
  4100,
  5200,
  4700,
  3400,
  3900,
  4800,
  4400,
  3900,
  5200,
  4700,
  3600,
  4300,
  5600,
  6200,
  6700,
  7000,
  6100,
  7800,
  9700,
]

const trafficSources = [
  ['Direct', 38, '#2f3b2f'],
  ['Réseaux sociaux', 24, '#687466'],
  ['Recherche', 22, '#b9ae9e'],
  ['Email', 10, '#ded7ca'],
  ['Autre', 6, '#ece6da'],
]

const categorySales = [
  ['Chaussures', 34200, '#8b998c'],
  ['Accessoires', 28500, '#354231'],
  ['Homme', 22300, '#c7baa7'],
  ['Femme', 18600, '#d8cebf'],
]

const topProducts = [
  {
    rank: 1,
    name: 'Baskets Nova Premium',
    sales: '320 ventes',
    revenue: '43 200 DH',
    image: '/images/products/nova-product-sneakers.jpg',
    fallback: 'sneakers',
  },
  {
    rank: 2,
    name: 'Sac Élise',
    sales: '280 ventes',
    revenue: '36 400 DH',
    image: '/images/products/nova-product-bag.jpg',
    fallback: 'bag',
  },
  {
    rank: 3,
    name: 'Pull en cachemire',
    sales: '250 ventes',
    revenue: '21 250 DH',
    image: '/images/products/nova-product-sweater.jpg',
    fallback: 'sweater',
  },
  {
    rank: 4,
    name: 'Montre Horizon',
    sales: '190 ventes',
    revenue: '18 050 DH',
    image: '/images/products/nova-product-watch.jpg',
    fallback: 'watch',
  },
  {
    rank: 5,
    name: 'Lunettes Solis',
    sales: '150 ventes',
    revenue: '8 250 DH',
    image: '/images/products/nova-category-accessories.jpg',
    fallback: 'glasses',
  },
]

const deviceDistribution = [
  {
    icon: Smartphone,
    label: 'Mobile',
    percent: 58,
    orders: '725 commandes',
  },
  {
    icon: Monitor,
    label: 'Desktop',
    percent: 32,
    orders: '397 commandes',
  },
  {
    icon: Tablet,
    label: 'Tablette',
    percent: 10,
    orders: '124 commandes',
  },
]

const channelDistribution = [
  {
    icon: Monitor,
    label: 'Site web',
    percent: 64,
    orders: '801 commandes',
  },
  {
    icon: Smartphone,
    label: 'Application',
    percent: 26,
    orders: '322 commandes',
  },
  {
    icon: Tablet,
    label: 'Marketplace',
    percent: 10,
    orders: '123 commandes',
  },
]

const reportRanges = [
  '1 sept. 2026 - 30 sept. 2026',
  '1 oct. 2026 - 31 oct. 2026',
  'Derniers 7 jours',
]

const stats = [
  {
    icon: FileText,
    label: 'Chiffre d’affaires',
    value: '125 600 DH',
    change: '+16%',
  },
  {
    icon: ShoppingCart,
    label: 'Taux de conversion',
    value: '4,8%',
    change: '+0,6%',
  },
  {
    icon: ShoppingBag,
    label: 'Panier moyen',
    value: '860 DH',
    change: '+12%',
  },
  {
    icon: Users,
    label: 'Visiteurs',
    value: '42 380',
    change: '-8%',
    danger: true,
  },
]

function createPoints(data, width, height, maxValue) {
  return data.map((value, index) => ({
    x: (index / (data.length - 1)) * width,
    y: height - (value / maxValue) * height,
  }))
}

function createSmoothPath(points) {
  return points
    .map((point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`
      }

      const previous = points[index - 1]
      const midX = (previous.x + point.x) / 2

      return `C ${midX} ${previous.y}, ${midX} ${point.y}, ${point.x} ${point.y}`
    })
    .join(' ')
}

function AnalyticsStatCard({
  icon: Icon,
  label,
  value,
  change,
  danger = false,
}) {
  const TrendIcon = danger ? TrendingDown : TrendingUp

  return (
    <div className="analytics-stat-card">
      <div className="analytics-stat-card__icon">
        <Icon size={28} strokeWidth={1.65} />
      </div>

      <div className="analytics-stat-card__content">
        <span>{label}</span>

        <div className="analytics-stat-card__value-row">
          <strong>{value}</strong>

          <small
            className={`analytics-stat-card__change ${
              danger ? 'is-danger' : ''
            }`}
          >
            <TrendIcon size={15} strokeWidth={1.8} />
            {change}
          </small>
        </div>

        <em>vs mois dernier</em>
      </div>
    </div>
  )
}

function SalesEvolutionChart({
  period,
}) {
  const width = 880
  const height = 210
  const stepByPeriod = {
    daily: 1,
    weekly: 4,
    monthly: 8,
  }
  const step = stepByPeriod[period] || 1
  const currentData = salesData.filter((_, index) => index % step === 0)
  const previousData = previousSalesData.filter(
    (_, index) => index % step === 0,
  )
  const labelsByPeriod = {
    daily: [
      '1 sept.',
      '5 sept.',
      '10 sept.',
      '15 sept.',
      '20 sept.',
      '25 sept.',
      '30 sept.',
    ],
    weekly: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
    monthly: ['Mai', 'Juin', 'Juil.', 'Aout'],
  }
  const xAxisLabels = labelsByPeriod[period] || labelsByPeriod.daily
  const maxValue =
    Math.ceil(Math.max(...currentData, ...previousData) / 1000) * 1000
  const currentPoints = createPoints(
    currentData,
    width,
    height,
    maxValue,
  )
  const previousPoints = createPoints(
    previousData,
    width,
    height,
    maxValue,
  )
  const currentPath = createSmoothPath(currentPoints)
  const previousPath = createSmoothPath(previousPoints)
  const areaPath = `${currentPath} L ${width} ${height} L 0 ${height} Z`

  return (
    <div className="analytics-line-chart">
      <div className="analytics-line-chart__body">
        <div className="analytics-line-chart__y-axis">
          <span>20 000</span>
          <span>15 000</span>
          <span>10 000</span>
          <span>5 000</span>
          <span>0</span>
        </div>

        <div className="analytics-line-chart__graph">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="analyticsSalesGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#40513f"
                  stopOpacity="0.16"
                />
                <stop
                  offset="100%"
                  stopColor="#40513f"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>

            {[0, 1, 2, 3, 4].map((line) => {
              const y = (line / 4) * height

              return (
                <line
                  key={`horizontal-${line}`}
                  x1="0"
                  y1={y}
                  x2={width}
                  y2={y}
                  className="analytics-line-chart__grid"
                />
              )
            })}

            {[0, 1, 2, 3, 4, 5, 6].map((line) => {
              const x = (line / 6) * width

              return (
                <line
                  key={`vertical-${line}`}
                  x1={x}
                  y1="0"
                  x2={x}
                  y2={height}
                  className="analytics-line-chart__grid"
                />
              )
            })}

            <path
              d={areaPath}
              className="analytics-line-chart__area"
            />

            <path
              d={previousPath}
              className="analytics-line-chart__path analytics-line-chart__path--previous"
            />

            <path
              d={currentPath}
              className="analytics-line-chart__path analytics-line-chart__path--current"
            />
          </svg>

          <div className="analytics-line-chart__x-axis">
            {xAxisLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function TrafficDonut() {
  return (
    <div className="analytics-traffic">
      <div className="analytics-donut">
        <div className="analytics-donut__center">
          <strong>42 380</strong>
          <span>Visiteurs</span>
        </div>
      </div>

      <div className="analytics-traffic__legend">
        {trafficSources.map(([label, value, color]) => (
          <div key={label}>
            <span>
              <i style={{ background: color }} />
              {label}
            </span>
            <strong>{value}%</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

function CategoryBars({
  metric,
}) {
  const chartData =
    metric === 'sales'
      ? categorySales.map(([label, value, color]) => [
          label,
          Math.round(value / 180),
          color,
        ])
      : categorySales
  const maxValue = metric === 'sales' ? 220 : 40000

  return (
    <div className="analytics-bars">
      <div className="analytics-bars__body">
        <div className="analytics-bars__y-axis">
          <span>40 000</span>
          <span>30 000</span>
          <span>20 000</span>
          <span>10 000</span>
          <span>0</span>
        </div>

        <div className="analytics-bars__plot">
          <div className="analytics-bars__grid" />

          {chartData.map(([label, value, color]) => (
            <div
              className="analytics-bar"
              key={label}
            >
              <strong>
                {metric === 'sales'
                  ? `${value} ventes`
                  : value.toLocaleString('fr-FR')}
              </strong>
              <span
                style={{
                  height: `${(value / maxValue) * 100}%`,
                  background: color,
                }}
              />
              <em>{label}</em>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProductThumb({
  src,
  alt,
  fallback,
}) {
  return (
    <div
      className={`analytics-product-thumb analytics-product-thumb--${fallback}`}
    >
      <img
        src={src}
        alt={alt}
        onError={(event) => {
          event.currentTarget.style.display = 'none'
        }}
      />
    </div>
  )
}

export default function Analytics() {
  const [period, setPeriod] = useState('daily')
  const [metric, setMetric] = useState('revenue')
  const [deviceMetric, setDeviceMetric] = useState('device')
  const [reportRangeIndex, setReportRangeIndex] = useState(0)
  const selectedDistribution =
    deviceMetric === 'channel' ? channelDistribution : deviceDistribution

  const exportReport = () => {
    const rows = [
      ['Indicateur', 'Valeur'],
      ['Periode', reportRanges[reportRangeIndex]],
      ['Chiffre d’affaires', '125 600 DH'],
      ['Taux de conversion', '4,8%'],
      ['Panier moyen', '860 DH'],
      ['Visiteurs', '42 380'],
    ]
    const csv = rows
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(','),
      )
      .join('\n')
    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'rapport-analyses-nova.csv'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
        <AdminHeader />

        <main className="admin-dashboard analytics-page">
          <section className="analytics-page__breadcrumb">
            <span>Accueil</span>
            <ChevronRight size={14} strokeWidth={1.7} />
            <strong>Analyses</strong>
          </section>

          <section className="analytics-page__heading">
            <div>
              <h1>Analyses des performances</h1>

              <p>
                Suivez vos ventes, votre trafic et vos tendances
                en temps réel.
              </p>
            </div>

            <div className="analytics-page__actions">
              <button
                className="analytics-date-button"
                type="button"
                onClick={() =>
                  setReportRangeIndex((currentIndex) =>
                    currentIndex + 1 >= reportRanges.length
                      ? 0
                      : currentIndex + 1,
                  )
                }
              >
                <CalendarDays size={17} strokeWidth={1.8} />
                <span>{reportRanges[reportRangeIndex]}</span>
                <span className="analytics-date-button__static" hidden>
                <span>1 sept. 2026 – 30 sept. 2026</span>
                </span>
                <ChevronDown size={16} strokeWidth={1.7} />
              </button>

              <button
                className="analytics-export-button"
                type="button"
                onClick={exportReport}
              >
                <Download size={17} strokeWidth={1.8} />
                <span>Exporter le rapport</span>
              </button>
            </div>
          </section>

          <section className="analytics-stats">
            {stats.map((stat) => (
              <AnalyticsStatCard
                key={stat.label}
                {...stat}
              />
            ))}
          </section>

          <section className="analytics-top-grid">
            <div className="dashboard-card analytics-sales-card">
              <div className="analytics-card-header">
                <h2>Évolution des ventes</h2>

                <div className="analytics-card-header__tools">
                  <div className="analytics-legend">
                    <span>
                      <i className="analytics-legend__dot analytics-legend__dot--current" />
                      Ce mois
                    </span>
                    <span>
                      <i className="analytics-legend__dot analytics-legend__dot--previous" />
                      Mois dernier
                    </span>
                  </div>

                  <label className="analytics-select">
                    <span className="sr-only">
                      Période du graphique
                    </span>
                    <select
                      value={period}
                      onChange={(event) =>
                        setPeriod(event.target.value)
                      }
                    >
                      <option value="daily">Journalier</option>
                      <option value="weekly">Hebdomadaire</option>
                      <option value="monthly">Mensuel</option>
                    </select>
                    <ChevronDown size={15} strokeWidth={1.7} />
                  </label>
                </div>
              </div>

              <SalesEvolutionChart period={period} />
            </div>

            <div className="dashboard-card analytics-traffic-card">
              <h2>Sources de trafic</h2>
              <TrafficDonut />
            </div>
          </section>

          <section className="analytics-bottom-grid">
            <div className="dashboard-card analytics-category-card">
              <div className="analytics-card-header">
                <h2>Ventes par catégorie</h2>

                <label className="analytics-select">
                  <span className="sr-only">
                    Métrique par catégorie
                  </span>
                  <select
                    value={metric}
                    onChange={(event) =>
                      setMetric(event.target.value)
                    }
                  >
                    <option value="revenue">
                      Chiffre d’affaires
                    </option>
                    <option value="sales">Ventes</option>
                  </select>
                  <ChevronDown size={15} strokeWidth={1.7} />
                </label>
              </div>

              <CategoryBars metric={metric} />
            </div>

            <div className="dashboard-card analytics-products-card">
              <div className="analytics-card-header">
                <h2>Produits les plus performants</h2>

                <Link
                  className="analytics-link"
                  to="/admin/produits"
                >
                  Voir tout
                </Link>
              </div>

              <div className="analytics-products-table-wrap">
                <table className="analytics-products-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Produit</th>
                      <th>Ventes</th>
                      <th>Chiffre d’affaires</th>
                    </tr>
                  </thead>

                  <tbody>
                    {topProducts.map((product) => (
                      <tr key={product.name}>
                        <td>{product.rank}</td>

                        <td>
                          <div className="analytics-product-cell">
                            <ProductThumb
                              src={product.image}
                              alt={product.name}
                              fallback={product.fallback}
                            />
                            <span>{product.name}</span>
                          </div>
                        </td>

                        <td>{product.sales}</td>
                        <td>
                          <strong>{product.revenue}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="dashboard-card analytics-devices-card">
              <div className="analytics-card-header">
                <h2>Répartition des commandes</h2>

                <label className="analytics-select">
                  <span className="sr-only">
                    Répartition par
                  </span>
                  <select
                    value={deviceMetric}
                    onChange={(event) =>
                      setDeviceMetric(event.target.value)
                    }
                  >
                    <option value="device">Par appareil</option>
                    <option value="channel">Par canal</option>
                  </select>
                  <ChevronDown size={15} strokeWidth={1.7} />
                </label>
              </div>

              <div className="analytics-device-list">
                {selectedDistribution.map((device) => {
                  const Icon = device.icon

                  return (
                    <div
                      className="analytics-device-item"
                      key={device.label}
                    >
                      <div className="analytics-device-item__icon">
                        <Icon size={25} strokeWidth={1.7} />
                      </div>

                      <div className="analytics-device-item__body">
                        <div className="analytics-device-item__top">
                          <strong>{device.label}</strong>
                          <span>{device.percent}%</span>
                        </div>

                        <div className="analytics-device-progress">
                          <span
                            style={{
                              width: `${device.percent}%`,
                            }}
                          />
                        </div>

                        <small>{device.orders}</small>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
