const express = require("express");
const router = express.Router();
const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config({ path: '../../config.env' });
const reqOptions = { 'mode': 'cors', headers: { 'Access-Control-Allow-Origin': '*' } };
const { json } = require('express/lib/response');

router.get('/', async (req, res) => {
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