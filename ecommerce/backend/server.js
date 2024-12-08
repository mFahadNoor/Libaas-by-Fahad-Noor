const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes'); 
const dashboardRoutes = require("./routes/dashboardRoutes");
const salesAnalyticsRoutes = require("./routes/salesAnalyticsRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Correct route registration
app.use('/api/seller', productRoutes); // Products
app.use('/api/seller', orderRoutes); // Orders
app.use('/api/seller', dashboardRoutes);
app.use('/api/seller/analytics', salesAnalyticsRoutes);

const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
