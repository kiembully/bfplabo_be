const express = require('express');
const { check } = require('express-validator');

const officersController = require('../controllers/officers-controller');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/', officersController.getOfficers);

router.get('/:oid', officersController.getOfficerById);

router.post(
  '/register',
  // fileUpload.array('files'),
  officersController.createOfficer
);

router.patch(
  '/:oid',
  // fileUpload.array('files'),
  officersController.updateOfficer
);

router.delete('/:oid', officersController.deleteOfficer)

module.exports = router;