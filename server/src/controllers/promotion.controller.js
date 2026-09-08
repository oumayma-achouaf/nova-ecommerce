const db = require('../config/db')

async function getPromotions(req, res, next) {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        name,
        code,
        type,
        value,
        minimum_amount,
        max_uses,
        used_count,
        start_date,
        end_date,
        status,
        created_at
      FROM promotions
      ORDER BY created_at DESC
    `)

    res.json({
      promotions: rows,
    })
  } catch (error) {
    next(error)
  }
}

async function createPromotion(req, res, next) {
  try {
    const {
      name,
      code,
      type,
      value = 0,
      minimumAmount = 0,
      maxUses = null,
      startDate = null,
      endDate = null,
      status = 'active',
    } = req.body

    if (!name || !type) {
      return res.status(400).json({
        message: 'Le nom et le type de promotion sont obligatoires.',
      })
    }

    const allowedTypes = [
      'percentage',
      'fixed',
      'free_shipping',
    ]

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        message: 'Type de promotion invalide.',
      })
    }

    const allowedStatuses = [
      'active',
      'inactive',
      'expired',
      'scheduled',
    ]

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Statut de promotion invalide.',
      })
    }

    if (
      type === 'percentage' &&
      (Number(value) < 0 || Number(value) > 100)
    ) {
      return res.status(400).json({
        message:
          'Le pourcentage doit être compris entre 0 et 100.',
      })
    }

    const normalizedCode = code
      ? String(code).trim().toUpperCase()
      : null

    const [result] = await db.query(
      `
        INSERT INTO promotions (
          name,
          code,
          type,
          value,
          minimum_amount,
          max_uses,
          start_date,
          end_date,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        String(name).trim(),
        normalizedCode,
        type,
        Number(value) || 0,
        Number(minimumAmount) || 0,
        maxUses === null || maxUses === ''
          ? null
          : Number(maxUses),
        startDate || null,
        endDate || null,
        status,
      ],
    )

    const [rows] = await db.query(
      `
        SELECT *
        FROM promotions
        WHERE id = ?
      `,
      [result.insertId],
    )

    res.status(201).json({
      message: 'Promotion créée avec succès.',
      promotion: rows[0],
    })
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        message: 'Ce code promotionnel existe déjà.',
      })
    }

    next(error)
  }
}

async function updatePromotion(req, res, next) {
  try {
    const promotionId = Number(req.params.id)

    if (!Number.isInteger(promotionId)) {
      return res.status(400).json({
        message: 'Identifiant de promotion invalide.',
      })
    }

    const [existingRows] = await db.query(
      `
        SELECT *
        FROM promotions
        WHERE id = ?
      `,
      [promotionId],
    )

    if (existingRows.length === 0) {
      return res.status(404).json({
        message: 'Promotion introuvable.',
      })
    }

    const current = existingRows[0]

    const {
      name = current.name,
      code = current.code,
      type = current.type,
      value = current.value,
      minimumAmount = current.minimum_amount,
      maxUses = current.max_uses,
      startDate = current.start_date,
      endDate = current.end_date,
      status = current.status,
    } = req.body

    const allowedTypes = [
      'percentage',
      'fixed',
      'free_shipping',
    ]

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        message: 'Type de promotion invalide.',
      })
    }

    const allowedStatuses = [
      'active',
      'inactive',
      'expired',
      'scheduled',
    ]

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Statut de promotion invalide.',
      })
    }

    if (
      type === 'percentage' &&
      (Number(value) < 0 || Number(value) > 100)
    ) {
      return res.status(400).json({
        message:
          'Le pourcentage doit être compris entre 0 et 100.',
      })
    }

    const normalizedCode = code
      ? String(code).trim().toUpperCase()
      : null

    await db.query(
      `
        UPDATE promotions
        SET
          name = ?,
          code = ?,
          type = ?,
          value = ?,
          minimum_amount = ?,
          max_uses = ?,
          start_date = ?,
          end_date = ?,
          status = ?
        WHERE id = ?
      `,
      [
        String(name).trim(),
        normalizedCode,
        type,
        Number(value) || 0,
        Number(minimumAmount) || 0,
        maxUses === null || maxUses === ''
          ? null
          : Number(maxUses),
        startDate || null,
        endDate || null,
        status,
        promotionId,
      ],
    )

    const [rows] = await db.query(
      `
        SELECT *
        FROM promotions
        WHERE id = ?
      `,
      [promotionId],
    )

    res.json({
      message: 'Promotion mise à jour.',
      promotion: rows[0],
    })
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        message: 'Ce code promotionnel existe déjà.',
      })
    }

    next(error)
  }
}

async function deletePromotion(req, res, next) {
  try {
    const promotionId = Number(req.params.id)

    if (!Number.isInteger(promotionId)) {
      return res.status(400).json({
        message: 'Identifiant de promotion invalide.',
      })
    }

    const [result] = await db.query(
      `
        DELETE FROM promotions
        WHERE id = ?
      `,
      [promotionId],
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Promotion introuvable.',
      })
    }

    res.json({
      message: 'Promotion supprimée.',
    })
  } catch (error) {
    next(error)
  }
}

async function validatePromotion(req, res, next) {
  try {
    const {
      code,
      subtotal,
      productIds = [],
    } = req.body

    if (!code) {
      return res.status(400).json({
        message: 'Le code promotionnel est obligatoire.',
      })
    }

    const subtotalValue = Number(subtotal)

    if (!Number.isFinite(subtotalValue) || subtotalValue < 0) {
      return res.status(400).json({
        message: 'Montant du panier invalide.',
      })
    }

    const normalizedCode = String(code)
      .trim()
      .toUpperCase()

    const [rows] = await db.query(
      `
        SELECT *
        FROM promotions
        WHERE UPPER(code) = ?
        LIMIT 1
      `,
      [normalizedCode],
    )

    if (rows.length === 0) {
      return res.status(404).json({
        message: 'Code promotionnel invalide.',
      })
    }

    const promotion = rows[0]
    const now = new Date()

    if (promotion.status !== 'active') {
      return res.status(400).json({
        message: 'Cette promotion n’est pas active.',
      })
    }

    if (
      promotion.start_date &&
      new Date(promotion.start_date) > now
    ) {
      return res.status(400).json({
        message: 'Cette promotion n’a pas encore commencé.',
      })
    }

    if (
      promotion.end_date &&
      new Date(promotion.end_date) < now
    ) {
      return res.status(400).json({
        message: 'Cette promotion a expiré.',
      })
    }

    if (
      promotion.max_uses !== null &&
      Number(promotion.used_count) >=
        Number(promotion.max_uses)
    ) {
      return res.status(400).json({
        message:
          'Cette promotion a atteint sa limite d’utilisation.',
      })
    }

    if (
      subtotalValue <
      Number(promotion.minimum_amount || 0)
    ) {
      return res.status(400).json({
        message: `Montant minimum requis : ${Number(
          promotion.minimum_amount,
        ).toLocaleString('fr-FR')} DH.`,
      })
    }

    const [linkedProducts] = await db.query(
      `
        SELECT product_id
        FROM promotion_products
        WHERE promotion_id = ?
      `,
      [promotion.id],
    )

    if (linkedProducts.length > 0) {
      const allowedProductIds = linkedProducts.map(
        (item) => Number(item.product_id),
      )

      const normalizedProductIds = Array.isArray(productIds)
        ? productIds.map(Number)
        : []

      const hasEligibleProduct =
        normalizedProductIds.some((id) =>
          allowedProductIds.includes(id),
        )

      if (!hasEligibleProduct) {
        return res.status(400).json({
          message:
            'Ce code ne s’applique pas aux produits de votre panier.',
        })
      }
    }

    let discountAmount = 0
    let freeShipping = false

    if (promotion.type === 'percentage') {
      discountAmount =
        subtotalValue *
        (Number(promotion.value) / 100)
    }

    if (promotion.type === 'fixed') {
      discountAmount = Math.min(
        subtotalValue,
        Number(promotion.value),
      )
    }

    if (promotion.type === 'free_shipping') {
      freeShipping = true
    }

    res.json({
      valid: true,
      promotion: {
        id: promotion.id,
        name: promotion.name,
        code: promotion.code,
        type: promotion.type,
        value: Number(promotion.value),
      },
      discountAmount: Number(
        discountAmount.toFixed(2),
      ),
      freeShipping,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  validatePromotion,
}