const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const CartItem = mongoose.model('Cart', new mongoose.Schema({
  userId: String,
  items:[{
    productId: String,
    quantity: Number
  }]
}));

router.post('/cart/add', async (req, res) => {
  try{
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId ){
      return res.status(400).send('User ID and Product ID are required');
    }
    let cart = await CartItem.findOne({ userId ,status: 'active' });
    if (!cart) {
      cart = new CartItem({ userId, items: [] ,status: 'active' });
    }
    const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
    if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += parseInt(quantity);
  }else{
    cart.items.push({ productId, quantity: parseInt(quantity) });
    }
    cart.updateAt = new Date();
    await cart.save();
  }catch{
    res.status(500).send('Internal Server Error');
  }
});
router.get('/cart', async (req, res) => {
  try {
    const Carts = await CartItem.find({});
    res.status(200).json({
        success: true,
        count: Carts.length,
        data: Carts
    })
  } catch {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
});

router.delete('/cart/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
        return res.status(400).send('User ID is required');
        }
        const cart = await CartItem.findOneAndDelete({ userId, status: 'active' });
        if (!cart) {
        return res.status(404).send('Cart not found');
        }
        res.status(200).json({
        success: true,
        message: 'Cart deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: error.message
        });
    }
});

module.exports = router;