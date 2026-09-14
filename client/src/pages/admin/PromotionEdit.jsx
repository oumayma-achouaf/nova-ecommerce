import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  RotateCcw,
  Save,
  TicketPercent,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import AdminHeader from '../../components/layout/AdminHeader.jsx'
import AdminSidebar from '../../components/layout/AdminSidebar.jsx'
import {
  getPromotions,
  upsertPromotion,
} from '../../services/adminService.js'

const typeOptions = [
  ['code', 'Code promo'],
  ['discount', 'Reduction'],
  ['delivery', 'Livraison'],
]

const statusOptions = [
  ['draft', 'Brouillon'],
  ['planned', 'Planifiee'],
  ['active', 'Active'],
  ['expired', 'Expiree'],
]

const typeLabels = {
  code: 'Code promo',
  discount: 'Reduction',
  delivery: 'Livraison',
}

const statusLabels = {
  draft: 'Brouillon',
  planned: 'Planifiee',
  active: 'Active',
  expired: 'Expiree',
}

function SelectField({
  label,
  name,
  value,
  options,
  onChange,
}) {
  return (
    <label className="promotion-create-field">
      <span>{label}</span>
      <div className="promotion-create-select">
        <select name={name} value={value} onChange={onChange}>
          {options.map(([optionValue, optionLabel]) => (
            <option value={optionValue} key={optionValue}>
              {optionLabel}
            </option>
          ))}
        </select>
        <ChevronDown size={16} strokeWidth={1.7} />
      </div>
    </label>
  )
}

function TextField({
  label,
  name,
  value,
  onChange,
  required = false,
}) {
  return (
    <label className="promotion-create-field">
      <span>
        {label}
        {required ? <strong>*</strong> : null}
      </span>
      <div className="promotion-create-input">
        <input name={name} value={value} onChange={onChange} />
      </div>
    </label>
  )
}

export default function PromotionEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const promotion = useMemo(
    () =>
      getPromotions().find(
        (currentPromotion) => Number(currentPromotion.id) === Number(id),
      ),
    [id],
  )
  const [form, setForm] = useState(() => ({
    title: promotion?.title || '',
    code: promotion?.code || '',
    typeClass: promotion?.typeClass || 'code',
    reduction: promotion?.reduction || '',
    period: promotion?.period || '',
    products: promotion?.products || 'Tous les produits',
    statusClass: promotion?.statusClass || 'draft',
  }))
  const [errors, setErrors] = useState([])
  const [notice, setNotice] = useState('')

  if (!promotion) {
    return (
      <div className="admin-layout">
        <AdminSidebar />

        <div className="admin-main">
          <AdminHeader searchPlaceholder="Rechercher une promotion..." />

          <main className="admin-dashboard promotion-create-page">
            <section className="promotion-create-heading">
              <div>
                <h1>Promotion introuvable</h1>
                <p>Aucune promotion locale ne correspond a cet identifiant.</p>
              </div>
              <Link className="promotion-create-primary" to="/admin/promotions">
                Retour aux promotions
              </Link>
            </section>
          </main>
        </div>
      </div>
    )
  }

  const updateField = (event) => {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
    setNotice('')
  }

  const resetForm = () => {
    setForm({
      title: promotion.title,
      code: promotion.code,
      typeClass: promotion.typeClass,
      reduction: promotion.reduction,
      period: promotion.period,
      products: promotion.products,
      statusClass: promotion.statusClass,
    })
    setErrors([])
    setNotice('Modifications locales annulees.')
  }

  const savePromotion = () => {
    const nextErrors = []

    if (!form.title.trim()) {
      nextErrors.push('Le nom de la promotion est requis.')
    }

    if (!form.code.trim()) {
      nextErrors.push('Le code promo est requis.')
    }

    if (!form.reduction.trim()) {
      nextErrors.push('La reduction est requise.')
    }

    setErrors(nextErrors)

    if (nextErrors.length > 0) {
      return
    }

    upsertPromotion({
      ...promotion,
      title: form.title.trim(),
      code: form.code.trim().toUpperCase(),
      type: typeLabels[form.typeClass],
      typeClass: form.typeClass,
      reduction: form.reduction.trim(),
      period: form.period.trim() || promotion.period,
      products: form.products.trim() || 'Tous les produits',
      status: statusLabels[form.statusClass],
      statusClass: form.statusClass,
    })
    setNotice('Promotion mise a jour localement.')
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
        <AdminHeader searchPlaceholder="Rechercher une promotion..." />

        <main className="admin-dashboard promotion-create-page">
          <section className="promotion-create-breadcrumb">
            <Link to="/admin">Accueil</Link>
            <ChevronRight size={14} strokeWidth={1.7} />
            <Link to="/admin/promotions">Promotions</Link>
            <ChevronRight size={14} strokeWidth={1.7} />
            <strong>Modifier</strong>
          </section>

          <section className="promotion-create-heading">
            <div className="promotion-create-heading__title">
              <Link
                className="promotion-create-back"
                to="/admin/promotions"
                aria-label="Retour aux promotions"
              >
                <ArrowLeft size={18} strokeWidth={1.8} />
              </Link>

              <div>
                <h1>Modifier une promotion</h1>
                <p>{promotion.title}</p>
              </div>
            </div>

            <div className="promotion-create-actions">
              <button
                className="promotion-create-secondary"
                type="button"
                onClick={() => navigate('/admin/promotions')}
              >
                Annuler
              </button>
              <button
                className="promotion-create-secondary"
                type="button"
                onClick={resetForm}
              >
                <RotateCcw size={16} strokeWidth={1.8} />
                <span>Reinitialiser</span>
              </button>
              <button
                className="promotion-create-primary"
                type="button"
                onClick={savePromotion}
              >
                <Save size={16} strokeWidth={1.8} />
                <span>Enregistrer</span>
              </button>
            </div>
          </section>

          {errors.length > 0 ? (
            <div className="promotion-create-alert promotion-create-alert--error">
              {errors.map((error) => (
                <span key={error}>{error}</span>
              ))}
            </div>
          ) : null}

          {notice ? (
            <div className="promotion-create-alert promotion-create-alert--success">
              {notice}
            </div>
          ) : null}

          <section className="promotion-create-grid">
            <div className="promotion-create-main-column">
              <section className="dashboard-card promotion-create-card">
                <div className="promotion-create-card__header">
                  <div className="promotion-create-card__icon">
                    <TicketPercent size={20} strokeWidth={1.7} />
                  </div>
                  <div>
                    <h2>Informations promotion</h2>
                    <p>Les changements sont conserves dans le navigateur.</p>
                  </div>
                </div>

                <div className="promotion-create-form-grid">
                  <TextField
                    label="Nom"
                    name="title"
                    value={form.title}
                    onChange={updateField}
                    required
                  />
                  <TextField
                    label="Code"
                    name="code"
                    value={form.code}
                    onChange={updateField}
                    required
                  />
                  <SelectField
                    label="Type"
                    name="typeClass"
                    value={form.typeClass}
                    options={typeOptions}
                    onChange={updateField}
                  />
                  <SelectField
                    label="Statut"
                    name="statusClass"
                    value={form.statusClass}
                    options={statusOptions}
                    onChange={updateField}
                  />
                  <TextField
                    label="Reduction"
                    name="reduction"
                    value={form.reduction}
                    onChange={updateField}
                    required
                  />
                  <TextField
                    label="Periode"
                    name="period"
                    value={form.period}
                    onChange={updateField}
                  />
                  <label className="promotion-create-field promotion-create-field--wide">
                    <span>Produits concernes</span>
                    <textarea
                      name="products"
                      value={form.products}
                      onChange={updateField}
                    />
                  </label>
                </div>
              </section>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
