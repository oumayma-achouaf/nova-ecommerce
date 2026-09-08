import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import useAuth from '../../hooks/useAuth.js'

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || '/mon-compte'

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/mon-compte', { replace: true })
    }
  }, [isAuthenticated, loading, navigate])

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target

    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!formData.email.trim() || !formData.password) {
      setError('Veuillez saisir votre adresse e-mail et votre mot de passe.')
      return
    }

    try {
      setSubmitting(true)
      await login({
        email: formData.email,
        password: formData.password,
      })
      navigate(redirectTo, { replace: true })
    } catch (requestError) {
      setError(requestError.message || 'Connexion impossible pour le moment.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <div className="nova-container">
          <h1>Connexion</h1>
          <p>Accédez à votre compte NOVA.</p>
        </div>
      </section>

      <div className="nova-container">
        <nav className="auth-breadcrumb">
          <Link to="/">Accueil</Link>
          <span>/</span>
          <span>Connexion</span>
        </nav>

        <section className="auth-layout">
          <div className="auth-card">
            <div className="auth-card-heading">
              <h2>Ravi de vous revoir</h2>
              <p>Connectez-vous pour retrouver vos commandes, favoris et adresses.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <label className="auth-field">
                <span>Adresse e-mail</span>
                <div className="auth-input-wrap">
                  <Mail size={18} strokeWidth={1.5} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Votre adresse e-mail"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </div>
              </label>

              <label className="auth-field">
                <span>Mot de passe</span>
                <div className="auth-input-wrap">
                  <LockKeyhole size={18} strokeWidth={1.5} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Votre mot de passe"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label="Afficher ou masquer le mot de passe"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              <div className="auth-options">
                <label className="auth-remember">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                  />
                  <span>Se souvenir de moi</span>
                </label>

                <Link to="/mot-de-passe-oublie">Mot de passe oublié ?</Link>
              </div>

              {error ? <p className="auth-error" role="alert">{error}</p> : null}

              <button type="submit" className="auth-submit-button" disabled={submitting}>
                {submitting ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>

            <div className="auth-separator">
              <span>ou</span>
            </div>

            <div className="auth-register-message">
              <span>Vous n'avez pas encore de compte ?</span>
              <Link to="/inscription">Créer un compte</Link>
            </div>
          </div>

          <aside className="auth-side-card">
            <span className="auth-side-small">L’univers NOVA</span>
            <h2>
              Votre style,
              <br />
              votre espace.
            </h2>
            <p>
              Créez votre compte pour enregistrer vos favoris, suivre vos commandes et profiter d'une
              expérience personnalisée.
            </p>
            <Link to="/nouveautes">Découvrir la collection</Link>
          </aside>
        </section>
      </div>
    </main>
  )
}

export default Login
