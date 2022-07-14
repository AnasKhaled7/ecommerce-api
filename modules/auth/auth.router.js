const registrationController = require('./controller/registration');
const validators = require('./auth.validation');
const validation = require('../../middleware/validation');
const router = require('express').Router();

// signup
router.post('/signup', validation(validators.signup), registrationController.signup);

// confirm email
router.get("/confirmEmail/:token", validation(validators.confirmEmail), registrationController.confirmEmail);

//refresh  email 
router.get('/refreshEmail/:id', registrationController.refreshEmail)

// login
router.post('/login', validation(validators.login), registrationController.login);

// send code
router.post('/sendCode', validation(validators.sendCode), registrationController.sendCode);
// forget password
router.post('/forgetPassword', validation(validators.forgetPassword), registrationController.forgetPassword);


module.exports = router;