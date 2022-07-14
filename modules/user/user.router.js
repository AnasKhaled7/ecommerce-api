const router = require('express').Router();
const profileController = require('./controller/profile');
const validation = require('../../middleware/validation');
const validators = require('./user.validation');
const { auth } = require('../../middleware/auth');
const endpoint = require('./user.endpoint');
const { myMulter, fileValdation, HME } = require('../../services/multer');

// to show user data
router.get('/profile', validation(validators.displayProfile), auth(endpoint.displayProfile), profileController.displayProfile);

// to update the profile picture
router.patch('/profile/pic',
    myMulter('user/profile/pic', fileValdation.image).single('image'),
    HME,
    auth(endpoint.displayProfile),
    profileController.profilePic);

// to update the cover pictures
router.patch('/profile/coverPic',
    myMulter('user/profile/coverPic', fileValdation.image).array('image', 6),
    HME,
    auth(endpoint.displayProfile),
    profileController.coverPic);

// to update password
router.patch('/profile/updatePassword', validation(validators.updatePassword), auth(endpoint.displayProfile), profileController.updatePassword)

module.exports = router;