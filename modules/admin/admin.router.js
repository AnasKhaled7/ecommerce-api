const { auth } = require('../../middleware/auth');
const { endpoint } = require('./admin.endpoint');
const router = require('express').Router();
const adminController = require('./controller/admin')


// get all user except other admins
router.get('/users', auth(endpoint.getAllUsers), adminController.getAllUsers);

// block regular user
router.patch("/user/:id/block", auth(endpoint.getAllUsers), adminController.blockUser)


module.exports = router;