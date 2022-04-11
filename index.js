const express = require('express');
const path = require('path');
const ejs = require('ejs');
// const session = require("express-session");
// const flash = require("express-flash");
// const passport = require("passport");
// const bcrypt = require("bcrypt");
const dotenv = require('dotenv');
dotenv.config({ path: "./config.env" });
const axios = require("axios").default;
const { json } = require('express/lib/response');
const rawgRoutes = require('./routes/api/rawgRoutes');
const loginRoutes = require('./routes/loginRoutes');

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

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/users/register", (req, res) => {
  res.render("register");
})

app.get("/users/login", (req, res) => {
  res.render("login");
})

app.get("/users/dashboard", (req, res) => {
  res.render("dashboard");
})

app.get("/users/resetpassword", (req, res) => {
  res.render("resetpassword");
})

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));