const express = require('express');
const { check } = require('express-validator');

const ordersControllers = require('../controllers/orders-controller');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/:oid', ordersControllers.getOrderById);

router.get('/user/:uid', ordersControllers.getOrdersByUserId);

router.get('/', ordersControllers.getAllOrders);

router.get('/writer/:uid', ordersControllers.getOrdersByWriter)

router.post(
  '/',
  fileUpload.array('files'),
  ordersControllers.createOrder
);

router.patch(
  '/:oid',
  fileUpload.array('files'),
  ordersControllers.updateOrder
);

router.patch(
  '/updateWriterFile/:oid',
  fileUpload.array('files'),
  ordersControllers.updateWriterOrderFiles
);

router.patch(
  '/updateClientFile/:oid',
  fileUpload.array('files'),
  ordersControllers.updateClientrOrderFiles
);

router.patch(
  '/updateOrderByAssignedWriter/:oid',
  fileUpload.array('files'),
  ordersControllers.updateOrderByAssignedWriter
)

router.delete('/:oid', ordersControllers.deleteOrder)

module.exports = router;