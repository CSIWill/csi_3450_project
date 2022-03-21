const express = require("express");
const router = express.Router();
const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config({ path: '../../config.env' });
const reqOptions = { 'mode': 'cors', headers: { 'Access-Control-Allow-Origin': '*' } };
const { json } = require('express/lib/response');
const axios = require("axios").default;

router.get('/', async (req, res) => {
  // var options = {
  //   method: 'GET',
  //   url: 'https://rawg-video-games-database.p.rapidapi.com/games?key=ef6acf58a54345b4b891c442488a8363',
  //   headers: {
  //     'x-rapidapi-host': 'rawg-video-games-database.p.rapidapi.com',
  //     'x-rapidapi-key': '504d4f71c5msh29d9ed342160e83p15191ejsna837f2812c38'
  //   }
  // };

  // axios.request(options).then(function (response) {
  //   console.log(response.data);
  // }).catch(function (error) {
  //   console.error(error);
  // });

  res.render('./html/game_info', {
  });
});

router.get('/login', async (req, res) => {
    res.render('./html/login', {
    });
});
  
router.get('/game_info', async (req, res) => {
    res.render('./html/game_info', {
    });
});

router.get('/game_price', async (req, res) => {
    res.render('./html/game_price', {
    });
});

module.exports = router;