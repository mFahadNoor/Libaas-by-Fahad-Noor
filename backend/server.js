// server.js
require("dotenv").config({ path: "../.env" }); // Explicitly load .env file
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use('/', () => console.log('Hello there!'));
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
