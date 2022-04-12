const express = require('express');
const path = require('path');
const ejs = require('ejs');
const dotenv = require('dotenv');
dotenv.config({ path: "./config.env" });
const axios = require("axios").default;
const { json } = require('express/lib/response');
const rawgRoutes = require('./routes/api/rawgRoutes');
const gameRoutes = require('./routes/api/gameRoutes');
const loginRoutes = require('./routes/api/loginRoutes');

// Create express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize ejs Middleware
app.set('view engine', 'ejs');
app.use('/public', express.static(__dirname + '/public/'));

// routes

// router to use api
app.use(rawgRoutes);
app.use(gameRoutes);
app.use(loginRoutes);

// connect to database
const { Client } = require('pg');
const res = require('express/lib/response');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

// Setup server ports
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));