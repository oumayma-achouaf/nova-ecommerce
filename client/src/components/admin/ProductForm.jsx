import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ImagePlus,
  Package,
  RotateCcw,
  Save,
  Tag,
  UploadCloud,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { upsertProduct } from '../../services/adminService.js'

const categories = [
  'Chaussures',
  'Accessoires',
  'Vetements',
  'Vêtements',
]

const subcategoriesByCategory = {
  Chaussures: ['Baskets', 'Sneakers premium', 'Ville'],
  Accessoires: ['Sacs', 'Montres', 'Lunettes', 'Casquettes'],
  Vetements: ['Pulls', 'Vestes', 'Chemises'],
  Vêtements: ['Pulls', 'Vestes', 'Chemises'],
}

const stockStatuses = [
  ['in-stock', 'En stock'],
  ['low-stock', 'Stock faible'],
  ['out-stock', 'Rupture'],
]

const publicationStatuses = [
  ['draft', 'Brouillon'],
  ['published', 'Publié'],
  ['scheduled', 'Programmé'],
]

const visibilityOptions = [
  ['visible', 'Visible en boutique'],
  ['hidden', 'Masqué'],
]

const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', '42']
const colorOptions = ['Noir', 'Ivoire', 'Olive', 'Beige', 'Blanc cassé']

function Field({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  suffix,
  required = false,
}) {
  return (
    <label className="product-form-field">
      <span>
        {label}
        {required ? <strong>*</strong> : null}
      </span>

      <div className="product-form-input-wrap">
        <input
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        />

        {suffix ? <small>{suffix}</small> : null}
      </div>
    </label>
  )
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}) {
  return (
    <label className="product-form-field">
      <span>{label}</span>

      <div className="product-form-select">
        <select
          name={name}
          value={value}
          onChange={onChange}
        >
          {options.map((option) => {
            const optionValue = Array.isArray(option) ? option[0] : option
            const optionLabel = Array.isArray(option) ? option[1] : option

            return (
              <option value={optionValue} key={optionValue}>
                {optionLabel}
              </option>
            )
          })}
        </select>

        <ChevronDown size={16} strokeWidth={1.7} />
      </div>
    </label>
  )
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}) {
  return (
    <button
      className={
        checked
          ? 'product-form-toggle is-on'
          : 'product-form-toggle'
      }
      type="button"
      onClick={onChange}
    >
      <span />

      <div>
        <strong>{label}</strong>
        <small>{description}</small>
      </div>
    </button>
  )
}

function ProductForm({
  title,
  subtitle,
  breadcrumbCurrent,
  initialValues,
  initialImages,
  mode,
  productId,
}) {
  const navigate = useNavigate()
  const [formState, setFormState] = useState(initialValues)
  const [imagePreviews, setImagePreviews] = useState(initialImages)
  const [errors, setErrors] = useState([])
  const [confirmation, setConfirmation] = useState('')

  useEffect(
    () => () => {
      imagePreviews.forEach((image) => {
        if (image.isObjectUrl) {
          URL.revokeObjectURL(image.src)
        }
      })
    },
    [imagePreviews],
  )

  const subcategories =
    subcategoriesByCategory[formState.category] || []

  const updateField = (event) => {
    const { name, value } = event.target

    setFormState((currentForm) => ({
      ...currentForm,
      [name]: value,
      ...(name === 'category'
        ? {
            subcategory:
              subcategoriesByCategory[value]?.[0] || '',
          }
        : {}),
    }))
    setConfirmation('')
  }

  const toggleValue = (fieldName, value) => {
    setFormState((currentForm) => {
      const currentValues = currentForm[fieldName]
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value]

      return {
        ...currentForm,
        [fieldName]: nextValues,
      }
    })
    setConfirmation('')
  }

  const toggleBoolean = (fieldName) => {
    setFormState((currentForm) => ({
      ...currentForm,
      [fieldName]: !currentForm[fieldName],
    }))
    setConfirmation('')
  }

  const handleImagesChange = (event) => {
    const files = Array.from(event.target.files || [])

    if (files.length === 0) {
      return
    }

    const nextImages = files.slice(0, 4).map((file) => ({
      id: `${file.name}-${file.lastModified}`,
      src: URL.createObjectURL(file),
      name: file.name,
      isObjectUrl: true,
    }))

    setImagePreviews(nextImages)
    setConfirmation('')
    event.target.value = ''
  }

  const validateForm = (candidateForm) => {
    const nextErrors = []
    const regularPrice = Number(candidateForm.regularPrice)
    const salePrice = Number(candidateForm.salePrice)

    if (!candidateForm.name.trim()) {
      nextErrors.push('Le nom du produit est requis.')
    }

    if (!candidateForm.sku.trim()) {
      nextErrors.push('Le SKU est requis.')
    }

    if (!candidateForm.description.trim()) {
      nextErrors.push('La description est requise.')
    }

    if (!regularPrice || regularPrice <= 0) {
      nextErrors.push('Le prix normal doit être supérieur à 0.')
    }

    if (
      candidateForm.salePrice &&
      (!salePrice || salePrice >= regularPrice)
    ) {
      nextErrors.push('Le prix promotionnel doit être inférieur au prix normal.')
    }

    if (Number(candidateForm.quantity) < 0) {
      nextErrors.push('La quantité ne peut pas être négative.')
    }

    setErrors(nextErrors)
    return nextErrors.length === 0
  }

  const submitForm = (action) => {
    const nextForm =
      action === 'publish'
        ? {
            ...formState,
            publicationStatus: 'published',
          }
        : formState

    if (!validateForm(nextForm)) {
      setConfirmation('')
      return
    }

    upsertProduct({
      ...nextForm,
      id: productId,
      image:
        imagePreviews.find((image) => !image.isObjectUrl)?.src ||
        nextForm.image ||
        '',
      fallback: nextForm.fallback || 'shoe',
    })

    setFormState(nextForm)
    setConfirmation(
      action === 'publish'
        ? 'Produit validé localement et marqué comme publié.'
        : 'Produit enregistré localement en brouillon.',
    )
  }

  const resetForm = () => {
    setFormState(initialValues)
    setImagePreviews(initialImages)
    setErrors([])
    setConfirmation('Formulaire réinitialisé localement.')
  }

  return (
    <main className="admin-dashboard product-form-page">
      <section className="product-form-breadcrumb">
        <Link to="/admin">Accueil</Link>
        <span>›</span>
        <Link to="/admin/produits">Produits</Link>
        <span>›</span>
        <strong>{breadcrumbCurrent}</strong>
      </section>

      <section className="product-form-heading">
        <div className="product-form-heading__title">
          <Link
            className="product-form-back"
            to="/admin/produits"
            aria-label="Retour aux produits"
          >
            <ArrowLeft size={18} strokeWidth={1.8} />
          </Link>

          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
        </div>

        <div className="product-form-actions">
          <button
            className="product-form-secondary-action"
            type="button"
            onClick={resetForm}
          >
            <RotateCcw size={16} strokeWidth={1.8} />
            <span>Réinitialiser</span>
          </button>

          <button
            className="product-form-secondary-action"
            type="button"
            onClick={() => submitForm('draft')}
          >
            <Save size={16} strokeWidth={1.8} />
            <span>Enregistrer</span>
          </button>

          <button
            className="product-form-primary-action"
            type="button"
            onClick={() => submitForm('publish')}
          >
            <CheckCircle2 size={16} strokeWidth={1.8} />
            <span>Publier</span>
          </button>
        </div>
      </section>

      {errors.length > 0 ? (
        <div className="product-form-alert product-form-alert--error">
          {errors.map((error) => (
            <span key={error}>{error}</span>
          ))}
        </div>
      ) : null}

      {confirmation ? (
        <div className="product-form-alert product-form-alert--success">
          {confirmation}
        </div>
      ) : null}

      <section className="product-form-layout">
        <div className="product-form-main-column">
          <div className="dashboard-card product-form-card">
            <div className="product-form-card__header">
              <div className="product-form-card__icon">
                <Package size={20} strokeWidth={1.7} />
              </div>

              <div>
                <h2>Informations générales</h2>
                <p>Identité, référencement et description du produit.</p>
              </div>
            </div>

            <div className="product-form-grid">
              <Field
                label="Nom du produit"
                name="name"
                value={formState.name}
                placeholder="Baskets Nova Premium"
                onChange={updateField}
                required
              />

              <Field
                label="SKU"
                name="sku"
                value={formState.sku}
                placeholder="NV001"
                onChange={updateField}
                required
              />

              <SelectField
                label="Catégorie"
                name="category"
                value={formState.category}
                options={categories}
                onChange={updateField}
              />

              <SelectField
                label="Sous-catégorie"
                name="subcategory"
                value={formState.subcategory}
                options={subcategories}
                onChange={updateField}
              />

              <label className="product-form-field product-form-field--wide">
                <span>
                  Description
                  <strong>*</strong>
                </span>

                <textarea
                  name="description"
                  value={formState.description}
                  placeholder="Décrivez le style, les matériaux et les bénéfices."
                  onChange={updateField}
                />
              </label>
            </div>
          </div>

          <div className="dashboard-card product-form-card">
            <div className="product-form-card__header">
              <div className="product-form-card__icon">
                <Tag size={20} strokeWidth={1.7} />
              </div>

              <div>
                <h2>Prix</h2>
                <p>Tarification boutique et offre promotionnelle.</p>
              </div>
            </div>

            <div className="product-form-grid product-form-grid--three">
              <Field
                label="Prix normal"
                name="regularPrice"
                type="number"
                value={formState.regularPrice}
                suffix="DH"
                onChange={updateField}
                required
              />

              <Field
                label="Prix promotionnel"
                name="salePrice"
                type="number"
                value={formState.salePrice}
                suffix="DH"
                onChange={updateField}
              />

              <Field
                label="TVA"
                name="taxRate"
                type="number"
                value={formState.taxRate}
                suffix="%"
                onChange={updateField}
              />
            </div>
          </div>

          <div className="dashboard-card product-form-card">
            <div className="product-form-card__header">
              <div className="product-form-card__icon">
                <ImagePlus size={20} strokeWidth={1.7} />
              </div>

              <div>
                <h2>Images</h2>
                <p>Prévisualisation locale uniquement, sans envoi serveur.</p>
              </div>
            </div>

            <div className="product-form-images">
              <label className="product-form-upload">
                <UploadCloud size={26} strokeWidth={1.6} />
                <strong>Ajouter des images</strong>
                <span>JPG ou PNG, aperçu local jusqu'à 4 fichiers</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                />
              </label>

              <div className="product-form-preview-grid">
                {imagePreviews.map((image) => (
                  <div
                    className="product-form-preview"
                    key={image.id}
                  >
                    <img src={image.src} alt={image.name} />
                    <span>{image.name}</span>
                  </div>
                ))}

                {imagePreviews.length === 0
                  ? [1, 2, 3].map((item) => (
                      <div
                        className="product-form-preview product-form-preview--empty"
                        key={item}
                      >
                        <ImagePlus size={22} strokeWidth={1.6} />
                        <span>Aperçu</span>
                      </div>
                    ))
                  : null}
              </div>
            </div>
          </div>
        </div>

        <aside className="product-form-side-column">
          <div className="dashboard-card product-form-card">
            <div className="product-form-card__header product-form-card__header--compact">
              <h2>Stock</h2>
            </div>

            <div className="product-form-stack">
              <Field
                label="Quantité"
                name="quantity"
                type="number"
                value={formState.quantity}
                onChange={updateField}
              />

              <SelectField
                label="Statut du stock"
                name="stockStatus"
                value={formState.stockStatus}
                options={stockStatuses}
                onChange={updateField}
              />

              <Field
                label="Seuil stock faible"
                name="lowStockThreshold"
                type="number"
                value={formState.lowStockThreshold}
                onChange={updateField}
              />
            </div>
          </div>

          <div className="dashboard-card product-form-card">
            <div className="product-form-card__header product-form-card__header--compact">
              <h2>Variantes</h2>
            </div>

            <div className="product-form-option-group">
              <strong>Tailles</strong>

              <div className="product-form-chips">
                {sizeOptions.map((size) => (
                  <button
                    className={
                      formState.sizes.includes(size)
                        ? 'is-selected'
                        : ''
                    }
                    type="button"
                    key={size}
                    onClick={() => toggleValue('sizes', size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="product-form-option-group">
              <strong>Couleurs</strong>

              <div className="product-form-chips">
                {colorOptions.map((color) => (
                  <button
                    className={
                      formState.colors.includes(color)
                        ? 'is-selected'
                        : ''
                    }
                    type="button"
                    key={color}
                    onClick={() => toggleValue('colors', color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="dashboard-card product-form-card">
            <div className="product-form-card__header product-form-card__header--compact">
              <h2>Publication</h2>
            </div>

            <div className="product-form-stack">
              <SelectField
                label="Statut"
                name="publicationStatus"
                value={formState.publicationStatus}
                options={publicationStatuses}
                onChange={updateField}
              />

              <SelectField
                label="Visibilité"
                name="visibility"
                value={formState.visibility}
                options={visibilityOptions}
                onChange={updateField}
              />

              <Toggle
                label="Produit en avant"
                description="Affiché dans les sélections admin."
                checked={formState.featured}
                onChange={() => toggleBoolean('featured')}
              />

              <Toggle
                label="Nouveauté"
                description="Signalé dans les nouveautés boutique."
                checked={formState.isNew}
                onChange={() => toggleBoolean('isNew')}
              />
            </div>
          </div>

          <div className="product-form-footer-actions">
            <button
              type="button"
              onClick={() => navigate('/admin/produits')}
            >
              Annuler
            </button>

            <button
              type="button"
              onClick={() => submitForm('publish')}
            >
              {mode === 'edit' ? 'Mettre à jour' : 'Créer le produit'}
            </button>
          </div>
        </aside>
      </section>
    </main>
  )
}

export default ProductForm
