const jwt = require('jsonwebtoken')
const env = require('../config/env')

function authenticate(req, res, next) {
  const header = req.headers.authorization || ''
  const [scheme, token] = header.split(' ')

  if (scheme !== 'Bearer' || !token) {
    res.status(401).json({ message: 'Authentification requise.' })
    return
  }

  if (!env.jwt.secret) {
    next(Object.assign(new Error('JWT_SECRET is not configured.'), { statusCode: 500 }))
    return
  }

  try {
    const payload = jwt.verify(token, env.jwt.secret)

    req.user = {
      id: Number(payload.sub),
      role: payload.role,
      email: payload.email,
    }

    next()
  } catch (error) {
    const message = error.name === 'TokenExpiredError' ? 'Session expirée.' : 'Jeton invalide.'
    res.status(401).json({ message })
  }
}

module.exports = {
  authenticate,
}
