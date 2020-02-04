const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controllers');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/', usersController.getUsers);

router.post(
  '/signup',
  fileUpload.single('image'),
  [
    check('name')
      .not()
      .isEmpty(),
    check('email')
      .normalizeEmail() // Test@test.com or t.e.s.t@Test.com => test@test.com 
      .isEmail(),
    check('password').isLength({ min: 6 })
  ],
  
  usersController.signup
);

router.post('/login', usersController.login); // we don't need validate here because if user provide wrong password the login fails anyway

module.exports = router;