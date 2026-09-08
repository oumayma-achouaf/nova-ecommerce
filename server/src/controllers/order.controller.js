const pool = require('../config/db')

function generateOrderNumber() {
  const timestamp = Date.now()
  const random = Math.floor(
    1000 + Math.random() * 9000,
  )

  return `NOVA-${timestamp}-${random}`
}

async function getOrderItems(
  connection,
  orderId,
) {
  const [items] = await connection.query(
    `
    SELECT
      oi.id,
      oi.order_id,
      oi.product_id,
      oi.variant_id,
      oi.product_name,
      oi.product_sku,
      oi.size,
      oi.color,
      oi.quantity,
      oi.unit_price,
      oi.total_price,
      p.slug
    FROM order_items oi
    LEFT JOIN products p
      ON p.id = oi.product_id
    WHERE oi.order_id = ?
    ORDER BY oi.id ASC
    `,
    [orderId],
  )

  return items
}

/*
  =========================
  PROMOTION
  =========================
*/

async function calculatePromotion({
  connection,
  code,
  subtotal,
  cartItems,
  deliveryMethod,
}) {
  if (!code) {
    return {
      promotion: null,
      discount: 0,
      freeShipping: false,
      shippingCost:
        deliveryMethod === 'express'
          ? 50
          : 0,
    }
  }

  const normalizedCode = String(code)
    .trim()
    .toUpperCase()

  if (!normalizedCode) {
    return {
      promotion: null,
      discount: 0,
      freeShipping: false,
      shippingCost:
        deliveryMethod === 'express'
          ? 50
          : 0,
    }
  }

  /*
    On verrouille la promotion pendant
    la transaction pour éviter plusieurs
    utilisations simultanées incorrectes.
  */
  const [promotionRows] =
    await connection.query(
      `
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
        status
      FROM promotions
      WHERE UPPER(code) = ?
      LIMIT 1
      FOR UPDATE
      `,
      [normalizedCode],
    )

  if (promotionRows.length === 0) {
    throw Object.assign(
      new Error(
        'Code promotionnel invalide.',
      ),
      {
        statusCode: 400,
      },
    )
  }

  const promotion =
    promotionRows[0]

  if (
    promotion.status !== 'active'
  ) {
    throw Object.assign(
      new Error(
        'Cette promotion n’est pas active.',
      ),
      {
        statusCode: 400,
      },
    )
  }

  const now = new Date()

  if (
    promotion.start_date &&
    new Date(
      promotion.start_date,
    ) > now
  ) {
    throw Object.assign(
      new Error(
        'Cette promotion n’est pas encore disponible.',
      ),
      {
        statusCode: 400,
      },
    )
  }

  if (
    promotion.end_date &&
    new Date(
      promotion.end_date,
    ) < now
  ) {
    throw Object.assign(
      new Error(
        'Cette promotion a expiré.',
      ),
      {
        statusCode: 400,
      },
    )
  }

  if (
    promotion.max_uses !== null &&
    Number(
      promotion.used_count || 0,
    ) >=
      Number(
        promotion.max_uses,
      )
  ) {
    throw Object.assign(
      new Error(
        'Cette promotion a atteint sa limite d’utilisation.',
      ),
      {
        statusCode: 400,
      },
    )
  }

  const minimumAmount = Number(
    promotion.minimum_amount || 0,
  )

  if (
    Number(subtotal) <
    minimumAmount
  ) {
    throw Object.assign(
      new Error(
        `Montant minimum requis : ${minimumAmount.toLocaleString(
          'fr-FR',
        )} DH.`,
      ),
      {
        statusCode: 400,
      },
    )
  }

  /*
    Vérifier si la promotion est limitée
    à certains produits.
  */
  const [promotionProducts] =
    await connection.query(
      `
      SELECT product_id
      FROM promotion_products
      WHERE promotion_id = ?
      `,
      [promotion.id],
    )

  const restrictedProductIds =
    promotionProducts.map(
      (row) =>
        Number(
          row.product_id,
        ),
    )

  let eligibleSubtotal = 0

  if (
    restrictedProductIds.length === 0
  ) {
    eligibleSubtotal =
      Number(subtotal)
  } else {
    for (const item of cartItems) {
      if (
        !restrictedProductIds.includes(
          Number(
            item.product_id,
          ),
        )
      ) {
        continue
      }

      const unitPrice =
        Number(
          item.product_price || 0,
        ) +
        Number(
          item.additional_price || 0,
        )

      eligibleSubtotal +=
        unitPrice *
        Number(
          item.quantity || 0,
        )
    }

    if (eligibleSubtotal <= 0) {
      throw Object.assign(
        new Error(
          'Cette promotion ne s’applique à aucun produit de votre panier.',
        ),
        {
          statusCode: 400,
        },
      )
    }
  }

  let discount = 0
  let freeShipping = false

  if (
    promotion.type ===
    'percentage'
  ) {
    const percentage = Number(
      promotion.value || 0,
    )

    discount =
      eligibleSubtotal *
      (percentage / 100)
  } else if (
    promotion.type === 'fixed'
  ) {
    discount = Math.min(
      Number(
        promotion.value || 0,
      ),
      eligibleSubtotal,
    )
  } else if (
    promotion.type ===
    'free_shipping'
  ) {
    freeShipping = true
  } else {
    throw Object.assign(
      new Error(
        'Type de promotion invalide.',
      ),
      {
        statusCode: 400,
      },
    )
  }

  /*
    Arrondi à 2 décimales.
  */
  discount =
    Math.round(
      discount * 100,
    ) / 100

  const shippingCost =
    freeShipping
      ? 0
      : deliveryMethod ===
          'express'
        ? 50
        : 0

  return {
    promotion,
    discount,
    freeShipping,
    shippingCost,
  }
}

/*
  =========================
  GET ORDERS
  =========================
*/

async function getOrders(
  req,
  res,
  next,
) {
  try {
    const userId =
      req.user.id

    const [orders] =
      await pool.query(
        `
        SELECT
          id,
          order_number,
          status,
          subtotal,
          shipping_cost,
          discount,
          total,
          payment_method,
          payment_status,
          shipping_address,
          notes,
          created_at,
          updated_at
        FROM orders
        WHERE user_id = ?
        ORDER BY created_at DESC, id DESC
        `,
        [userId],
      )

    res.json({
      orders,
    })
  } catch (error) {
    next(error)
  }
}

/*
  =========================
  GET ORDER BY ID
  =========================
*/

async function getOrderById(
  req,
  res,
  next,
) {
  try {
    const userId =
      req.user.id

    const orderId =
      Number(
        req.params.id,
      )

    if (
      !Number.isInteger(
        orderId,
      ) ||
      orderId <= 0
    ) {
      res.status(400).json({
        message:
          'Identifiant de commande invalide.',
      })
      return
    }

    const [rows] =
      await pool.query(
        `
        SELECT
          id,
          order_number,
          status,
          subtotal,
          shipping_cost,
          discount,
          total,
          payment_method,
          payment_status,
          shipping_address,
          notes,
          created_at,
          updated_at
        FROM orders
        WHERE id = ?
          AND user_id = ?
        LIMIT 1
        `,
        [
          orderId,
          userId,
        ],
      )

    if (
      rows.length === 0
    ) {
      res.status(404).json({
        message:
          'Commande introuvable.',
      })
      return
    }

    const items =
      await getOrderItems(
        pool,
        orderId,
      )

    res.json({
      order: {
        ...rows[0],
        items,
      },
    })
  } catch (error) {
    next(error)
  }
}

/*
  =========================
  CREATE ORDER
  =========================
*/

async function createOrder(
  req,
  res,
  next,
) {
  const connection =
    await pool.getConnection()

  let transactionStarted =
    false

  try {
    const userId =
      req.user.id

    const {
      shippingAddress,
      deliveryMethod = 'standard',
      paymentMethod = 'cash_on_delivery',
      notes = null,
      promotionCode = null,
    } = req.body

    /*
      =========================
      ADDRESS VALIDATION
      =========================
    */

    if (
      !shippingAddress ||
      typeof shippingAddress !==
        'object'
    ) {
      res.status(400).json({
        message:
          'Adresse de livraison requise.',
      })
      return
    }

    const requiredAddressFields =
      [
        'full_name',
        'address_line1',
        'city',
        'country',
        'phone',
      ]

    const missingField =
      requiredAddressFields.find(
        (field) =>
          !String(
            shippingAddress[
              field
            ] || '',
          ).trim(),
      )

    if (missingField) {
      res.status(400).json({
        message:
          'Veuillez compléter toutes les informations de livraison.',
      })
      return
    }

    /*
      =========================
      DELIVERY VALIDATION
      =========================
    */

    if (
      ![
        'standard',
        'express',
      ].includes(
        deliveryMethod,
      )
    ) {
      res.status(400).json({
        message:
          'Mode de livraison invalide.',
      })
      return
    }

    /*
      Pour le moment le checkout réel
      est disponible uniquement avec
      paiement à la livraison.
    */
    if (
      paymentMethod !==
      'cash_on_delivery'
    ) {
      res.status(400).json({
        message:
          'Mode de paiement indisponible pour le moment.',
      })
      return
    }

    /*
      =========================
      START TRANSACTION
      =========================
    */

    await connection.beginTransaction()

    transactionStarted = true

    /*
      =========================
      GET CART
      =========================
    */

    const [cartRows] =
      await connection.query(
        `
        SELECT id
        FROM carts
        WHERE user_id = ?
        LIMIT 1
        FOR UPDATE
        `,
        [userId],
      )

    if (
      cartRows.length === 0
    ) {
      await connection.rollback()
      transactionStarted =
        false

      res.status(400).json({
        message:
          'Votre panier est vide.',
      })
      return
    }

    const cartId =
      cartRows[0].id

    /*
      =========================
      GET CART ITEMS
      =========================
    */

    const [cartItems] =
      await connection.query(
        `
        SELECT
          ci.id,
          ci.product_id,
          ci.variant_id,
          ci.quantity,

          p.name AS product_name,
          p.sku AS product_sku,
          p.price AS product_price,
          p.status AS product_status,
          p.stock AS product_stock,

          pv.size,
          pv.color,
          pv.stock AS variant_stock,
          pv.additional_price

        FROM cart_items ci

        INNER JOIN products p
          ON p.id = ci.product_id

        LEFT JOIN product_variants pv
          ON pv.id = ci.variant_id

        WHERE ci.cart_id = ?

        FOR UPDATE
        `,
        [cartId],
      )

    if (
      cartItems.length === 0
    ) {
      await connection.rollback()
      transactionStarted =
        false

      res.status(400).json({
        message:
          'Votre panier est vide.',
      })
      return
    }

    /*
      =========================
      RECALCULATE SUBTOTAL
      =========================
    */

    let subtotal = 0

    for (
      const item of cartItems
    ) {
      if (
        item.product_status !==
        'active'
      ) {
        await connection.rollback()
        transactionStarted =
          false

        res.status(400).json({
          message: `${item.product_name} n'est plus disponible.`,
        })
        return
      }

      if (
        item.variant_id !==
          null &&
        item.variant_stock ===
          null
      ) {
        await connection.rollback()
        transactionStarted =
          false

        res.status(400).json({
          message: `La variante de ${item.product_name} n’est plus disponible.`,
        })
        return
      }

      const availableStock =
        item.variant_id !== null
          ? Number(
              item.variant_stock ||
                0,
            )
          : Number(
              item.product_stock ||
                0,
            )

      if (
        Number(
          item.quantity,
        ) >
        availableStock
      ) {
        await connection.rollback()
        transactionStarted =
          false

        res.status(400).json({
          message: `Stock insuffisant pour ${item.product_name}.`,
        })
        return
      }

      const unitPrice =
        Number(
          item.product_price ||
            0,
        ) +
        Number(
          item.additional_price ||
            0,
        )

      subtotal +=
        unitPrice *
        Number(
          item.quantity,
        )
    }

    subtotal =
      Math.round(
        subtotal * 100,
      ) / 100

    /*
      =========================
      PROMOTION
      =========================
    */

    const promotionResult =
      await calculatePromotion({
        connection,
        code: promotionCode,
        subtotal,
        cartItems,
        deliveryMethod,
      })

    const discount =
      promotionResult.discount

    const shippingCost =
      promotionResult.shippingCost

    const promotion =
      promotionResult.promotion

    /*
      Le total est calculé exclusivement
      côté serveur.
    */
    const total =
      Math.max(
        0,
        Math.round(
          (
            subtotal +
            shippingCost -
            discount
          ) * 100,
        ) / 100,
      )

    /*
      =========================
      CREATE ORDER
      =========================
    */

    const orderNumber =
      generateOrderNumber()

    const [orderResult] =
      await connection.query(
        `
        INSERT INTO orders (
          user_id,
          order_number,
          status,
          subtotal,
          shipping_cost,
          discount,
          total,
          payment_method,
          payment_status,
          shipping_address,
          notes
        )
        VALUES (
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?
        )
        `,
        [
          userId,
          orderNumber,
          'pending',
          subtotal,
          shippingCost,
          discount,
          total,
          paymentMethod,
          'pending',
          JSON.stringify(
            shippingAddress,
          ),
          notes,
        ],
      )

    const orderId =
      orderResult.insertId

    /*
      =========================
      ORDER ITEMS + STOCK
      =========================
    */

    for (
      const item of cartItems
    ) {
      const unitPrice =
        Number(
          item.product_price ||
            0,
        ) +
        Number(
          item.additional_price ||
            0,
        )

      const totalPrice =
        Math.round(
          unitPrice *
            Number(
              item.quantity,
            ) *
            100,
        ) / 100

      await connection.query(
        `
        INSERT INTO order_items (
          order_id,
          product_id,
          variant_id,
          product_name,
          product_sku,
          size,
          color,
          quantity,
          unit_price,
          total_price
        )
        VALUES (
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?
        )
        `,
        [
          orderId,
          item.product_id,
          item.variant_id,
          item.product_name,
          item.product_sku,
          item.size,
          item.color,
          item.quantity,
          unitPrice,
          totalPrice,
        ],
      )

      if (
        item.variant_id !==
        null
      ) {
        await connection.query(
          `
          UPDATE product_variants
          SET stock = stock - ?
          WHERE id = ?
          `,
          [
            item.quantity,
            item.variant_id,
          ],
        )
      } else {
        await connection.query(
          `
          UPDATE products
          SET stock = stock - ?
          WHERE id = ?
          `,
          [
            item.quantity,
            item.product_id,
          ],
        )
      }
    }

    /*
      =========================
      PROMOTION USAGE
      =========================

      used_count n'augmente qu'après
      création de la commande et dans
      la même transaction.
    */

    if (promotion) {
      const [promotionUpdate] =
        await connection.query(
          `
          UPDATE promotions
          SET used_count =
            used_count + 1
          WHERE id = ?
            AND (
              max_uses IS NULL
              OR used_count < max_uses
            )
          `,
          [
            promotion.id,
          ],
        )

      if (
        promotionUpdate.affectedRows !==
        1
      ) {
        throw Object.assign(
          new Error(
            'La promotion n’est plus disponible.',
          ),
          {
            statusCode: 400,
          },
        )
      }
    }

    /*
      =========================
      CLEAR CART
      =========================
    */

    await connection.query(
      `
      DELETE FROM cart_items
      WHERE cart_id = ?
      `,
      [cartId],
    )

    /*
      =========================
      COMMIT
      =========================
    */

    await connection.commit()

    transactionStarted =
      false

    /*
      =========================
      RETURN CREATED ORDER
      =========================
    */

    const [orderRows] =
      await pool.query(
        `
        SELECT
          id,
          order_number,
          status,
          subtotal,
          shipping_cost,
          discount,
          total,
          payment_method,
          payment_status,
          shipping_address,
          notes,
          created_at,
          updated_at
        FROM orders
        WHERE id = ?
          AND user_id = ?
        LIMIT 1
        `,
        [
          orderId,
          userId,
        ],
      )

    const items =
      await getOrderItems(
        pool,
        orderId,
      )

    res.status(201).json({
      message:
        'Commande créée avec succès.',

      order: {
        ...orderRows[0],
        items,
      },

      promotion: promotion
        ? {
            id: promotion.id,
            code:
              promotion.code,
            discount,
            freeShipping:
              promotionResult.freeShipping,
          }
        : null,
    })
  } catch (error) {
    if (
      transactionStarted
    ) {
      try {
        await connection.rollback()
      } catch {
        // Transaction déjà terminée.
      }
    }

    next(error)
  } finally {
    connection.release()
  }
}

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
}