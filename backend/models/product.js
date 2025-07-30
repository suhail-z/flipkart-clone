const mongoose = require('mongoose');
const productsData = require('../dataFiles/products.json'); 

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  discountPercentage: Number,
  rating: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  brand: String,
  category: String,
  thumbnail: String,
  images: [String],
  deleted: { type: Boolean, default: false }
});

const Product = mongoose.model('Product', productSchema);

mongoose.connect('mongodb+srv://suhail-z:itechpass23@cluster0.1cwu0zs.mongodb.net/smedia?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(productsData.products);
      console.log(' Products inserted!');
    } else {
      console.log(' Products already exist. Skipping import.');
    }
  } catch (err) {
    console.error(' Error inserting products:', err);
  }
});
module.exports = { Product };