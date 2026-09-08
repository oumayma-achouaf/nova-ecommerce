import axios from 'axios'

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    'http://localhost:5000/api',
})

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        'nova_token',
      )

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`
    }

    const isFormData =
      config.data instanceof FormData

    if (isFormData) {
      delete config.headers[
        'Content-Type'
      ]
    } else if (
      !config.headers[
        'Content-Type'
      ]
    ) {
      config.headers[
        'Content-Type'
      ] =
        'application/json'
    }

    return config
  },
)

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const data =
      error.response?.data || {}

    const message =
      data.message ||
      error.message ||
      'Une erreur est survenue.'

    return Promise.reject(
      Object.assign(
        new Error(message),
        {
          status:
            error.response?.status,

          code:
            data.code,

          errors:
            data.errors || [],

          data,
        },
      ),
    )
  },
)

export default api