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

// Stores
for (let page_num = 1; page_num < 2; page_num++) {
  let options = {
    method: 'GET',
    url: 'https://api.rawg.io/api/stores?key=' + process.env.YOUR_API_KEY + '&page=' + page_num
  };
  axios.request(options).then(function (response) {
    let storeData = response.data;
    // console.log(storeData.results);
    for (let i = 0; i < storeData.results.length; i++) {
      let storeCreate = 'INSERT INTO STORE(STORE_ID,STORE_NAME) VALUES($1,$2)';
      let storeInfo = [storeData.results[i].id, storeData.results[i].name];
      client.query(storeCreate, storeInfo, (err, res) => {
        // if (err) {
        //   console.log(err.stack)
        // }
      });
    }
  }).catch(function (error) {
    console.error(error);
  });
}

// Genre
for (let page_num = 1; page_num < 2; page_num++) {
  let options = {
    method: 'GET',
    url: 'https://api.rawg.io/api/genres?key=' + process.env.YOUR_API_KEY + '&page=' + page_num
  };
  axios.request(options).then(function (response) {
    let genreData = response.data;
    // console.log(storeData.results);
    for (let i = 0; i < genreData.results.length; i++) {
      let genreCreate = 'INSERT INTO GENRE(GENRE_ID,GENRE_NAME) VALUES($1,$2)';
      let genreInfo = [genreData.results[i].id, genreData.results[i].name];
      client.query(genreCreate, genreInfo, (err, res) => {
        // if (err) {
        //   console.log(err.stack)
        // }
      });
    }
  }).catch(function (error) {

    console.error(error);
  });
}

// // Developer
// for(let page_num = 1; page_num < 3; page_num++) {
//   let options = {
//     method: 'GET',
//     url: 'https://api.rawg.io/api/developers?key=' + process.env.YOUR_API_KEY + '&page=' + page_num
//   };
//   axios.request(options).then(function (response) {
//     let devData = response.data;
//     // console.log(devData.results);
//     for (let i = 0; i < devData.results.length; i++) {
//       let devCreate = 'INSERT INTO DEVELOPER(DEV_ID,DEV_NAME) VALUES($1,$2)';
//       let devInfo = [devData.results[i].id,devData.results[i].name];
//       client.query(devCreate, devInfo, (err, res) => {
//         // if (err) {
//         //   console.log(err.stack)
//         // }
//       });
//     }
//   }).catch(function (error) {
//     console.error(error);
//   });
// }

// Platform
for (let page_num = 1; page_num < 3; page_num++) {
  let options = {
    method: 'GET',
    url: 'https://api.rawg.io/api/platforms?key=' + process.env.YOUR_API_KEY + '&page=' + page_num
  };
  axios.request(options).then(function (response) {
    let platData = response.data;
    // console.log(platData.next);
    for (let i = 0; i < platData.results.length; i++) {
      let platCreate = 'INSERT INTO PLATFORM(PLATFORM_ID,PLATFORM_NAME) VALUES($1,$2)';
      let platInfo = [platData.results[i].id, platData.results[i].name];
      client.query(platCreate, platInfo, (err, res) => {
        // if (err) {
        //   console.log(err.stack)
        // }
      });
    }
  }).catch(function (error) {
    console.error(error);
  });
}

// Games
for (let page_num = 1; page_num < 3; page_num++) {
  let options = {
    method: 'GET',
    url: 'https://api.rawg.io/api/games?key=' + process.env.YOUR_API_KEY + '&page=' + page_num
  };
  axios.request(options).then(function (response) {
    let gameData = response.data;
    // console.log(gameData.next);
    // Populate Games
    let gameCreate = 'INSERT INTO GAMES(GAMES_ID,GAMES_TITLE,GAMES_SCORE,GAMES_AGE_RATING) VALUES($1,$2,$3,$4)';
    for (let i = 0; i < gameData.results.length; i++) {

      let gameInfo = [0];

      if (gameData.results[i].esrb_rating == null) {
        gameInfo = [gameData.results[i].id, gameData.results[i].name, gameData.results[i].metacritic, 'Not Available'];
      }
      else {
        gameInfo = [gameData.results[i].id, gameData.results[i].name, gameData.results[i].metacritic, gameData.results[i].esrb_rating.name];
      }
      client.query(gameCreate, gameInfo, (err, res) => {
        // if (err) {
        //   console.log(err.stack)
        // }
      });

      // Developer
      let devCreate = 'INSERT INTO DEVELOPER(DEV_ID,DEV_NAME) VALUES($1,$2)';
      // Game_Developer
      let gameDevCreate = 'INSERT INTO GAMES_DEVELOPER(GAMES_ID,PLATFORM_ID,GAME_RELEASE_DATE,DEV_ID) VALUES($1,$2,$3,$4)';
      let moreOptions = {
        method: 'GET',
        url: 'https://api.rawg.io/api/games/' + gameData.results[i].id + '?key=' + process.env.YOUR_API_KEY
      };
      axios.request(moreOptions).then(function (response) {
        let gameDetailData = response.data;
        let devInfo = [gameDetailData.developers[0].id, gameDetailData.developers[0].name];
        //developer create
        client.query(devCreate, devInfo, (err, res) => {
          // if (err) {
          //   console.log(err.stack)
          // }
        });
        //game_developer create
        for (let j = 0; j < gameDetailData.platforms.length; j++) {
          let gameDev = [gameData.results[i].id, gameDetailData.platforms[j].platform.id, gameDetailData.platforms[j].released_at, gameDetailData.developers[0].id];
          client.query(gameDevCreate, gameDev, (err, res) => {
          // if (err) {
          //   console.log(err.stack)
          // }
        });
        }


        // console.log(devInfo);
        // console.log(gameDev);
        

        
      });

      //  Game_Platform
      for (let j = 0; j < gameData.results[i].platforms.length; j++) {
        let gameID = gameData.results[i].id;
        let platformID = gameData.results[i].platforms[j].platform.id;
        let gamePlatformQuery = 'INSERT INTO GAME_PLATFORM(GAMES_ID,PLATFORM_ID) VALUES($1,$2)';
        client.query(gamePlatformQuery, [gameID, platformID], (err, res) => {
          // if (err) {
          //   console.log(err.stack)
          // }
        });
      }
      // Games_Genre Table
      for (let j = 0; j < gameData.results[i].genres.length; j++) {
        let gameID = gameData.results[i].id;
        let genreID = gameData.results[i].genres[j].id;
        let gameGenreQuery = 'INSERT INTO GAMES_GENRE(GAMES_ID,GENRE_ID) VALUES($1,$2)';
        client.query(gameGenreQuery, [gameID, genreID], (err, res) => {
          // if (err) {
          //   console.log(err.stack)
          // }
        });
      }
      // Game_Developer Table
      // for (let j = 0; j < gameData.results[i].genres.length; j++) {
      //   let gameID = gameData.results[i].id;

      //   let developerID = gameData.results[i].genres[j].id;
      //   let gameGenreQuery = 'INSERT INTO GAMES_developer(GAMES_ID,GENRE_ID) VALUES($1,$2)';
      //   client.query(gameGenreQuery, [gameID, genreID], (err, res) => {
      //     // if (err) {
      //     //   console.log(err.stack)
      //     // }
      //   });
      // }
    }
  }).catch(function (error) {
    console.error(error);
  });
}

router.get("/", (req, res) => {
  let options = {
    method: 'GET',
    url: 'https://api.rawg.io/api/games?key=' + process.env.YOUR_API_KEY + '&page=1'
  };
  axios.request(options).then(function (response) {
    let gameData = response.data;
    // console.log(gameData.results[0].added_by_status);
    // console.log(gameData.results[0].parent_platforms);
    res.render("index.ejs", {
      games: gameData.results,
    });
  }).catch(function (error) {
    console.error(error);
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

// client.query('SELECT * FROM GAMES WHERE GAMES_ID = 49',(err, res) => {
//   if (err) {
//     console.log(err.stack)
//   } else {
//     console.log(res.rows[0])
//   }
// });

// let options = {
//   method: 'GET',
//   url: 'https://api.rawg.io/api/games?key=' + process.env.YOUR_API_KEY + '&page=1'
// };
// axios.request(options).then(function (response) {
//   let gameData = response.data;
//   console.log(gameData.results[0].added_by_status);
//   console.log(gameData.results[0].parent_platforms);
//   res.render("index.ejs", {
//     games: gameData.results,
//   });
// }).catch(function (error) {
//   console.error(error);
// });
module.exports = router;