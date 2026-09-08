require('./config/env')

const app = require('./app')
const env = require('./config/env')
const { ensureAuthSchema } = require('./config/db')

async function startServer() {
  try {
    await ensureAuthSchema()
    console.log('Auth database schema is ready.')
  } catch (error) {
    console.error('Auth database schema could not be verified. Check MySQL/XAMPP configuration.')
    console.error(error.message)
  }

  app.listen(env.port, () => {
    console.log(`NOVA API running on port ${env.port}`)
  })
}

startServer()
