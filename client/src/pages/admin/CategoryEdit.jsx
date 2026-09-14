import { Link, useParams } from 'react-router-dom'

import CategoryForm from '../../components/admin/CategoryForm.jsx'
import AdminHeader from '../../components/layout/AdminHeader.jsx'
import AdminSidebar from '../../components/layout/AdminSidebar.jsx'
import { getCategories } from '../../services/adminService.js'

export default function CategoryEdit() {
  const { id } = useParams()
  const category = getCategories().find(
    (currentCategory) => String(currentCategory.id) === String(id),
  )

  if (!category) {
    return (
      <div className="admin-layout">
        <AdminSidebar />

        <div className="admin-main">
          <AdminHeader />

          <main className="admin-dashboard product-form-page">
            <section className="product-form-heading">
              <div>
                <h1>Categorie introuvable</h1>
                <p>Aucune categorie locale ne correspond a cet identifiant.</p>
              </div>

              <Link
                className="product-form-primary-action"
                to="/admin/categories"
              >
                Retour aux categories
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

        <CategoryForm
          key={category.id}
          title={`Modifier ${category.name}`}
          subtitle="Mettez a jour cette categorie localement."
          initialValues={category}
          mode="edit"
        />
      </div>
    </div>
  )
}
