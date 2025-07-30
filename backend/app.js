const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {router:authRouter,authenticateToken} = require('./middlewares/auth');
const cartRouter = require('./middlewares/cart');
const { Product } = require('./models/product'); 

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect('mongodb+srv://suhail-z:itechpass23@cluster0.1cwu0zs.mongodb.net/smedia?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
});
app.use('/auth', authRouter);
app.use('/cart', cartRouter);
app.get('/products', async (req,res)=>{
  try{
    const products = await Product.find({});
    res.json(products);
  }catch(err){
    console.error('Error fetching products:', err);
    res.status(500).send('Internal Server Error');
  }
  
})
app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send('Product not found');
    }
    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});