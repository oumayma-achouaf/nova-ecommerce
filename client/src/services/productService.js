import api from './api'

const productService = {
  async getProducts(params = {}) {
    const response = await api.get('/products', {
      params,
    })

    return response.data
  },

  async getProductBySlug(slug) {
    const response = await api.get(`/products/${slug}`)

    return response.data
  },
}

export default productService