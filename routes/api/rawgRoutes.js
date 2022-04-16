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

// // Stores
// for (let page_num = 1; page_num < 2; page_num++) {
//   let options = {
//     method: 'GET',
//     url: 'https://api.rawg.io/api/stores?key=' + process.env.RAWG_API_KEY + '&page=' + page_num
//   };
//   axios.request(options).then(function (response) {
//     let storeData = response.data;
//     // console.log(storeData.results);
//     for (let i = 0; i < storeData.results.length; i++) {
//       let storeCreate = 'INSERT INTO STORE(STORE_ID,STORE_NAME) VALUES($1,$2)';
//       let storeInfo = [storeData.results[i].id, storeData.results[i].name];
//       client.query(storeCreate, storeInfo, (err, res) => {
//         // if (err) {
//         //   console.log(err.stack)
//         // }
//       });
//     }
//   }).catch(function (error) {
//     console.error(error);
//   });
// }

// // Genre
// for (let page_num = 1; page_num < 2; page_num++) {
//   let options = {
//     method: 'GET',
//     url: 'https://api.rawg.io/api/genres?key=' + process.env.RAWG_API_KEY + '&page=' + page_num
//   };
//   axios.request(options).then(function (response) {
//     let genreData = response.data;
//     // console.log(storeData.results);
//     for (let i = 0; i < genreData.results.length; i++) {
//       let genreCreate = 'INSERT INTO GENRE(GENRE_ID,GENRE_NAME) VALUES($1,$2)';
//       let genreInfo = [genreData.results[i].id, genreData.results[i].name];
//       client.query(genreCreate, genreInfo, (err, res) => {
//         // if (err) {
//         //   console.log(err.stack)
//         // }
//       });
//     }
//   }).catch(function (error) {

//     console.error(error);
//   });
// }

// // Platform
// for (let page_num = 1; page_num < 3; page_num++) {
//   let options = {
//     method: 'GET',
//     url: 'https://api.rawg.io/api/platforms?key=' + process.env.RAWG_API_KEY + '&page=' + page_num
//   };
//   axios.request(options).then(function (response) {
//     let platData = response.data;
//     // console.log(platData.next);
//     for (let i = 0; i < platData.results.length; i++) {
//       let platCreate = 'INSERT INTO PLATFORM(PLATFORM_ID,PLATFORM_NAME) VALUES($1,$2)';
//       let platInfo = [platData.results[i].id, platData.results[i].name];
//       client.query(platCreate, platInfo, (err, res) => {
//         // if (err) {
//         //   console.log(err.stack)
//         // }
//       });
//     }
//   }).catch(function (error) {
//     console.error(error);
//   });
// }

// // Games
// for (let page_num = 1; page_num < 21; page_num++) {
//   let options = {
//     method: 'GET',
//     url: 'https://api.rawg.io/api/games?key=' + process.env.RAWG_API_KEY + '&page=' + page_num
//   };
//   axios.request(options).then(function (response) {
//     let gameData = response.data;
//     // Populate Games
//     let gameCreate = 'INSERT INTO GAMES(GAMES_ID,GAMES_TITLE,GAMES_SCORE,GAMES_AGE_RATING,GAMES_IMG) VALUES($1,$2,$3,$4,$5)';
//     for (let i = 0; i < gameData.results.length; i++) {

//       let gameInfo = [0];

//       if (gameData.results[i].esrb_rating == null) {
//         gameInfo = [gameData.results[i].id, gameData.results[i].name, gameData.results[i].metacritic, 'Not Available', gameData.results[i].background_image];
//       }
//       else {
//         gameInfo = [gameData.results[i].id, gameData.results[i].name, gameData.results[i].metacritic, gameData.results[i].esrb_rating.name,gameData.results[i].background_image];
//       }
//       client.query(gameCreate, gameInfo, (err, res) => {
//         // if (err) {
//         //   console.log(err.stack)
//         // }
//       });

//       // Developer
//       let devCreate = 'INSERT INTO DEVELOPER(DEV_ID,DEV_NAME) VALUES($1,$2)';
//       // Game_Developer
//       let gameDevCreate = 'INSERT INTO GAMES_DEVELOPER(GAMES_ID,PLATFORM_ID,GAME_RELEASE_DATE,DEV_ID) VALUES($1,$2,$3,$4)';
//       let moreOptions = {
//         method: 'GET',
//         url: 'https://api.rawg.io/api/games/' + gameData.results[i].id + '?key=' + process.env.RAWG_API_KEY
//       };
//       axios.request(moreOptions).then(function (response) {
//         let gameDetailData = response.data;
//         // console.log(gameDetailData.name, gameDetailData.id);
//         let devInfo = [];
//         //developer create
//         if (gameDetailData.developers.length == 0) {
//           devInfo = [999999, 'Unavailable'];
//           client.query(devCreate, devInfo, (err, res) => {
//             // if (err) {
//             //   console.log(err.stack)
//             // }
//           });
//         }
//         if (gameDetailData.developers.length > 0) {
//           for (let j = 0; j < gameDetailData.developers.length; j++) {
//             devInfo = [gameDetailData.developers[j].id, gameDetailData.developers[j].name];
//             client.query(devCreate, devInfo, (err, res) => {
//               // if (err) {
//               //   console.log(err.stack)
//               // }
//             });
//           }
//         }


//         //game_developer create
//         for (let j = 0; j < gameDetailData.platforms.length; j++) {
//           let gameDev = [];
//           if (gameDetailData.developers.length == 0) {
//             gameDev = [gameData.results[i].id, gameDetailData.platforms[j].platform.id, gameDetailData.platforms[j].released_at, 999999];
//             client.query(gameDevCreate, gameDev, (err, res) => {
//               // if (err) {
//               //   console.log(err.stack)
//               // }
//             });
//           }
//           if (gameDetailData.developers.length > 0) {
//             for (let k = 0; k < gameDetailData.developers.length; k++)
//             gameDev = [gameData.results[i].id, gameDetailData.platforms[j].platform.id, gameDetailData.platforms[j].released_at, gameDetailData.developers[k].id];
//             client.query(gameDevCreate, gameDev, (err, res) => {
//               // if (err) {
//               //   console.log(err.stack)
//               // }
//             });
//           }

//         }
//       });
//       // Link Games Stores and Platforms
//       let gamePlatStore = 'INSERT INTO GAME_PLATFORM_AT_STORE(GAMES_ID,PLATFORM_ID,STORE_ID,STORE_URL) VALUES ($1,$2,$3,$4)';
//       let storeOptions = {
//         method: 'GET',
//         url: 'https://api.rawg.io/api/games/' + gameData.results[i].id + '/stores?key=' + process.env.RAWG_API_KEY
//       };
//       axios.request(storeOptions).then(function (response) {
//         let gameStoreDetail = response.data;
//         let platform = 0;
//         for (let j = 0; j < gameStoreDetail.results.length; j++) {
//           let store = gameStoreDetail.results[j].store_id;
//           if (store == 1 || store == 5 || store == 11) {
//             platform = [4];
//           }
//           // Set Microsoft store to only xbox series x/s
//           else if (store == 2) {
//             platform = [186, 1];
//           }
//           // Nintendo set
//           else if (store == 6) {
//             platform = [7, 8, 9, 13, 83, 24, 43, 26, 79, 49, 105, 11, 10];
//           }
//           else if (store == 7) {
//             platform = [14, 80];
//           }
//           // Playstation Store
//           else if (store == 3) {
//             platform = [187, 18, 16, 15, 27, 19, 17];
//           }
//           // Set mobile apps to android
//           else {
//             platform = [21, 3];
//           }
//           for (let k = 0; k < platform.length; k++) {
//             let gameStoreInfo = [gameData.results[i].id, platform[k], store, gameStoreDetail.results[j].url];
//             client.query(gamePlatStore, gameStoreInfo, (err, res) => {
//               // if (err) {
//               //   console.log(err.stack)
//               // }
//             });
//           }
//         }
//       });

//       //  Game_Platform
//       for (let j = 0; j < gameData.results[i].platforms.length; j++) {
//         let gameID = gameData.results[i].id;
//         let platformID = gameData.results[i].platforms[j].platform.id;
//         let gamePlatformQuery = 'INSERT INTO GAME_PLATFORM(GAMES_ID,PLATFORM_ID) VALUES($1,$2)';
//         client.query(gamePlatformQuery, [gameID, platformID], (err, res) => {
//           // if (err) {
//           //   console.log(err.stack)
//           // }
//         });
//       }
//       // Games_Genre Table
//       for (let j = 0; j < gameData.results[i].genres.length; j++) {
//         let gameID = gameData.results[i].id;
//         let genreID = gameData.results[i].genres[j].id;
//         let gameGenreQuery = 'INSERT INTO GAMES_GENRE(GAMES_ID,GENRE_ID) VALUES($1,$2)';
//         client.query(gameGenreQuery, [gameID, genreID], (err, res) => {
//           // if (err) {
//           //   console.log(err.stack)
//           // }
//         });
//       }
//     }
//   }).catch(function (error) {
//     console.error(error);
//   });
// }

// // for (let page_num = 1; page_num < 21; page_num++) {
// //   let options = {
// //     method: 'GET',
// //     url: 'https://api.rawg.io/api/games?key=' + process.env.RAWG_API_KEY + '&page=' + page_num
// //   };
// //   axios.request(options).then(function (response) {
// //     let gameData = response.data;
// //     // Populate Games
// //     let gameCreate = 'UPDATE GAMES SET GAMES_IMG = $1 WHERE GAMES_ID = $2';
// //     for (let i = 0; i < gameData.results.length; i++) {
// //       let gameInfo = [0];
// //       gameInfo = [gameData.results[i].background_image, gameData.results[i].id];
// //       client.query(gameCreate, gameInfo, (err, res) => {
// //         // if (err) {
// //         //   console.log(err.stack)
// //         // }      
// //       });
// //     }
// //   }).catch(function (error) {
// //     console.error(error);
// //   });
// // }

module.exports = router;