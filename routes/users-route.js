const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controller')

const router = express.Router();
const fileUpload = require('../middleware/file-upload');

router.get('/', usersController.getUsers);

router.get('/:uid', usersController.getUserById)

router.get('/usertype/:uid', usersController.getUsersByUserType)

router.post(
  '/signup',
  fileUpload.array('files'),
  [
    check('email')
      .normalizeEmail()
      .isEmail(),
    check('password')
      .isLength({ min: 6 })
  ],
  usersController.signup
);

router.post('/login', usersController.login);

router.post('/updateUser', usersController.updateUser);

router.delete('/delete/:uid', usersController.deleteUser);

module.exports = router;