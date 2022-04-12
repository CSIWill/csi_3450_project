const express = require('express');
const router = express.Router();
const path = require('path');
const ejs = require('ejs');
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const bcrypt = require("bcrypt");
// const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config({ path: "../config.env" });
// Create express app
const app = express();

// Initialize ejs Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

// connect to database
const { Client } = require('pg');
const initializePassport = require("../passportConfig");
const res = require('express/lib/response');
const { Router } = require('express');

initializePassport(passport);

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();

router.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: false
    })
);

router.use(passport.initialize());
router.use(passport.session());

router.use(flash());

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/users/register", checkAuthenticated, (req, res) => {
    res.render("register");
})

router.get("/users/login", checkAuthenticated, (req, res) => {
    res.render("login");
})

router.get("/users/dashboard", checkNotAuthenticated, (req, res) => {
    res.render("dashboard", { user: req.user.user_email });
})

router.get("/users/logout", checkNotAuthenticated, (req, res) => {
    req.logOut();
    req.flash("success_msg", "You have successfully logged out");
    res.redirect("/users/login");
})

router.get("/users/resetpassword", checkNotAuthenticated, (req, res) => {
    res.render("resetpassword");
});

router.get("/users/deleteaccount", checkNotAuthenticated, (req, res) => {
    res.render("deleteaccount");
});



router.post("/users/deleteaccount", async (req, res) => {
    let { email, password } = req.body;

    console.log({
        email,
        password,
    });

    let errors = [];

    if (!email || !password) {
        errors.push({ message: "Please enter all fields" });
    }

    if (errors.length > 0) {
        res.render("deleteaccount", { errors });
    } else {

        client.query(
            `SELECT * FROM users
          WHERE user_email = $1`, [email], (err, results) => {
            if (err) {
                throw err;
            };
            console.log(results.rows);

            client.query(
                `DELETE FROM users
                WHERE user_email = $1`,
                [email],
                (err, results) => {
                    if (err) {
                        throw err;
                    }
                    console.log(results.rows);
                    req.flash('success_msg', "You have deleted your account");
                    res.redirect("/users/register");
                }
            );
        }

        );
    }
});

router.post("/users/resetpassword", async (req, res) => {
    let { email, password, password3, password4 } = req.body;

    console.log({
        email,
        password,
        password3,
        password4
    });

    let errors = [];

    if (!email || !password || !password3 || !password4) {
        errors.push({ message: "Please enter all fields" });
    }

    if (password.length < 6) {
        errors.push({ message: "Password should be at least 6 characters" });
    }
    if (password3 != password4) {
        errors.push({ message: "Passwords do not match" });
    }

    if (errors.length > 0) {
        res.render("resetpassword", { errors });
    } else {
        let hashedPassword = await bcrypt.hash(password3, 10);
        console.log(hashedPassword);

        client.query(
            `SELECT * FROM users
          WHERE user_email = $1`, [email], (err, results) => {
            if (err) {
                throw err;
            };
            console.log(results.rows);

            client.query(
                `UPDATE users
                SET user_password = $2
                WHERE user_email = $1`,
                [email, hashedPassword],
                (err, results) => {
                    if (err) {
                        throw err;
                    }
                    console.log(results.rows);
                    req.flash('success_msg', "You have successfully changed your password");
                    res.redirect("/users/login");
                }
            );
        }

        );
    }
});


router.post("/users/register", async (req, res) => {
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

        client.query(
            `SELECT * FROM users
          WHERE user_email = $1`, [email], (err, results) => {
            if (err) {
                throw err;
            };
            console.log(results.rows);

            if (results.rows.length > 0) {
                errors.push({ message: "Email already registered" });
                res.render("register", { errors });
            } else {
                client.query(
                    `INSERT INTO users (user_email, user_password)
                      VALUES ($1, $2)
                      RETURNING user_id, user_password`,
                    [email, hashedPassword],
                    (err, results) => {
                        if (err) {
                            throw err;
                        }
                        console.log(results.rows);
                        req.flash('success_msg', "You are now registered. Pleae log in");
                        res.redirect("/users/login");
                    }
                );
            }
        }
        );
    }
});

router.post("/users/login",
    passport.authenticate('local', {
        successRedirect: "/",
        failureRedirect: "/users/login",
        failureFlash: true
    })
);

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    return next();
}
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/users/login");
}

module.exports = router;