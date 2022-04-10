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

router.get('/game_info', async (req, res) => {
  // console.log(req);
  res.render('./html/game_info');
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

router.get('/game_info/:id', function (req, res) {
  console.log(req.params.id);
  res.render('/game_info', {
    games: req.params.id
  });
});

module.exports = router;
