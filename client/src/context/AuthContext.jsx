import {
  createContext,
  useEffect,
  useState,
} from 'react'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

function persistAuth({ user, token }) {
  localStorage.setItem('nova_user', JSON.stringify(user))
  localStorage.setItem('nova_token', token)
}

function clearPersistedAuth() {
  localStorage.removeItem('nova_user')
  localStorage.removeItem('nova_token')
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('nova_token')

    async function initializeAuth() {
      if (!savedToken) {
        setLoading(false)
        return
      }

      try {
        const data = await authService.getMe()

        setUser(data.user)

        localStorage.setItem(
          'nova_user',
          JSON.stringify(data.user),
        )
      } catch {
        clearPersistedAuth()
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (credentials) => {
    const data = await authService.login(credentials)

    persistAuth(data)
    setUser(data.user)

    return data.user
  }

  const register = async (payload) => {
    const data = await authService.register(payload)

    persistAuth(data)
    setUser(data.user)

    return data.user
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)

    localStorage.setItem(
      'nova_user',
      JSON.stringify(updatedUser),
    )
  }

  const logout = () => {
    clearPersistedAuth()
    setUser(null)
  }

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    updateUser,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export {
  AuthContext,
  AuthProvider,
}