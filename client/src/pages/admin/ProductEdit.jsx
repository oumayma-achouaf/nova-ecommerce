import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'

import ProductForm from '../../components/admin/ProductForm.jsx'
import AdminHeader from '../../components/layout/AdminHeader.jsx'
import AdminSidebar from '../../components/layout/AdminSidebar.jsx'
import { getProducts } from '../../services/adminService.js'

export default function ProductEdit() {
  const { id } = useParams()
  const product = getProducts().find(
    (currentProduct) => String(currentProduct.id) === String(id),
  )
  const initialImages = useMemo(
    () =>
      product?.image
        ? [
            {
              id: `${product.sku}-image`,
              src: product.image,
              name: product.name,
              isObjectUrl: false,
            },
          ]
        : [],
    [product],
  )

  if (!product) {
    return (
      <div className="admin-layout">
        <AdminSidebar />

        <div className="admin-main">
          <AdminHeader />

          <main className="admin-dashboard product-form-page">
            <section className="product-form-heading">
              <div>
                <h1>Produit introuvable</h1>
                <p>Aucun produit local ne correspond a cet identifiant.</p>
              </div>

              <Link
                className="product-form-primary-action"
                to="/admin/produits"
              >
                Retour aux produits
              </Link>
            </section>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
        <AdminHeader />

        <ProductForm
          key={id || product.sku}
          title={`Modifier ${product.name}`}
          subtitle="Mettez a jour les informations produit sans appel backend."
          breadcrumbCurrent={product.name}
          initialValues={product}
          initialImages={initialImages}
          mode="edit"
          productId={product.id}
        />
      </div>
    </div>
  )
}
