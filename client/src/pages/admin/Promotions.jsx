import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Edit3,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  ShoppingBag,
  Tag,
  Trash2,
  Users,
  Clock3,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import AdminHeader from '../../components/layout/AdminHeader.jsx'
import AdminSidebar from '../../components/layout/AdminSidebar.jsx'
import {
  getPromotions,
  savePromotions,
} from '../../services/adminService.js'

const typeFilters = [
  ['all', 'Tous les types'],
  ['Code promo', 'Code promo'],
  ['Reduction', 'Reduction'],
  ['Livraison', 'Livraison'],
]

const statusFilters = [
  ['all', 'Tous les statuts'],
  ['active', 'Active'],
  ['planned', 'Planifiee'],
  ['expired', 'Expiree'],
  ['draft', 'Brouillon'],
]

const statusLabels = {
  active: 'Active',
  planned: 'Planifiee',
  expired: 'Expiree',
  draft: 'Brouillon',
}

function PromotionStatCard({
  icon: Icon,
  value,
  label,
  change,
  danger = false,
}) {
  return (
    <div className="promotions-stat-card">
      <div className="promotions-stat-card__icon">
        <Icon size={28} strokeWidth={1.65} />
      </div>

      <div className="promotions-stat-card__content">
        <div className="promotions-stat-card__top">
          <strong>{value}</strong>

          <span
            className={`promotions-stat-card__change ${
              danger ? 'is-danger' : ''
            }`}
          >
            <span aria-hidden="true">UP</span>
            {change}
          </span>
        </div>

        <div className="promotions-stat-card__bottom">
          <span>{label}</span>
          <small>donnees locales</small>
        </div>
      </div>
    </div>
  )
}

function PromotionThumb({
  src,
  alt,
  fallback,
}) {
  return (
    <div className={`promotions-thumb promotions-thumb--${fallback}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          onError={(event) => {
            event.currentTarget.style.display = 'none'
          }}
        />
      ) : null}
    </div>
  )
}

export default function Promotions() {
  const navigate = useNavigate()
  const [promotions, setPromotions] = useState(() => getPromotions())
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('september')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  const [selectedIds, setSelectedIds] = useState([])
  const [openMenuId, setOpenMenuId] = useState(null)
  const [notice, setNotice] = useState('')

  const stats = useMemo(() => {
    const activePromotions = promotions.filter(
      (promotion) => promotion.statusClass === 'active',
    ).length
    const expiredPromotions = promotions.filter(
      (promotion) => promotion.statusClass === 'expired',
    ).length

    return [
      {
        icon: Tag,
        value: String(activePromotions),
        label: 'Promotions actives',
        change: '+ local',
      },
      {
        icon: Users,
        value: String(promotions.length * 420),
        label: 'Utilisations estimees',
        change: '+ local',
      },
      {
        icon: ShoppingBag,
        value: `${promotions.length * 3550} DH`,
        label: 'CA promotionnel',
        change: '+ local',
      },
      {
        icon: Clock3,
        value: String(expiredPromotions),
        label: 'Promotions expirees',
        change: '+ local',
        danger: true,
      },
    ]
  }, [promotions])

  const filteredPromotions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return promotions.filter((promotion) => {
      const matchesSearch =
        promotion.title.toLowerCase().includes(normalizedSearch) ||
        promotion.code.toLowerCase().includes(normalizedSearch) ||
        promotion.type.toLowerCase().includes(normalizedSearch)
      const matchesType =
        typeFilter === 'all' || promotion.type === typeFilter
      const matchesStatus =
        statusFilter === 'all' ||
        promotion.statusClass === statusFilter
      const matchesDate =
        dateFilter === 'all' ||
        promotion.period.toLowerCase().includes('sept')

      return matchesSearch && matchesType && matchesStatus && matchesDate
    })
  }, [dateFilter, promotions, searchTerm, statusFilter, typeFilter])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPromotions.length / pageSize),
  )
  const safePage = Math.min(page, totalPages)
  const visiblePromotions = filteredPromotions.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  )

  const allVisibleSelected =
    visiblePromotions.length > 0 &&
    visiblePromotions.every((promotion) => selectedIds.includes(promotion.id))

  const persistPromotions = (nextPromotions, nextNotice) => {
    setPromotions(nextPromotions)
    savePromotions(nextPromotions)
    setNotice(nextNotice)
  }

  const toggleAllVisible = () => {
    setSelectedIds((currentIds) => {
      if (allVisibleSelected) {
        return currentIds.filter(
          (id) =>
            !visiblePromotions.some((promotion) => promotion.id === id),
        )
      }

      return Array.from(
        new Set([
          ...currentIds,
          ...visiblePromotions.map((promotion) => promotion.id),
        ]),
      )
    })
  }

  const togglePromotion = (promotionId) => {
    setSelectedIds((currentIds) =>
      currentIds.includes(promotionId)
        ? currentIds.filter((id) => id !== promotionId)
        : [...currentIds, promotionId],
    )
  }

  const resetToFirstPage = (setter) => (event) => {
    setter(event.target.value)
    setPage(1)
  }

  const resetFilters = () => {
    setSearchTerm('')
    setTypeFilter('all')
    setStatusFilter('all')
    setDateFilter('september')
    setPage(1)
  }

  const deletePromotion = (promotion) => {
    if (!window.confirm(`Supprimer "${promotion.title}" ?`)) {
      return
    }

    const nextPromotions = promotions.filter(
      (currentPromotion) => currentPromotion.id !== promotion.id,
    )

    setSelectedIds((currentIds) =>
      currentIds.filter((id) => id !== promotion.id),
    )
    persistPromotions(nextPromotions, 'Promotion supprimee localement.')
  }

  const duplicatePromotion = (promotion) => {
    const nextId =
      Math.max(0, ...promotions.map((item) => Number(item.id) || 0)) + 1
    const clone = {
      ...promotion,
      id: nextId,
      title: `${promotion.title} copie`,
      code: `${promotion.code}-COPY`,
      status: 'Brouillon',
      statusClass: 'draft',
    }

    persistPromotions(
      [clone, ...promotions],
      'Copie de promotion creee localement.',
    )
  }

  const updatePromotionStatus = (promotion, statusClass) => {
    const nextPromotions = promotions.map((currentPromotion) =>
      currentPromotion.id === promotion.id
        ? {
            ...currentPromotion,
            statusClass,
            status: statusLabels[statusClass],
          }
        : currentPromotion,
    )

    persistPromotions(
      nextPromotions,
      `Statut mis a jour : ${statusLabels[statusClass]}.`,
    )
    setOpenMenuId(null)
  }

  const filterButtonLabel =
    searchTerm ||
    typeFilter !== 'all' ||
    statusFilter !== 'all' ||
    dateFilter !== 'september'
      ? 'Reinitialiser'
      : 'Filtrer'

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
        <AdminHeader searchPlaceholder="Rechercher une promotion, un code, un produit..." />

        <main className="admin-dashboard promotions-page">
          <section className="promotions-page__breadcrumb">
            <span>Accueil</span>
            <ChevronRight size={14} strokeWidth={1.7} />
            <strong>Promotions</strong>
          </section>

          <section className="promotions-page__heading">
            <div>
              <h1>Gestion des promotions</h1>

              <p>
                Creez et gerez vos offres promotionnelles pour booster vos
                ventes.
              </p>
            </div>

            <button
              className="promotions-primary-button"
              type="button"
              onClick={() => navigate('/admin/promotions/nouvelle')}
            >
              <Plus size={18} strokeWidth={1.8} />
              <span>Creer une promotion</span>
            </button>
          </section>

          {notice ? <p className="admin-local-notice">{notice}</p> : null}

          <section className="promotions-stats">
            {stats.map((stat) => (
              <PromotionStatCard key={stat.label} {...stat} />
            ))}
          </section>

          <section className="dashboard-card promotions-table-card">
            <div className="promotions-filters">
              <div className="promotions-search">
                <Search size={18} strokeWidth={1.7} />

                <input
                  type="search"
                  value={searchTerm}
                  placeholder="Rechercher une promotion..."
                  onChange={resetToFirstPage(setSearchTerm)}
                />
              </div>

              <label className="promotions-select">
                <span className="sr-only">Filtrer par type</span>
                <select
                  value={typeFilter}
                  onChange={resetToFirstPage(setTypeFilter)}
                >
                  {typeFilters.map(([value, label]) => (
                    <option value={value} key={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} strokeWidth={1.7} />
              </label>

              <label className="promotions-select">
                <span className="sr-only">Filtrer par statut</span>
                <select
                  value={statusFilter}
                  onChange={resetToFirstPage(setStatusFilter)}
                >
                  {statusFilters.map(([value, label]) => (
                    <option value={value} key={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} strokeWidth={1.7} />
              </label>

              <label className="promotions-select promotions-date-select">
                <CalendarDays size={16} strokeWidth={1.7} />
                <span className="sr-only">Filtrer par periode</span>
                <select
                  value={dateFilter}
                  onChange={resetToFirstPage(setDateFilter)}
                >
                  <option value="september">Septembre 2026</option>
                  <option value="all">Toutes les periodes</option>
                </select>
                <ChevronDown size={16} strokeWidth={1.7} />
              </label>

              <button
                className="promotions-filter-button"
                type="button"
                onClick={resetFilters}
              >
                <Filter size={17} strokeWidth={1.7} />
                <span>{filterButtonLabel}</span>
              </button>
            </div>

            <div className="promotions-table-wrap">
              <table className="promotions-table">
                <thead>
                  <tr>
                    <th className="promotions-table__checkbox">
                      <input
                        type="checkbox"
                        aria-label="Selectionner toutes les promotions visibles"
                        checked={allVisibleSelected}
                        onChange={toggleAllVisible}
                      />
                    </th>
                    <th>Promotion</th>
                    <th>Type</th>
                    <th>Reduction</th>
                    <th>Periode de validite</th>
                    <th>Produits concernes</th>
                    <th>Statut</th>
                    <th className="promotions-table__actions-title">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {visiblePromotions.map((promotion) => (
                    <tr key={promotion.id}>
                      <td className="promotions-table__checkbox">
                        <input
                          type="checkbox"
                          aria-label={`Selectionner ${promotion.title}`}
                          checked={selectedIds.includes(promotion.id)}
                          onChange={() => togglePromotion(promotion.id)}
                        />
                      </td>

                      <td>
                        <div className="promotions-offer">
                          <PromotionThumb
                            src={promotion.image}
                            alt={promotion.title}
                            fallback={promotion.fallback}
                          />

                          <div className="promotions-offer__text">
                            <strong>{promotion.title}</strong>
                            <span>Code : {promotion.code}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`promotions-type promotions-type--${promotion.typeClass}`}
                        >
                          {promotion.type}
                        </span>
                      </td>

                      <td>{promotion.reduction}</td>
                      <td className="promotions-muted-cell">
                        {promotion.period}
                      </td>
                      <td className="promotions-muted-cell">
                        {promotion.products}
                      </td>

                      <td>
                        <span
                          className={`promotions-status promotions-status--${promotion.statusClass}`}
                        >
                          {promotion.status}
                        </span>
                      </td>

                      <td>
                        <div className="promotions-actions">
                          <button
                            type="button"
                            aria-label={`Modifier ${promotion.title}`}
                            onClick={() =>
                              navigate(
                                `/admin/promotions/${promotion.id}/modifier`,
                              )
                            }
                          >
                            <Edit3 size={17} strokeWidth={1.7} />
                          </button>

                          <button
                            type="button"
                            aria-label={`Dupliquer ${promotion.title}`}
                            onClick={() => duplicatePromotion(promotion)}
                          >
                            <Copy size={17} strokeWidth={1.7} />
                          </button>

                          <button
                            type="button"
                            aria-label={`Supprimer ${promotion.title}`}
                            onClick={() => deletePromotion(promotion)}
                          >
                            <Trash2 size={17} strokeWidth={1.7} />
                          </button>

                          <div className="admin-row-menu">
                            <button
                              type="button"
                              aria-label={`Plus d'actions pour ${promotion.title}`}
                              onClick={() =>
                                setOpenMenuId((currentId) =>
                                  currentId === promotion.id
                                    ? null
                                    : promotion.id,
                                )
                              }
                            >
                              <MoreHorizontal size={19} strokeWidth={1.8} />
                            </button>

                            {openMenuId === promotion.id ? (
                              <div className="admin-row-menu__panel">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updatePromotionStatus(promotion, 'active')
                                  }
                                >
                                  Activer
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updatePromotionStatus(promotion, 'planned')
                                  }
                                >
                                  Planifier
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updatePromotionStatus(promotion, 'expired')
                                  }
                                >
                                  Expirer
                                </button>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {visiblePromotions.length === 0 ? (
                    <tr>
                      <td className="promotions-table__empty" colSpan="8">
                        Aucune promotion trouvee
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>

            <div className="promotions-pagination">
              <span>
                Affichage de{' '}
                {filteredPromotions.length === 0
                  ? 0
                  : (safePage - 1) * pageSize + 1}{' '}
                a{' '}
                {Math.min(safePage * pageSize, filteredPromotions.length)} sur{' '}
                {filteredPromotions.length} promotions
              </span>

              <div className="promotions-pagination__pages">
                <button
                  type="button"
                  aria-label="Page precedente"
                  disabled={safePage === 1}
                  onClick={() =>
                    setPage((currentPage) => Math.max(1, currentPage - 1))
                  }
                >
                  <ChevronLeft size={15} />
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1)
                  .slice(0, 5)
                  .map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      className={safePage === pageNumber ? 'is-active' : ''}
                      onClick={() => setPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  ))}

                <button
                  type="button"
                  aria-label="Page suivante"
                  disabled={safePage === totalPages}
                  onClick={() =>
                    setPage((currentPage) =>
                      Math.min(totalPages, currentPage + 1),
                    )
                  }
                >
                  <ChevronRight size={15} />
                </button>
              </div>

              <label className="promotions-per-page">
                <span>Promotions par page</span>
                <select
                  value={pageSize}
                  onChange={(event) => {
                    setPageSize(Number(event.target.value))
                    setPage(1)
                  }}
                >
                  {[4, 8, 16].map((size) => (
                    <option value={size} key={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <ChevronDown size={15} />
              </label>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
