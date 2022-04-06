const express = require('express');
const path = require('path');
const ejs = require('ejs');
const { pool } = require("./dbConfig");
const router = express.Router;
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const bcrypt = require("bcrypt");
// const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config({ path: "./config.env" });
// const rawgapi = new (process.env.YOUR_API_KEY);

const axios = require("axios").default;
const { json } = require('express/lib/response');
const rawgRoutes = require('./routes/api/rawgRoutes');

// Create express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// Initialize ejs Middleware
app.set('view engine', 'ejs');
// app.use(express.urlencoded({ extended: false })); 
app.use('/public', express.static(__dirname + '/public/'));

// routes

// router to use api
app.use(rawgRoutes);

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

client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});

// Setup server ports
const PORT = process.env.PORT || 3000;

app.use(
  session({
      secret: "secret",

      resave: false,

      saveUninitialized: false
  })
);

app.use(flash());

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

app.post("/users/register", async (req, res) => {
  let { email, password, password2 } = req.body;

  console.log({
      email,
      password,
      password2
  });

  let errors = [];

  if (!email || !password || !password2) {
      errors.push({ message: "Please enter all fields" });
  }

  if (password.length < 6) {
      errors.push({ message: "Password should be at least 6 characters" });
  }
  if (password != password2) {
      errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > 0) {
      res.render("register", { errors });
  } else {
      let hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword);

      pool.query(
          `SELECT * FROM users
          WHERE email = $1`, [email], (err, results) => {
          if (err) {
              throw err;
          };
          console.log(results.rows);

          // if (results.rows.length > 0) {
          //     errors.push({ message: "Email already registered" });
          //     res.render("register", { errors });
          // } else {
          //     pool.query(
          //         `INSERT INTO users (email, password)
          //             VALUES ($1, $2)
          //             RETURNING id, password`,
          //         [email, hashedPassword],
          //         (err, results) => {
          //             if (err) {
          //                 throw err;
          //             }
          //             console.log(results.rows);
                      // req.flash('success_msg', "You are now registered. Pleae log in");
                      // res.redirect("/users/login");
                  // }
              // );
          // }
      }
      );
  }
});

// app.post("/users/login",
//     passport.authenticate('local', {
//         successRedirect: "/users/dashboard",
//         failureRedirect: "/users/login",
//         failureFlash: true
//     })
// );

// function checkAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//       return res.redirect("/users/dashboard");
//   }
//   return next();
// }
// function checkNotAuthenticated(req, res, next){
//   if (req.isAuthenticated()){
//       return next();
//   }
//   res.redirect("/users/login");
// }

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));