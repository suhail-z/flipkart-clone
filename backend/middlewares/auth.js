const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const router = express.Router();

const User = mongoose.model('dev-users', new mongoose.Schema({Username: String, password: String}));

router.post('/signup', async (req, res) => {
 try{
    const { Username, password } = req.body;
    const existingUser = await User.findOne({ Username });
    if (existingUser) {
      return res.status(409).send('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ Username, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ id: user._id },'devsecret', { expiresIn: '1h' });
    res.status(201).json({ token });
 }catch(error){
   console.error(error);
   res.status(500).send('Internal Server Error');
 }
  
});

router.post('/login', async (req, res) => {
  try {
    const { Username, password } = req.body;
    const user = await User.findOne({ Username });
    if (!user) {
      return res.status(401).send("user doesn't exist");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Invalid credentials');
    }
    const token = jwt.sign({ id: user._id }, 'devsecret', { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).send('Access denied');
  }
  jwt.verify(token, 'devsecret', (err, user) => {
    if (err) {
      return res.status(403).send('Invalid token');
    }
    req.user = user;
    next();
  });
}

module.exports = { router, authenticateToken };