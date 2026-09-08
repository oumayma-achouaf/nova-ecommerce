const fs = require('fs')
const path = require('path')

const db = require('../config/db')

const avatarsDirectory = path.join(
  __dirname,
  '../../uploads/avatars',
)

const getUserById = async (userId) => {
  const [rows] = await db.execute(
    `
    SELECT
      id,
      first_name,
      last_name,
      email,
      phone,
      city,
      country,
      avatar_url,
      newsletter_opt_in,
      role,
      is_active,
      created_at,
      updated_at
    FROM users
    WHERE id = ?
    LIMIT 1
    `,
    [userId],
  )

  return rows[0] || null
}

const deleteAvatarFile = (avatarUrl) => {
  if (!avatarUrl) {
    return
  }

  const filename = path.basename(
    avatarUrl,
  )

  const filePath = path.join(
    avatarsDirectory,
    filename,
  )

  if (!filePath.startsWith(avatarsDirectory)) {
    return
  }

  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath)
    } catch (error) {
      console.error(
        'Impossible de supprimer l’ancien avatar :',
        error.message,
      )
    }
  }
}

const getMyProfile = async (
  req,
  res,
  next,
) => {
  try {
    const userId = req.user.id

    const user =
      await getUserById(userId)

    if (!user) {
      return res.status(404).json({
        message:
          'Utilisateur introuvable.',
      })
    }

    return res.json({
      user,
    })
  } catch (error) {
    next(error)
  }
}

const updateMyProfile = async (
  req,
  res,
  next,
) => {
  try {
    const userId = req.user.id

    const {
      first_name,
      last_name,
      phone,
      city,
      country,
      newsletter_opt_in,
    } = req.body

    const firstName =
      String(first_name || '').trim()

    const lastName =
      String(last_name || '').trim()

    if (!firstName) {
      return res.status(400).json({
        message:
          'Le prénom est obligatoire.',
      })
    }

    if (!lastName) {
      return res.status(400).json({
        message:
          'Le nom est obligatoire.',
      })
    }

    let newsletterOptIn = 0

    if (
      newsletter_opt_in === true ||
      newsletter_opt_in === 1 ||
      newsletter_opt_in === '1' ||
      newsletter_opt_in === 'true'
    ) {
      newsletterOptIn = 1
    }

    await db.execute(
      `
      UPDATE users
      SET
        first_name = ?,
        last_name = ?,
        phone = ?,
        city = ?,
        country = ?,
        newsletter_opt_in = ?
      WHERE id = ?
      `,
      [
        firstName,
        lastName,
        phone
          ? String(phone).trim()
          : null,
        city
          ? String(city).trim()
          : null,
        country
          ? String(country).trim()
          : 'Maroc',
        newsletterOptIn,
        userId,
      ],
    )

    const user =
      await getUserById(userId)

    return res.json({
      message:
        'Profil mis à jour avec succès.',
      user,
    })
  } catch (error) {
    next(error)
  }
}

const uploadMyAvatar = async (
  req,
  res,
  next,
) => {
  try {
    const userId = req.user.id

    if (!req.file) {
      return res.status(400).json({
        message:
          'Veuillez sélectionner une image.',
      })
    }

    const currentUser =
      await getUserById(userId)

    if (!currentUser) {
      deleteAvatarFile(
        `/uploads/avatars/${req.file.filename}`,
      )

      return res.status(404).json({
        message:
          'Utilisateur introuvable.',
      })
    }

    const avatarUrl =
      `/uploads/avatars/${req.file.filename}`

    await db.execute(
      `
      UPDATE users
      SET avatar_url = ?
      WHERE id = ?
      `,
      [
        avatarUrl,
        userId,
      ],
    )

    if (
      currentUser.avatar_url &&
      currentUser.avatar_url !== avatarUrl
    ) {
      deleteAvatarFile(
        currentUser.avatar_url,
      )
    }

    const user =
      await getUserById(userId)

    return res.json({
      message:
        'Photo de profil mise à jour avec succès.',
      user,
    })
  } catch (error) {
    if (req.file) {
      deleteAvatarFile(
        `/uploads/avatars/${req.file.filename}`,
      )
    }

    next(error)
  }
}

const deleteMyAvatar = async (
  req,
  res,
  next,
) => {
  try {
    const userId = req.user.id

    const currentUser =
      await getUserById(userId)

    if (!currentUser) {
      return res.status(404).json({
        message:
          'Utilisateur introuvable.',
      })
    }

    await db.execute(
      `
      UPDATE users
      SET avatar_url = NULL
      WHERE id = ?
      `,
      [userId],
    )

    if (currentUser.avatar_url) {
      deleteAvatarFile(
        currentUser.avatar_url,
      )
    }

    const user =
      await getUserById(userId)

    return res.json({
      message:
        'Photo de profil supprimée avec succès.',
      user,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getMyProfile,
  updateMyProfile,
  uploadMyAvatar,
  deleteMyAvatar,
}