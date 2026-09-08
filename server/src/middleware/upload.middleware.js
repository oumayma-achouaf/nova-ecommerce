const fs = require('fs')
const path = require('path')
const multer = require('multer')

const avatarsDirectory = path.join(
  __dirname,
  '../../uploads/avatars',
)

if (!fs.existsSync(avatarsDirectory)) {
  fs.mkdirSync(avatarsDirectory, {
    recursive: true,
  })
}

const storage = multer.diskStorage({
  destination: (
    req,
    file,
    callback,
  ) => {
    callback(
      null,
      avatarsDirectory,
    )
  },

  filename: (
    req,
    file,
    callback,
  ) => {
    const extension =
      path.extname(
        file.originalname,
      )
        .toLowerCase()

    const safeName =
      `avatar-${req.user.id}-${Date.now()}${extension}`

    callback(
      null,
      safeName,
    )
  },
})

const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
]

const fileFilter = (
  req,
  file,
  callback,
) => {
  if (
    !allowedMimeTypes.includes(
      file.mimetype,
    )
  ) {
    const error =
      new Error(
        'Format d’image non autorisé. Utilisez JPG, PNG ou WebP.',
      )

    error.statusCode = 400

    callback(
      error,
      false,
    )

    return
  }

  callback(
    null,
    true,
  )
}

const uploadAvatar = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter,
})

module.exports = {
  uploadAvatar,
  avatarsDirectory,
}