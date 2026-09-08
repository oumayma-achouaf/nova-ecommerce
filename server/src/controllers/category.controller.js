const pool = require('../config/db')

async function getCategories(req, res, next) {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        name,
        slug,
        description,
        image,
        status,
        created_at,
        updated_at
      FROM categories
      WHERE status = 'active'
      ORDER BY id ASC
    `)

    res.json({
      categories: rows,
    })
  } catch (error) {
    next(error)
  }
}

async function getCategoryBySlug(req, res, next) {
  try {
    const { slug } = req.params

    const [rows] = await pool.query(
      `
      SELECT
        id,
        name,
        slug,
        description,
        image,
        status,
        created_at,
        updated_at
      FROM categories
      WHERE slug = ?
        AND status = 'active'
      LIMIT 1
      `,
      [slug],
    )

    if (rows.length === 0) {
      res.status(404).json({
        message: 'Catégorie introuvable.',
      })
      return
    }

    res.json({
      category: rows[0],
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getCategories,
  getCategoryBySlug,
}