const router = require('express').Router();
const {
    createCartItem,
    getCartItem,
    updateCartItem,
    deleteCartItem
} = require('../controllers/cardControllers');
const authorize = require('../middlewares/authorize');


router.route('/')
    .get(authorize, getCartItem)
    .post(authorize, createCartItem)
    .put(authorize, updateCartItem);

router.route('/:id')
    .get(authorize, deleteCartItem);

    module.exports = router;