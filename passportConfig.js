const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const dotenv = require('dotenv');
dotenv.config({ path: "./config.env" });
const { Client } = require('pg');
const res = require('express/lib/response');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();

function initialize(passport) {
    const authenticateUser = (email, password, done) => {
        client.query(
            `SELECT * FROM users WHERE user_email = $1`,
            [email],
            (err, results) => {
                if (err) {
                    throw err;
                }

                console.log(results.rows);


                if (results.rows.length > 0) {
                    const user = results.rows[0];

                    bcrypt.compare(password, user.user_password, (err, isMatch) => {
                        if (err) {
                            throw err;
                        }

                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: "Password Incorrect" });
                        }
                    });
                } else {
                    return done(null, false, { message: "Email is not registered" });
                }
            }
        );
    };

    passport.use(
        new LocalStrategy({
            usernameField: "email",
            passwordField: "password"
        },
        
        authenticateUser
        )
    );
    passport.serializeUser((user, done) => done(null, user.user_id));
    passport.deserializeUser((id, done) => {
        client.query(`SELECT * FROM users WHERE user_id = $1`, [id], (err, results) => {
            if (err) {
                throw err;
            }
            return done(null, results.rows[0]);
        });
    });
}

module.exports = initialize;