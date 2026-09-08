import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  Eye,
  EyeOff,
  Laptop,
  LockKeyhole,
  ShieldCheck,
  X,
} from 'lucide-react'

import AccountSidebar from '../../components/layout/AccountSidebar.jsx'

import {
  AuthContext,
} from '../../context/AuthContext.jsx'

import {
  changePassword,
  disableTwoFactor,
  enableTwoFactor,
  setupTwoFactor,
} from '../../services/authService.js'


function Security() {
  const {
    user,
    updateUser,
  } = useContext(AuthContext)

  const [showCurrent, setShowCurrent] =
    useState(false)

  const [showNew, setShowNew] =
    useState(false)

  const [showConfirm, setShowConfirm] =
    useState(false)

  const [passwordForm, setPasswordForm] =
    useState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })

  const [passwordError, setPasswordError] =
    useState('')

  const [
    passwordSuccess,
    setPasswordSuccess,
  ] = useState('')

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false)


  /* =========================
     2FA STATE
  ========================= */

  const [
    twoFactorSetup,
    setTwoFactorSetup,
  ] = useState(null)

  const [
    twoFactorCode,
    setTwoFactorCode,
  ] = useState('')

  const [
    twoFactorError,
    setTwoFactorError,
  ] = useState('')

  const [
    twoFactorSuccess,
    setTwoFactorSuccess,
  ] = useState('')

  const [
    twoFactorLoading,
    setTwoFactorLoading,
  ] = useState(false)

  const [
    disableMode,
    setDisableMode,
  ] = useState(false)

  const [
    disablePassword,
    setDisablePassword,
  ] = useState('')

  const twoFactorEnabled =
    Boolean(
      user?.twoFactorEnabled ??
        user?.two_factor_enabled,
    )


  /* =========================
     PASSWORD
  ========================= */

  const updatePasswordField = (
    event,
  ) => {
    const {
      name,
      value,
    } = event.target

    setPasswordForm(
      (current) => ({
        ...current,
        [name]: value,
      }),
    )

    setPasswordError('')
    setPasswordSuccess('')
  }


  const handlePasswordSubmit =
    async (event) => {
      event.preventDefault()

      if (isSubmitting) {
        return
      }

      setPasswordError('')
      setPasswordSuccess('')

      if (
        !passwordForm.currentPassword ||
        !passwordForm.newPassword ||
        !passwordForm.confirmPassword
      ) {
        setPasswordError(
          'Tous les champs de mot de passe sont requis.',
        )

        return
      }

      if (
        passwordForm.newPassword.length < 8
      ) {
        setPasswordError(
          'Le nouveau mot de passe doit contenir au moins 8 caractères.',
        )

        return
      }

      if (
        passwordForm.newPassword !==
        passwordForm.confirmPassword
      ) {
        setPasswordError(
          'La confirmation ne correspond pas au nouveau mot de passe.',
        )

        return
      }

      if (
        passwordForm.currentPassword ===
        passwordForm.newPassword
      ) {
        setPasswordError(
          'Le nouveau mot de passe doit être différent du mot de passe actuel.',
        )

        return
      }

      try {
        setIsSubmitting(true)

        const data =
          await changePassword(
            passwordForm.currentPassword,
            passwordForm.newPassword,
          )

        setPasswordSuccess(
          data?.message ||
            'Votre mot de passe a été modifié avec succès.',
        )

        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })

        setShowCurrent(false)
        setShowNew(false)
        setShowConfirm(false)
      } catch (error) {
        setPasswordError(
          error?.message ||
            'Impossible de modifier le mot de passe.',
        )
      } finally {
        setIsSubmitting(false)
      }
    }


  /* =========================
     START 2FA SETUP
  ========================= */

  const handleStartTwoFactor =
    async () => {
      if (twoFactorLoading) {
        return
      }

      try {
        setTwoFactorLoading(true)

        setTwoFactorError('')
        setTwoFactorSuccess('')

        const data =
          await setupTwoFactor()

        setTwoFactorSetup(data)
        setTwoFactorCode('')
        setDisableMode(false)
      } catch (error) {
        setTwoFactorError(
          error?.message ||
            'Impossible de démarrer la configuration 2FA.',
        )
      } finally {
        setTwoFactorLoading(false)
      }
    }


  /* =========================
     ENABLE 2FA
  ========================= */

  const handleEnableTwoFactor =
    async (event) => {
      event.preventDefault()

      if (twoFactorLoading) {
        return
      }

      const cleanCode =
        twoFactorCode.trim()

      if (!/^\d{6}$/.test(cleanCode)) {
        setTwoFactorError(
          'Saisissez le code à 6 chiffres affiché dans votre application.',
        )

        return
      }

      try {
        setTwoFactorLoading(true)

        setTwoFactorError('')
        setTwoFactorSuccess('')

        const data =
          await enableTwoFactor(
            cleanCode,
          )

        updateUser({
          ...user,
          twoFactorEnabled: true,
        })

        setTwoFactorSetup(null)
        setTwoFactorCode('')

        setTwoFactorSuccess(
          data?.message ||
            'La vérification en deux étapes a été activée.',
        )
      } catch (error) {
        setTwoFactorError(
          error?.message ||
            'Impossible d’activer la vérification en deux étapes.',
        )
      } finally {
        setTwoFactorLoading(false)
      }
    }


  /* =========================
     OPEN DISABLE FORM
  ========================= */

  const handleOpenDisable = () => {
    setDisableMode(true)

    setTwoFactorSetup(null)
    setTwoFactorCode('')
    setDisablePassword('')

    setTwoFactorError('')
    setTwoFactorSuccess('')
  }


  /* =========================
     DISABLE 2FA
  ========================= */

  const handleDisableTwoFactor =
    async (event) => {
      event.preventDefault()

      if (twoFactorLoading) {
        return
      }

      const cleanCode =
        twoFactorCode.trim()

      if (!disablePassword) {
        setTwoFactorError(
          'Saisissez votre mot de passe actuel.',
        )

        return
      }

      if (!/^\d{6}$/.test(cleanCode)) {
        setTwoFactorError(
          'Saisissez un code de vérification à 6 chiffres.',
        )

        return
      }

      try {
        setTwoFactorLoading(true)

        setTwoFactorError('')
        setTwoFactorSuccess('')

        const data =
          await disableTwoFactor(
            disablePassword,
            cleanCode,
          )

        updateUser({
          ...user,
          twoFactorEnabled: false,
        })

        setDisableMode(false)
        setDisablePassword('')
        setTwoFactorCode('')

        setTwoFactorSuccess(
          data?.message ||
            'La vérification en deux étapes a été désactivée.',
        )
      } catch (error) {
        setTwoFactorError(
          error?.message ||
            'Impossible de désactiver la vérification en deux étapes.',
        )
      } finally {
        setTwoFactorLoading(false)
      }
    }


  const closeTwoFactorForms = () => {
    setTwoFactorSetup(null)
    setDisableMode(false)

    setTwoFactorCode('')
    setDisablePassword('')

    setTwoFactorError('')
  }


  return (
    <main className="security-page">

      <section className="account-hero">

        <div className="nova-container">

          <h1>
            Sécurité
          </h1>

          <p>
            Protégez votre compte et gérez
            vos connexions.
          </p>

        </div>

      </section>


      <div className="nova-container">

        <nav className="account-breadcrumb">

          <Link to="/">
            Accueil
          </Link>

          <span>/</span>

          <Link to="/mon-compte">
            Mon compte
          </Link>

          <span>/</span>

          <span>
            Sécurité
          </span>

        </nav>


        <div className="account-layout">

          <AccountSidebar />


          <div className="security-content">

            {passwordSuccess ? (
              <p
                className="account-pending-message success"
                role="status"
              >
                {passwordSuccess}
              </p>
            ) : null}


            {/* =====================
                PASSWORD
            ===================== */}

            <section className="security-card security-password-card">

              <div className="security-card-icon">

                <LockKeyhole
                  size={25}
                  strokeWidth={1.6}
                />

              </div>


              <div className="security-card-body">

                <div className="security-card-heading">

                  <h2>
                    Modifier le mot de passe
                  </h2>

                  <p>
                    Utilisez un mot de passe
                    long et unique.
                  </p>

                </div>


                <form
                  className="security-password-form"
                  onSubmit={
                    handlePasswordSubmit
                  }
                >

                  <label className="security-password-row">

                    <span>
                      Mot de passe actuel
                    </span>

                    <div className="security-password-input">

                      <input
                        name="currentPassword"
                        type={
                          showCurrent
                            ? 'text'
                            : 'password'
                        }
                        value={
                          passwordForm.currentPassword
                        }
                        onChange={
                          updatePasswordField
                        }
                        placeholder="Votre mot de passe actuel"
                        autoComplete="current-password"
                        required
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrent(
                            (current) =>
                              !current,
                          )
                        }
                        aria-label="Afficher ou masquer le mot de passe actuel"
                      >
                        {showCurrent ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>

                    </div>

                  </label>


                  <label className="security-password-row">

                    <span>
                      Nouveau mot de passe
                    </span>

                    <div className="security-password-input">

                      <input
                        name="newPassword"
                        type={
                          showNew
                            ? 'text'
                            : 'password'
                        }
                        value={
                          passwordForm.newPassword
                        }
                        onChange={
                          updatePasswordField
                        }
                        placeholder="Votre nouveau mot de passe"
                        autoComplete="new-password"
                        minLength={8}
                        required
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowNew(
                            (current) =>
                              !current,
                          )
                        }
                        aria-label="Afficher ou masquer le nouveau mot de passe"
                      >
                        {showNew ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>

                    </div>

                  </label>


                  <label className="security-password-row">

                    <span>
                      Confirmer le nouveau
                      mot de passe
                    </span>

                    <div className="security-password-input">

                      <input
                        name="confirmPassword"
                        type={
                          showConfirm
                            ? 'text'
                            : 'password'
                        }
                        value={
                          passwordForm.confirmPassword
                        }
                        onChange={
                          updatePasswordField
                        }
                        placeholder="Confirmez votre nouveau mot de passe"
                        autoComplete="new-password"
                        minLength={8}
                        required
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirm(
                            (current) =>
                              !current,
                          )
                        }
                        aria-label="Afficher ou masquer la confirmation"
                      >
                        {showConfirm ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>

                    </div>

                  </label>


                  <button
                    type="submit"
                    className="security-password-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? 'Mise à jour...'
                      : 'Mettre à jour le mot de passe'}
                  </button>


                  {passwordError ? (
                    <p
                      className="account-pending-message error"
                      role="alert"
                    >
                      {passwordError}
                    </p>
                  ) : null}

                </form>

              </div>

            </section>


            {/* =====================
                TWO FACTOR
            ===================== */}

            <section className="security-card security-row-card">

              <div className="security-card-icon">

                <ShieldCheck
                  size={26}
                  strokeWidth={1.6}
                />

              </div>


              <div className="security-row-content">

                <div>

                  <h2>
                    Vérification en deux étapes
                  </h2>

                  <p>
                    Ajoutez une protection
                    supplémentaire à votre
                    compte.
                  </p>

                </div>


                <div className="security-row-actions">

                  <span
                    className={`security-state-badge ${
                      twoFactorEnabled
                        ? 'enabled'
                        : ''
                    }`}
                  >
                    {twoFactorEnabled
                      ? 'Activée'
                      : 'Non activée'}
                  </span>


                  {!twoFactorEnabled ? (
                    <button
                      type="button"
                      className="security-outline-button"
                      onClick={
                        handleStartTwoFactor
                      }
                      disabled={
                        twoFactorLoading
                      }
                    >
                      {twoFactorLoading
                        ? 'Chargement...'
                        : 'Activer'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="security-outline-button"
                      onClick={
                        handleOpenDisable
                      }
                    >
                      Désactiver
                    </button>
                  )}

                </div>

              </div>

            </section>


            {twoFactorSuccess ? (
              <p
                className="account-pending-message success"
                role="status"
              >
                {twoFactorSuccess}
              </p>
            ) : null}


            {twoFactorError ? (
              <p
                className="account-pending-message error"
                role="alert"
              >
                {twoFactorError}
              </p>
            ) : null}


            {/* =====================
                2FA SETUP PANEL
            ===================== */}

            {twoFactorSetup ? (
              <section className="security-card">

                <div className="security-card-body">

                  <div className="security-card-heading">

                    <div
                      style={{
                        display: 'flex',
                        justifyContent:
                          'space-between',
                        alignItems:
                          'flex-start',
                        gap: '16px',
                      }}
                    >

                      <div>

                        <h2>
                          Configurer la
                          vérification en
                          deux étapes
                        </h2>

                        <p>
                          Scannez ce QR code
                          avec Google
                          Authenticator,
                          Microsoft
                          Authenticator ou
                          une autre
                          application TOTP.
                        </p>

                      </div>


                      <button
                        type="button"
                        className="icon-button"
                        onClick={
                          closeTwoFactorForms
                        }
                        aria-label="Fermer"
                      >
                        <X size={20} />
                      </button>

                    </div>

                  </div>


                  {twoFactorSetup.qrCodeDataUrl ? (
                    <div
                      style={{
                        margin:
                          '24px 0',
                      }}
                    >
                      <img
                        src={
                          twoFactorSetup.qrCodeDataUrl
                        }
                        alt="QR code de configuration 2FA"
                        style={{
                          width: '190px',
                          height: '190px',
                          display: 'block',
                        }}
                      />
                    </div>
                  ) : null}


                  {twoFactorSetup.manualKey ? (
                    <div
                      style={{
                        marginBottom:
                          '24px',
                      }}
                    >
                      <strong>
                        Clé manuelle
                      </strong>

                      <p
                        style={{
                          wordBreak:
                            'break-all',
                        }}
                      >
                        {
                          twoFactorSetup.manualKey
                        }
                      </p>
                    </div>
                  ) : null}


                  <form
                    onSubmit={
                      handleEnableTwoFactor
                    }
                    className="security-password-form"
                  >

                    <label className="security-password-row">

                      <span>
                        Code à 6 chiffres
                      </span>

                      <div className="security-password-input">

                        <input
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          maxLength={6}
                          value={
                            twoFactorCode
                          }
                          onChange={(
                            event,
                          ) => {
                            setTwoFactorCode(
                              event.target.value
                                .replace(
                                  /\D/g,
                                  '',
                                )
                                .slice(
                                  0,
                                  6,
                                ),
                            )

                            setTwoFactorError(
                              '',
                            )
                          }}
                          placeholder="000000"
                          required
                        />

                      </div>

                    </label>


                    <button
                      type="submit"
                      className="security-password-submit"
                      disabled={
                        twoFactorLoading
                      }
                    >
                      {twoFactorLoading
                        ? 'Vérification...'
                        : 'Confirmer et activer'}
                    </button>

                  </form>

                </div>

              </section>
            ) : null}


            {/* =====================
                DISABLE 2FA PANEL
            ===================== */}

            {disableMode ? (
              <section className="security-card">

                <div className="security-card-body">

                  <div className="security-card-heading">

                    <h2>
                      Désactiver la
                      vérification en deux
                      étapes
                    </h2>

                    <p>
                      Confirmez votre mot de
                      passe et le code actuel
                      de votre application
                      d’authentification.
                    </p>

                  </div>


                  <form
                    onSubmit={
                      handleDisableTwoFactor
                    }
                    className="security-password-form"
                  >

                    <label className="security-password-row">

                      <span>
                        Mot de passe actuel
                      </span>

                      <div className="security-password-input">

                        <input
                          type="password"
                          value={
                            disablePassword
                          }
                          onChange={(
                            event,
                          ) => {
                            setDisablePassword(
                              event.target.value,
                            )

                            setTwoFactorError(
                              '',
                            )
                          }}
                          autoComplete="current-password"
                          placeholder="Votre mot de passe"
                          required
                        />

                      </div>

                    </label>


                    <label className="security-password-row">

                      <span>
                        Code à 6 chiffres
                      </span>

                      <div className="security-password-input">

                        <input
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          maxLength={6}
                          value={
                            twoFactorCode
                          }
                          onChange={(
                            event,
                          ) => {
                            setTwoFactorCode(
                              event.target.value
                                .replace(
                                  /\D/g,
                                  '',
                                )
                                .slice(
                                  0,
                                  6,
                                ),
                            )

                            setTwoFactorError(
                              '',
                            )
                          }}
                          placeholder="000000"
                          required
                        />

                      </div>

                    </label>


                    <button
                      type="submit"
                      className="security-password-submit"
                      disabled={
                        twoFactorLoading
                      }
                    >
                      {twoFactorLoading
                        ? 'Désactivation...'
                        : 'Confirmer la désactivation'}
                    </button>


                    <button
                      type="button"
                      className="security-outline-button"
                      onClick={
                        closeTwoFactorForms
                      }
                      disabled={
                        twoFactorLoading
                      }
                    >
                      Annuler
                    </button>

                  </form>

                </div>

              </section>
            ) : null}


            {/* =====================
                DEVICES
            ===================== */}

            <section className="security-card security-row-card">

              <div className="security-card-icon">

                <Laptop
                  size={27}
                  strokeWidth={1.6}
                />

              </div>


              <div className="security-row-content">

                <div>

                  <h2>
                    Appareils connectés
                  </h2>


                  <div className="security-current-device">

                    <div>

                      <strong>
                        Cet appareil
                      </strong>

                      <span>
                        Navigateur web
                      </span>

                    </div>


                    <span className="security-current-session">
                      Session actuelle
                    </span>

                  </div>

                </div>


                <button
                  type="button"
                  className="security-outline-button security-disconnect-button"
                  disabled
                  title="La gestion des sessions sera connectée au backend à l’étape suivante."
                >
                  Déconnecter les autres appareils
                </button>

              </div>

            </section>

          </div>

        </div>

      </div>

    </main>
  )
}


export default Security