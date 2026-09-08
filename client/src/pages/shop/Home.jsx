import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  LockKeyhole,
  RefreshCw,
  Truck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import ProductCard from '../../components/product/ProductCard.jsx'
import productService from '../../services/productService.js'

import heroImage from '../../assets/images/nova-home-hero.jpg'
import categoryMen from '../../assets/images/nova-category-men.jpg'
import categoryWomen from '../../assets/images/nova-category-women.jpg'
import categoryAccessories from '../../assets/images/nova-category-accessories.jpg'
import productSneakers from '../../assets/images/nova-product-sneakers.jpg'
import productBag from '../../assets/images/nova-product-bag.jpg'
import productSweater from '../../assets/images/nova-product-sweater.jpg'
import productWatch from '../../assets/images/nova-product-watch.jpg'

const categories = [
  {
    title: 'Homme',
    subtitle: 'Allure et modernité',
    image: categoryMen,
    imageAlt:
      'Homme portant une veste noire et des lunettes de soleil',
    link: '/homme',
  },
  {
    title: 'Femme',
    subtitle: 'Élégance naturelle',
    image: categoryWomen,
    imageAlt: 'Femme portant un blazer beige',
    link: '/femme',
  },
  {
    title: 'Accessoires',
    subtitle: 'Les détails qui font la différence',
    image: categoryAccessories,
    imageAlt:
      'Sac noir, montre et lunettes sur pierre claire',
    link: '/accessoires',
  },
]

const services = [
  {
    title: 'Livraison rapide',
    subtitle: 'Partout au Maroc',
    icon: Truck,
  },
  {
    title: 'Paiement sécurisé',
    subtitle: '100% fiable et crypté',
    icon: LockKeyhole,
  },
  {
    title: 'Retours faciles',
    subtitle: 'Sous 14 jours',
    icon: RefreshCw,
  },
]

const bestSellerPresentation = [
  {
    id: 'baskets-nova',
    description: 'Un style qui vous suit partout',
    image: productSneakers,
    imageAlt: 'Baskets blanches Nova Premium',
    rating: 5,
    reviews: 124,
  },
  {
    id: 'sac-elise',
    description: "L'élégance au quotidien",
    image: productBag,
    imageAlt: 'Sac Élise noir avec fermoir doré',
    rating: 5,
    reviews: 89,
  },
  {
    id: 'pull-cachemire',
    description: 'Confort et raffinement',
    image: productSweater,
    imageAlt: 'Pull en cachemire vert olive',
    rating: 5,
    reviews: 102,
  },
  {
    id: 'montre-horizon',
    description: "L'essentiel, avec caractère",
    image: productWatch,
    imageAlt:
      'Montre Horizon avec cadran vert et bracelet brun',
    rating: 5,
    reviews: 76,
  },
]

function formatPrice(value) {
  return `${Number(value).toLocaleString('fr-FR')} DH`
}

function Home() {
  const [databaseProducts, setDatabaseProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadProducts() {
      try {
        setLoading(true)
        setError('')

        const data = await productService.getProducts()

        if (!active) {
          return
        }

        setDatabaseProducts(
          Array.isArray(data.products)
            ? data.products
            : [],
        )
      } catch (requestError) {
        if (!active) {
          return
        }

        setError(
          requestError?.message ||
            'Impossible de charger les produits.',
        )
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      active = false
    }
  }, [])

  const bestSellers = useMemo(() => {
    return bestSellerPresentation
      .map((presentation) => {
        const databaseProduct =
          databaseProducts.find(
            (product) =>
              product.slug === presentation.id,
          )

        if (!databaseProduct) {
          return null
        }

        const priceValue = Number(
          databaseProduct.price,
        )

        const oldPriceValue =
          databaseProduct.old_price !== null &&
          databaseProduct.old_price !== undefined
            ? Number(databaseProduct.old_price)
            : null

        const discount =
          oldPriceValue &&
          oldPriceValue > priceValue
            ? `-${Math.round(
                ((oldPriceValue - priceValue) /
                  oldPriceValue) *
                  100,
              )}%`
            : undefined

        return {
          ...presentation,

          databaseId: databaseProduct.id,

          name: databaseProduct.name,

          priceValue,

          price: formatPrice(priceValue),

          oldPrice: oldPriceValue
            ? formatPrice(oldPriceValue)
            : undefined,

          discount,

          stock: Number(databaseProduct.stock),

          availability:
            Number(databaseProduct.stock) > 0
              ? 'En stock'
              : 'Rupture de stock',

          gender: databaseProduct.gender,

          brand: databaseProduct.brand,

          status: databaseProduct.status,

          featured: Boolean(
            databaseProduct.featured,
          ),

          categoryId:
            databaseProduct.category_id,

          categoryName:
            databaseProduct.category_name,

          categorySlug:
            databaseProduct.category_slug,
        }
      })
      .filter(Boolean)
  }, [databaseProducts])

  return (
    <main className="home-page">
      <section
        className="home-hero"
        aria-labelledby="home-hero-title"
      >
        <img
          className="hero-photo"
          src={heroImage}
          alt="Nouvelle collection portée par un couple en tenue élégante"
        />

        <div className="nova-container hero-inner">
          <div className="hero-copy">
            <p className="hero-eyebrow">
              STYLE · QUALITÉ · PLUS LOIN ENSEMBLE
            </p>

            <h1 id="home-hero-title">
              La nouvelle collection
              <br />
              est arriv&eacute;e
            </h1>

            <p className="hero-description">
              Des pièces intemporelles pour une vie moderne.
              <br />
              Élégance, confort et caractère, en toute saison.
            </p>

            <Link
              className="hero-cta"
              to="/nouveautes"
            >
              Découvrir la collection
              <ArrowRight
                size={16}
                strokeWidth={1.6}
              />
            </Link>

            <div
              className="hero-dots"
              aria-hidden="true"
            >
              <span className="is-active" />
              <span />
              <span />
            </div>
          </div>
        </div>
      </section>

      <section
        className="category-strip nova-container"
        aria-label="Catégories"
      >
        {categories.map((category) => (
          <article
            className="category-card"
            key={category.title}
          >
            <img
              src={category.image}
              alt={category.imageAlt}
            />

            <div className="category-content">
              <h2>{category.title}</h2>
              <p>{category.subtitle}</p>

              <Link to={category.link}>
                Découvrir
                <ArrowRight
                  size={13}
                  strokeWidth={1.55}
                />
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section
        className="services-row"
        aria-label="Services"
      >
        <div className="nova-container services-grid">
          {services.map(
            ({
              title,
              subtitle,
              icon: Icon,
            }) => (
              <div
                className="service-item"
                key={title}
              >
                <Icon
                  size={24}
                  strokeWidth={1.55}
                />

                <div>
                  <h2>{title}</h2>
                  <p>{subtitle}</p>
                </div>
              </div>
            ),
          )}
        </div>
      </section>

      <section
        className="best-sellers nova-container"
        id="best-sellers"
        aria-labelledby="best-sellers-title"
      >
        <div className="section-heading">
          <h2 id="best-sellers-title">
            Nos meilleures ventes
          </h2>

          <Link to="/nouveautes">
            Voir tout
            <ArrowRight
              size={14}
              strokeWidth={1.55}
            />
          </Link>
        </div>

        {loading ? (
          <p>Chargement des produits...</p>
        ) : error ? (
          <p role="alert">{error}</p>
        ) : (
          <div className="products-grid">
            {bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Home