const { result } = require('lodash');
const _ = require('lodash');
const {CardItem, CartItem} = require('../models/cartItem');

module.exports.createCartItem = async (req, res) => {
    let {price, product } = _.pick(req.body, ["price", 'product']);
    const item = await CartItem.findOne({
        user: req.user._id,
        product: product,
    });
    if (item) return res.status(400).send("Item Exists in Cart!!");
    let cartItem = new CartItem({
        price: price,
        product: product,
        user: req.user._id
    });
    await cartItem.save();
    res.status(201).send({
        message: "Added to cart successfully!",
        data: result,
    });
}

module.exports.getCartItem = async (req, res) => {
    const cartItem = await cartItem.findOne({
        user: req.user._id
    })
        .populate('product', 'name')
        .populate('user', 'name')
    res.status(201).send(cartItem);
}

module.exports.updateCartItem = async (req, res) => {
    const {_id, count } = _.pick(req.body, ["count", '_id']);
    userId: req.user._id;
    await CartItem.updateOne({
        _id: _id, 
        user: userId
    },{ count: count });
    res.status(200).send("Item Updated!!");
}

module.exports.deleteCartItem = async (req, res) => {
    const _id = req.params.id;
    userId: req.user._id;
    await CardItem.deleteOne({
        _id: id, 
        user: userId, 
    });
    res.status(201).send("deleted");
}