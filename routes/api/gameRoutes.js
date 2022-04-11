const express = require("express");
const router = express.Router();
const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config({ path: '../../config.env' });
const reqOptions = { 'mode': 'cors', headers: { 'Access-Control-Allow-Origin': '*' } };
const { json } = require('express/lib/response');
const axios = require("axios").default;
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

router.get("/", (req, res) => {
  let options = {
    method: 'GET',
    url: 'https://api.rawg.io/api/games?key=' + process.env.YOUR_API_KEY + '&page=1'
  };
  axios.request(options).then(function (response) {
    let gameData = response.data;
    res.render("index.ejs", {
      games: gameData.results,
    });
  }).catch(function (error) {
    console.error(error);
  });
});

router.get('/login', async (req, res) => {
  res.render('./html/login');
});

router.get('/game_price', async (req, res) => {
  res.render('./html/game_price');
});

router.get('/advancedSearch', async (req, res) => {
  res.render('./html/search')
});

router.post('/search/', async (req, response) => {
  let userQuery = await ['%' + req.body.userSearch + '%'];
  let searchNameQuery = 'SELECT * FROM GAMES WHERE GAMES_TITLE ILIKE $1';
  let searchResults = [];
  client.query(searchNameQuery, userQuery, async (err, res) => {
    if (err) {
      console.log(err.stack)
      searchResults = ['No Results Found', 'No Results Found', 'No Results Found'];
    } else {
      searchResults = res.rows;
      response.render('./html/results', {
        games: searchResults,
      });
    }
  })
});

router.post('/detailSearch/', async (req, response) => {
  let userQuery = await ['%' + req.body.userSearch + '%'];
  await console.log(req.body);
  let query1 = 'DROP VIEW IF EXISTS GAME_SEARCH';
  // let searchQuery = 'CREATE VIEW GAME_SEARCH AS SELECT * FROM GAMES NATURAL JOIN GAMES_GENRE NATURAL JOIN GAME_PLATFORM NATURAL JOIN GENRE NATURAL JOIN PLATFORM WHERE GAMES_TITLE ILIKE $1';
  let viewQuery = 'SELECT * FROM GAME_SEARCH';
  let searchQuery = 'SELECT * FROM GAMES NATURAL JOIN GAMES_GENRE NATURAL JOIN GAME_PLATFORM NATURAL JOIN GENRE NATURAL JOIN PLATFORM WHERE GAMES_TITLE ILIKE $1';
  let searchResults = [];
  if (await req.body.action == 'on') {
    searchQuery = searchQuery + `AND GENRE_NAME = 'Action'`;
  };
  if (await req.body.adventure == 'on') {
    searchQuery = searchQuery + `AND GENRE_NAME = 'Adventure'`;
  };
  if (await req.body.platformer == 'on') {
    searchQuery = searchQuery + `AND GENRE_NAME = 'Platformer'`;
  };
  if (await req.body.rpg == 'on') {
    searchQuery = searchQuery + `AND GENRE_NAME = 'RPG'`;
  };
  if (await req.body.shooter == 'on') {
    searchQuery = searchQuery + `AND GENRE_NAME = 'Shooter'`;
  };
  if (await req.body.pc == 'on') {
    searchQuery = searchQuery + `AND PLATFORM_NAME = 'PC'`;
  };
  if (await req.body.xbox_one == 'on') {
    searchQuery = searchQuery + `AND PLATFORM_NAME = 'Xbox One'`;
  };
  if (await req.body.xbox_series == 'on') {
    searchQuery = searchQuery + `AND PLATFORM_NAME = 'Xbox Series S/X'`;
  };
  if (await req.body.ps5 == 'on') {
    searchQuery = searchQuery + `AND PLATFORM_NAME = 'PlayStation 5'`;
  };
  if (await req.body.ps4 == 'on') {
    searchQuery = searchQuery + `AND PLATFORM_NAME = 'PlayStation 4'`;
  };
  if (await req.body.nintendo_switch == 'on') {
    searchQuery = searchQuery + `AND PLATFORM_NAME = 'Nintendo Switch'`;
  };
  client.query(searchQuery, userQuery, async (err, res) => {
    if (err) {
      console.log(err.stack)
      searchResults = ['No Results Found', 'No Results Found', 'No Results Found'];
    } else {
      searchResults = res.rows;
      console.log(searchResults);
      response.render('./html/results', {
        games: searchResults,
      });
    }
  })
});


router.get('/game_info/:id', function (req, response) {
  // console.log(req.params.id);
  let query1 = 'DROP VIEW GAME_DETAILS';
  let queryDetails = 'CREATE VIEW GAME_DETAILS AS SELECT * FROM GAMES NATURAL JOIN GAME_PLATFORM NATURAL JOIN GAMES_DEVELOPER NATURAL JOIN GAME_PLATFORM_AT_STORE NATURAL JOIN PLATFORM NATURAL JOIN DEVELOPER NATURAL JOIN STORE WHERE GAMES_ID =' + req.params.id;
  let query3 = 'SELECT * FROM GAME_DETAILS';
  let query4 = 'DROP VIEW GAME_DETAILS_GENRE';
  let queryGenre = 'CREATE VIEW GAME_DETAILS_GENRE AS SELECT * FROM GAMES NATURAL JOIN GAMES_GENRE NATURAL JOIN GENRE WHERE GAMES_ID = ' + req.params.id;
  let query6 = 'SELECT * FROM GAME_DETAILS_GENRE';
  client.query(query1, async (err, res1) => {
    client.query(queryDetails, async (err, res2) => {
      client.query(query3, async (err, res3) => {
        client.query(query4, async (err, res4) => {
          client.query(queryGenre, async (err, res5) => {
            client.query(query6, async (err, res6) => {
              response.render('./html/game_info', {
                games: res3.rows,
                games_genre: res6.rows
              });
            });
          });
        });
      });
    });
  });
});

module.exports = router;
