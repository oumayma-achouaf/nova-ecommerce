const express = require('express')

const {
  getMyProfile,
  updateMyProfile,
  uploadMyAvatar,
  deleteMyAvatar,
} = require('../controllers/user.controller')

const {
  authenticate,
} = require('../middleware/auth.middleware')

const {
  uploadAvatar,
} = require('../middleware/upload.middleware')

const router = express.Router()

router.get(
  '/me',
  authenticate,
  getMyProfile,
)

router.put(
  '/me',
  authenticate,
  updateMyProfile,
)

router.post(
  '/me/avatar',
  authenticate,
  uploadAvatar.single('avatar'),
  uploadMyAvatar,
)

router.delete(
  '/me/avatar',
  authenticate,
  deleteMyAvatar,
)

module.exports = router