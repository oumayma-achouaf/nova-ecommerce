const express = require('express')

const {
  getOrders,
  getOrderById,
  createOrder,
} = require('../controllers/order.controller')

const {
  generateInvoice,
} = require('../controllers/invoice.controller')

const {
  authenticate,
} = require('../middleware/auth.middleware')

const router = express.Router()

router.use(authenticate)

router.get('/', getOrders)

/*
  مهم:
  /:id/invoice خاصها تكون قبل /:id
*/
router.get(
  '/:id/invoice',
  generateInvoice,
)

router.get(
  '/:id',
  getOrderById,
)

router.post(
  '/',
  createOrder,
)

module.exports = router