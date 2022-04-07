const express = require('express');
const path = require('path');
const ejs = require('ejs');
const router = express.Router;
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
app.use('/public', express.static(__dirname + '/public/'));

// routes

// router to use api
app.use(rawgRoutes);

// connect to database
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

// let options = {
//   method: 'GET',
//   url: 'https://api.rawg.io/api/games?key=' + process.env.YOUR_API_KEY
// };
// axios.request(options).then(function (response) {
//   let gameData = response.data;
  // console.log(gameData.next);
  // // Populate Games
  // let gameCreate = 'INSERT INTO GAMES(GAMES_ID,GAMES_TITLE,GAMES_SCORE,GAMES_AGE_RATING) VALUES($1,$2,$3,$4)';
  // for (let i = 0; i < 1; i++) {
    // console.log(gameData.results[0].id);
    // let gameInfo = [0];

    // if (gameData.results[i].esrb_rating == null) {
    //   gameInfo = [gameData.results[i].id, gameData.results[i].name, gameData.results[i].metacritic, 'Not Available'];
    // }
    // else {
    //   gameInfo = [gameData.results[i].id, gameData.results[i].name, gameData.results[i].metacritic, gameData.results[i].esrb_rating.name];
    // }
    // client.query(gameCreate, gameInfo, (err, res) => {
    //   // if (err) {
    //   //   console.log(err.stack)
    //   // }
    // });

    // Developer
    // let devCreate = 'INSERT INTO DEVELOPER(DEV_ID,DEV_NAME) VALUES($1,$2)';
    // Game_Developer
    // let gameDevCreate = 'INSERT INTO GAMES_DEVELOPER(GAMES_ID,DEV_ID) VALUES($1,$2)';
    // let moreOptions = {
    //   method: 'GET',
    //   url: 'https://api.rawg.io/api/games/11859?key=' + process.env.YOUR_API_KEY
    // };
    // axios.request(moreOptions).then(function (response) {
    //   let gameDetailData = response.data;
    //   console.log(gameDetailData.platforms);
    //   console.log(gameDetailData.developers);
    // });
    //   let devInfo = [gameDetailData.developers.id, gameDetailData.developers.name];
    //   let gameDev = [gameData.results[0].id, gameDetailData.developers.id];
    //   console.log(devInfo);
    //   console.log(gameDev);
    //   // client.query(devCreate, devInfo, (err, res) => {
    //   //   // if (err) {
    //   //   //   console.log(err.stack)
    //   //   // }
    //   // });

    //   // client.query(gameDevCreate, gameDev, (err, res) => {
    //   //   // if (err) {
    //   //   //   console.log(err.stack)
    //   //   // }
    // });
//   }
// });
// Setup server ports
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));