require('./config/env')

const app = require('./app')
const env = require('./config/env')
const {
  ensureAdminSchema,
  ensureAuthSchema,
} = require('./config/db')

async function startServer() {
  try {
    await ensureAuthSchema()
    console.log('Auth database schema is ready.')
    await ensureAdminSchema()
    console.log('Admin database schema is ready.')
  } catch (error) {
    console.error('Database schema could not be verified. Check MySQL/XAMPP configuration.')
    console.error(error.message)
  }

  app.listen(env.port, () => {
    console.log(`NOVA API running on port ${env.port}`)
  })
}

startServer()
