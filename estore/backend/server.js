// server.js
require('dotenv').config({ path: './.env' }); // Explicitly load .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const productRoutes = require('./routes/productRoutes.js');
const searchHistoryRoutes = require('./Routes/searchRoutes.js');
const authRoutes = require('./Routes/authRoutes.js');
const wishlistRoutes = require('./Routes/wishlistRoute.js');
const authMiddleware = require('./Routes/authRoutes.js');
const cart  = require('./Routes/cartRoutes.js');

// Use search history routes

const app = express();
app.use(cors());

// Middleware
app.use(express.json());
const MONGODB_URI="mongodb+srv://abdullah:1234@cluster0.aviwr.mongodb.net/Libas?retryWrites=true&w=majority";
// MongoDB connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// API routes
app.use('/api/products', productRoutes);
app.use('/api/search', searchHistoryRoutes);
app.use('/api/auth', authRoutes);
app.use ('/api/wishlist', wishlistRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
