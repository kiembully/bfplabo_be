const express = require('express');
const { check } = require('express-validator');

const emailController = require('../controllers/emails-controller')

const router = express.Router();


router.post('/invoice', emailController.sendInvoice)

module.exports = router;