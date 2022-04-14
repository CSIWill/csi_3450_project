const express = require("express");
const router = express.Router();
const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config({ path: '../../config.env' });
const reqOptions = { 'mode': 'cors', headers: { 'Access-Control-Allow-Origin': '*' } };
const { json } = require('express/lib/response');
const axios = require("axios").default;
const { Client } = require('pg');
const { string } = require("pg-format");
const res = require("express/lib/response");

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
    url: 'https://api.rawg.io/api/games?key=' + process.env.RAWG_API_KEY + '&page=1'
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

let userQuery = '';
router.post('/search/', async (req, response) => {
  userQuery = await ['%' + req.body.userSearch + '%'];

  let searchNameQuery = 'SELECT * FROM GAMES WHERE GAMES_TITLE ILIKE $1';
  let searchResults = [];
  client.query(searchNameQuery, userQuery, async (err, res2) => {
    if (err) {
      console.log(err.stack)
      searchResults = ['No Results Found', 'No Results Found', 'No Results Found'];
    } else {
      searchResults = res2.rows;
      response.render('./html/results', {
        games: searchResults,
      });
    }
  });
});

let advancedSearchQuery = '';
router.post('/detailSearch/', async (req, response) => {
  userQuery = await ['%' + req.body.userSearch + '%'];
  // await console.log(req);
  // await console.log(req.body);
  // console.log(Array.isArray(req.body.platform)); 
  if (Array.isArray(req.body.platform) == false) {
    req.body.platform = [req.body.platform];
  }
  if (Array.isArray(req.body.genre) == false) {
    req.body.genre = [req.body.genre];
  }
  if (req.body.platform == undefined) {
    req.body.platform = [''];
  }
  if (req.body.genre == undefined) {
    req.body.genre = [''];
  }
  // console.log(Array.isArray(req.body.platform));
  // console.log(req.body.platform);
  // console.log(req.body.genre)
  if (req.body.search_type == 'game_title') {
    advancedSearchQuery = 'SELECT * FROM GAMES WHERE GAMES_TITLE ILIKE $1';
    // searchQuery = searchQuery + 'AND GAME_GENRE LIKE '
    if (req.body.genre.length > 0) {
      // searchQuery = searchQuery + ' AND (GENRE_NAME ILIKE ' + await ["'%" + req.body.genre[0] + "%'"];
      advancedSearchQuery = 'SELECT DISTINCT GAMES_ID FROM GAMES NATURAL JOIN GAMES_GENRE NATURAL JOIN GENRE NATURAL JOIN GAME_PLATFORM NATURAL JOIN PLATFORM WHERE GAMES_TITLE ILIKE $1 AND (GENRE_NAME ILIKE ' + await ["'%" + req.body.genre[0] + "%'"];
      for (let i = 1; i < req.body.genre.length; i++) {
        let nextGenre = await ['"%' + req.body.genre[i] + '%"'];
        advancedSearchQuery = advancedSearchQuery + ' OR GENRE_NAME ILIKE ' + await ["'%" + req.body.genre[i] + "%'"];
      }
      advancedSearchQuery = advancedSearchQuery + ')';
      if (req.body.platform.length > 0) {
        advancedSearchQuery = advancedSearchQuery + ' AND (PLATFORM_NAME ILIKE ' + await ["'%" + req.body.platform[0] + "%'"];
        for (let i = 1; i < req.body.platform.length; i++) {
          let nextGenre = await ['"%' + req.body.platform[i] + '%"'];
          advancedSearchQuery = advancedSearchQuery + ' OR PLATFORM_NAME ILIKE ' + await ["'%" + req.body.platform[i] + "%'"];
        }
        advancedSearchQuery = advancedSearchQuery + ')';
      }
    }
    if (req.body.genre.length == 0){
      if (req.body.platform.length > 0) {
        advancedSearchQuery = 'SELECT GAMES_ID FROM GAMES NATURAL JOIN GAME_PLATFORM NATURAL JOIN PLATFORM WHERE GAMES_TITLE ILIKE $1 AND (PLATFORM_NAME ILIKE ' + await ["'%" + req.body.platform[0] + "%'"];
        for (let i = 1; i < req.body.platform.length; i++) {
          let nextGenre = await ['"%' + req.body.platform[i] + '%"'];
          advancedSearchQuery = advancedSearchQuery + ' OR PLATFORM_NAME ILIKE ' + await ["'%" + req.body.platform[i] + "%'"];
        }
        advancedSearchQuery = advancedSearchQuery + ')';
      }
    }
  }
  if (req.body.search_type == 'developer') {
    advancedSearchQuery = 'SELECT * FROM GAMES NATURAL JOIN GAMES_DEVELOPER NATURAL JOIN DEVELOPER WHERE DEV_NAME ILIKE $1';
    if (req.body.genre.length > 0) {
    advancedSearchQuery = 'SELECT DISTINCT GAMES_ID FROM GAMES NATURAL JOIN GAMES_DEVELOPER NATURAL JOIN DEVELOPER NATURAL JOIN GAME_PLATFORM NATURAL JOIN PLATFORM NATURAL JOIN GAMES_GENRE NATURAL JOIN GENRE WHERE DEV_NAME ILIKE $1 AND (GENRE_NAME ILIKE ' + await ["'%" + req.body.genre[0] + "%'"];
      for (let i = 1; i < req.body.genre.length; i++) {
        let nextGenre = await ['"%' + req.body.genre[i] + '%"'];
        advancedSearchQuery = advancedSearchQuery + ' OR GENRE_NAME ILIKE ' + await ["'%" + req.body.genre[i] + "%'"];
      }
      advancedSearchQuery = advancedSearchQuery + ')';
      if (req.body.platform.length > 0) {
        advancedSearchQuery = advancedSearchQuery + ' AND (PLATFORM_NAME ILIKE ' + await ["'%" + req.body.platform[0] + "%'"];
        for (let i = 1; i < req.body.platform.length; i++) {
          let nextGenre = await ['"%' + req.body.platform[i] + '%"'];
          advancedSearchQuery = advancedSearchQuery + ' OR PLATFORM_NAME ILIKE ' + await ["'%" + req.body.platform[i] + "%'"];
        }
        advancedSearchQuery = advancedSearchQuery + ')';
      }
    }
    console.log(advancedSearchQuery);
  }
  let searchResults = [];
  advancedSearchQuery = 'SELECT * FROM GAMES WHERE GAMES_ID IN (' + advancedSearchQuery + ')';
  console.log(advancedSearchQuery);
  client.query(advancedSearchQuery, userQuery, async (err, res) => {
    if (err) {
      console.log(err.stack)
      searchResults = ['No Results Found', 'No Results Found', 'No Results Found'];
    } else {
      searchResults = res.rows;
      // console.log(searchResults);
      response.render('./html/advancedResults', {
        games: searchResults,
      });
    }
  })
});


router.get('/game_info/:id', (req, response) => {
  // console.log(req.params.id);
  let query1 = 'DROP VIEW IF EXISTS GAME_DETAILS';
  let queryDetails = 'CREATE VIEW GAME_DETAILS AS SELECT * FROM GAMES NATURAL JOIN GAME_PLATFORM NATURAL JOIN GAMES_DEVELOPER NATURAL JOIN GAME_PLATFORM_AT_STORE NATURAL JOIN PLATFORM NATURAL JOIN DEVELOPER NATURAL JOIN STORE WHERE GAMES_ID =' + req.params.id;
  let query3 = 'SELECT * FROM GAME_DETAILS';
  let query4 = 'DROP VIEW IF EXISTS GAME_DETAILS_GENRE';
  let queryGenre = 'CREATE VIEW GAME_DETAILS_GENRE AS SELECT * FROM GAMES NATURAL JOIN GAMES_GENRE NATURAL JOIN GENRE WHERE GAMES_ID = ' + req.params.id;
  let query6 = 'SELECT * FROM GAME_DETAILS_GENRE';
  client.query(query1, async (err, res1) => {
    client.query(queryDetails, async (err, res2) => {
      client.query(query3, async (err, res3) => {
        let format_date = [];
        let game_date = [];
        for(i=0; i < res3.rows.length; i++) {
          format_date[i] = new Date(res3.rows[i].game_release_date);
          let year = format_date[i].getFullYear();
          let month = format_date[i].getMonth()+1;
          let day = format_date[i].getDate();
          if (day < 10) {
            day = '0' + day;
          }
          if (month < 10) {
            month = '0' + month;
          }
          game_date[i] = year + '-' + month + '-'+ day;
        }
          
        client.query(query4, async (err, res4) => {
          client.query(queryGenre, async (err, res5) => {
            client.query(query6, async (err, res6) => {
              response.render('./html/game_info', {
                games: res3.rows,
                games_genre: res6.rows,
                games_date: game_date
              });
            });
          });
        });
      });
    });
  });
});

router.post('/sort/', async (req, response) => {
  // console.log(req.body);
  // console.log(req.body.sort_type);
  // console.log(req.body.sort_order);
  // console.log(userQuery);
  let searchNameQuery = 'SELECT * FROM GAMES WHERE GAMES_TITLE ILIKE $1';
  if (req.body.sort_type == 'alphabetical' && req.body.sort_order == 'ascending') {
    searchNameQueryOptions = searchNameQuery + ' ORDER BY GAMES_TITLE ASC';
  }
  if (req.body.sort_type == 'alphabetical' && req.body.sort_order == 'descending') {
    searchNameQueryOptions = searchNameQuery + ' ORDER BY GAMES_TITLE DESC';
  }
  if (req.body.sort_type == 'metacritic_score' && req.body.sort_order == 'ascending') {
    searchNameQueryOptions = searchNameQuery + ' AND GAMES_SCORE IS NOT NULL ORDER BY GAMES_SCORE ASC';
  }
  if (req.body.sort_type == 'metacritic_score' && req.body.sort_order == 'descending') {
    searchNameQueryOptions = searchNameQuery + ' AND GAMES_SCORE IS NOT NULL ORDER BY GAMES_SCORE DESC';
  }
  // if (req.body.sort_type == 'release_date' && req.body.sort_order == 'ascending') {
  //   searchNameQueryOptions = 'SELECT * FROM GAMES WHERE GAMES_ID IN (SELECT DISTINCT GAMES_ID FROM (SELECT * FROM GAMES NATURAL JOIN GAME_PLATFORM NATURAL JOIN GAMES_DEVELOPER WHERE GAMES_TITLE ILIKE $1 ORDER BY GAME_RELEASE_DATE ASC)';
  // }
  // if (req.body.sort_type == 'release_date' && req.body.sort_order == 'descending') {
  //   searchNameQueryOptions = 'SELECT * FROM GAMES WHERE GAMES_ID IN (SELECT * FROM GAMES NATURAL JOIN GAME_PLATFORM NATURAL JOIN GAMES_DEVELOPER WHERE GAMES_TITLE ILIKE $1 ORDER BY GAME_RELEASE_DATE DESC)';
  // }

  let searchResults = [];
  // console.log(searchNameQueryOptions);
  client.query(searchNameQueryOptions, userQuery, async (err, res) => {
    if (err) {
      console.log(err.stack)
      searchResults = ['No Results Found', 'No Results Found', 'No Results Found'];
    } else {
      // console.log(res.rows);
      searchResults = res.rows;
      response.render('./html/results', {
        games: searchResults,
      });
    }
  });
});
router.post('/advancedSort/', async (req, response) => {
  // console.log(req.body);
  // console.log(req.body.sort_type);
  // console.log(req.body.sort_order);
  // console.log(userQuery);
  if (req.body.sort_type == 'alphabetical' && req.body.sort_order == 'ascending') {
    searchNameQueryOptions = advancedSearchQuery + ' ORDER BY GAMES_TITLE ASC';
  }
  if (req.body.sort_type == 'alphabetical' && req.body.sort_order == 'descending') {
    searchNameQueryOptions = advancedSearchQuery + ' ORDER BY GAMES_TITLE DESC';
  }
  if (req.body.sort_type == 'metacritic_score' && req.body.sort_order == 'ascending') {
    searchNameQueryOptions = advancedSearchQuery + ' AND GAMES_SCORE IS NOT NULL ORDER BY GAMES_SCORE ASC';
  }
  if (req.body.sort_type == 'metacritic_score' && req.body.sort_order == 'descending') {
    searchNameQueryOptions = advancedSearchQuery + ' AND GAMES_SCORE IS NOT NULL ORDER BY GAMES_SCORE DESC';
  }
  let searchResults = [];
  // console.log(searchNameQueryOptions);
  client.query(searchNameQueryOptions, userQuery, async (err, res) => {
    if (err) {
      console.log(err.stack)
      searchResults = ['No Results Found', 'No Results Found', 'No Results Found'];
    } else {
      // console.log(res.rows);
      searchResults = res.rows;
      response.render('./html/results', {
        games: searchResults,
      });
    }
  });
});

let globalUserID = 0;
let globalWishlistQuery = 'SELECT * FROM WISHLIST NATURAL JOIN GAMES NATURAL JOIN PLATFORM WHERE USER_ID = $1';
router.post('/addWishlist/', async (req, response) => {
  // console.log(req.body);
  let findUserID = 'SELECT USER_ID FROM USERS WHERE USER_EMAIL =' + await ["'" + req.body.user + "'"];
  client.query(findUserID, async (err, res) => {
    if (err) {
      console.log(err.stack);
    } else {
      // console.log(res.rows[0].user_id);
      globalUserID = res.rows[0].user_id;
      let addWishlistQuery = 'INSERT INTO WISHLIST(USER_ID, GAMES_ID, PLATFORM_ID) VALUES($1,$2,$3)';
      let addWishlistEntry = [res.rows[0].user_id, req.body.game_id_num, req.body.platform_request];
      client.query(addWishlistQuery, addWishlistEntry, async (err, res1) => {
        let wishlistQuery = 'SELECT * FROM WISHLIST NATURAL JOIN GAMES NATURAL JOIN PLATFORM WHERE USER_ID = ' + res.rows[0].user_id;
        client.query(wishlistQuery, (err, res2) => {
          // console.log(res2.rows);
          response.render('./html/wishlist', {
            games: res2.rows,
          });
        });
      });
    }
  });
});
router.get('/requestWishlist', async (req, res) => {
  res.render('./html/requestWishlist');
});
router.post('/viewWishlist/', async (req, response) => {
  let findUserID = 'SELECT USER_ID FROM USERS WHERE USER_EMAIL =' + await ["'" + req.body.user + "'"];
  client.query(findUserID, async (err, res) => {
    if (err) {
      console.log(err.stack);
    } else {
      globalUserID = res.rows[0].user_id;
      let wishlistQuery = 'SELECT * FROM WISHLIST NATURAL JOIN GAMES NATURAL JOIN PLATFORM WHERE USER_ID = ' + res.rows[0].user_id;
      client.query(wishlistQuery, (err, res1) => {
        response.render('./html/wishlist', {
          games: res1.rows,
        });
      });
    }
  });
});
router.post('/delWishlistItem/', async (req, response) => {
  let delUser = await ["'" + req.body.user_id_num + "'"];
  globalUserID = req.body.user_id_num;
  let delEntry = [req.body.user_id_num , req.body.games_id_num, req.body.platform_id_num];
  // console.log(delEntry);
  let delQuery = 'DELETE FROM WISHLIST WHERE USER_ID = $1 AND GAMES_ID = $2 AND PLATFORM_ID = $3';
  client.query(delQuery,delEntry, (err,res) => {
    let wishlistQuery = 'SELECT * FROM WISHLIST NATURAL JOIN GAMES NATURAL JOIN PLATFORM WHERE USER_ID = ' + delUser;
      client.query(wishlistQuery, (err, res1) => {
        // console.log(res1.rows);
        response.render('./html/wishlist', {
          games: res1.rows,
        });
      });
  });
});
router.post('/wishlistSort/', async (req, response) => {
  let wishlistQuery = '';
  if (req.body.sort_type == 'alphabetical' && req.body.sort_order == 'ascending') {
    wishlistQuery = globalWishlistQuery + ' ORDER BY GAMES_TITLE ASC';
  }
  if (req.body.sort_type == 'alphabetical' && req.body.sort_order == 'descending') {
    wishlistQuery = globalWishlistQuery + ' ORDER BY GAMES_TITLE DESC';
  }
  if (req.body.sort_type == 'metacritic_score' && req.body.sort_order == 'ascending') {
    wishlistQuery = globalWishlistQuery + ' AND GAMES_SCORE IS NOT NULL ORDER BY GAMES_SCORE ASC';
  }
  if (req.body.sort_type == 'metacritic_score' && req.body.sort_order == 'descending') {
    wishlistQuery = globalWishlistQuery + ' AND GAMES_SCORE IS NOT NULL ORDER BY GAMES_SCORE DESC';
  }
  client.query(wishlistQuery, [globalUserID], async (err, res) => {
    if (err) {
      console.log(err.stack);
    } else {
      response.render('./html/wishlist', {
        games: res.rows,
      });
    }
  });
});

module.exports = router;
