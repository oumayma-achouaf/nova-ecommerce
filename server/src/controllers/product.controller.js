const pool = require('../config/db')

async function getProducts(req, res, next) {
  try {
    const {
      category,
      gender,
      featured,
      search,
      status = 'active',
    } = req.query

    const conditions = []
    const values = []

    if (status) {
      conditions.push('p.status = ?')
      values.push(status)
    }

    if (category) {
      conditions.push('c.slug = ?')
      values.push(category)
    }

    if (gender) {
      conditions.push('p.gender = ?')
      values.push(gender)
    }

    if (featured !== undefined) {
      conditions.push('p.featured = ?')

      values.push(
        featured === 'true' ||
          featured === '1'
          ? 1
          : 0,
      )
    }

    if (search) {
      conditions.push(
        `(
          p.name LIKE ?
          OR p.description LIKE ?
          OR p.brand LIKE ?
        )`,
      )

      const term =
        `%${search}%`

      values.push(
        term,
        term,
        term,
      )
    }

    const whereClause =
      conditions.length > 0
        ? `WHERE ${conditions.join(
            ' AND ',
          )}`
        : ''

    const [rows] =
      await pool.query(
        `
        SELECT
          p.id,
          p.category_id,
          p.name,
          p.slug,
          p.sku,
          p.short_description,
          p.description,
          p.price,
          p.old_price,
          p.stock,
          p.gender,
          p.brand,
          p.status,
          p.featured,
          p.created_at,
          p.updated_at,

          c.name AS category_name,
          c.slug AS category_slug,

          (
            SELECT pi.image_url
            FROM product_images pi
            WHERE pi.product_id = p.id
            ORDER BY
              pi.is_primary DESC,
              pi.sort_order ASC,
              pi.id ASC
            LIMIT 1
          ) AS image_url,

          (
            SELECT pi.alt_text
            FROM product_images pi
            WHERE pi.product_id = p.id
            ORDER BY
              pi.is_primary DESC,
              pi.sort_order ASC,
              pi.id ASC
            LIMIT 1
          ) AS image_alt

        FROM products p

        LEFT JOIN categories c
          ON c.id = p.category_id

        ${whereClause}

        ORDER BY
          p.created_at DESC,
          p.id DESC
        `,
        values,
      )

    res.json({
      products: rows,
    })
  } catch (error) {
    next(error)
  }
}

async function getProductBySlug(
  req,
  res,
  next,
) {
  try {
    const {
      slug,
    } = req.params

    const [rows] =
      await pool.query(
        `
        SELECT
          p.id,
          p.category_id,
          p.name,
          p.slug,
          p.sku,
          p.short_description,
          p.description,
          p.price,
          p.old_price,
          p.stock,
          p.gender,
          p.brand,
          p.status,
          p.featured,
          p.created_at,
          p.updated_at,

          c.name AS category_name,
          c.slug AS category_slug

        FROM products p

        LEFT JOIN categories c
          ON c.id = p.category_id

        WHERE p.slug = ?
          AND p.status = 'active'

        LIMIT 1
        `,
        [slug],
      )

    if (
      rows.length === 0
    ) {
      res.status(404).json({
        message:
          'Produit introuvable.',
      })

      return
    }

    const product =
      rows[0]

    const [variants] =
      await pool.query(
        `
        SELECT
          id,
          product_id,
          size,
          color,
          sku,
          stock,
          additional_price

        FROM product_variants

        WHERE product_id = ?

        ORDER BY id ASC
        `,
        [product.id],
      )

    const [images] =
      await pool.query(
        `
        SELECT
          id,
          product_id,
          image_url,
          alt_text,
          is_primary,
          sort_order,
          created_at

        FROM product_images

        WHERE product_id = ?

        ORDER BY
          is_primary DESC,
          sort_order ASC,
          id ASC
        `,
        [product.id],
      )

    res.json({
      product: {
        ...product,
        variants,
        images,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getProducts,
  getProductBySlug,
}