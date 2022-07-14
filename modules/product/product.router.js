const { auth } = require('../../middleware/auth');
const { myMulter, fileValdation, HME } = require('../../services/multer');
const endpoint = require('./product.endpoint');
const productController = require('./controller/product');
const commentController = require('./controller/comment');
const validation = require('../../middleware/validation');
const validators = require('./product.validation');

const router = require('express').Router();

// add product
router.post('/',
    auth(endpoint.addProduct),
    myMulter('/product', fileValdation.image).array('image', 6),
    HME,
    validation(validators.addProduct),
    productController.addProduct);

// to get all products with details
router.get('/', productController.getAllProducts);

// add comment on product by passing the id of the product in the params 
router.patch("/:id/comment",
    auth(endpoint.addProduct),
    validation(validators.createComment),
    commentController.createComment);

// like or unlike product by passing the id of the product in the params
router.patch("/:id/like",
    auth(endpoint.addProduct),
    validation(validators.likeProduct),
    productController.likeAndUnlileProduct);

router.patch("/:id/comment/:commentID/reply",
    auth(endpoint.addProduct),
    // validation(validators.replyOnComment),
    commentController.replyOnComment)

module.exports = router;