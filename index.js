const express = require('express');
const path = require('path');
const ejs = require('ejs');
const router = express.Router;
// const fetch = require('node-fetch');
const dotenv = require('dotenv');
const Rawger = require('rawger');
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

var testdata;

// routes
app.get("/", (req, res) => {
  var options = {
    method: 'GET',
    url: 'https://rawg-video-games-database.p.rapidapi.com/games?key=' + process.env.YOUR_API_KEY,
    headers: {
      'x-rapidapi-host': 'rawg-video-games-database.p.rapidapi.com',
      'x-rapidapi-key': '504d4f71c5msh29d9ed342160e83p15191ejsna837f2812c38'
    }
  };
  
  axios.request(options).then(function (response) {
    testdata = response.data;
    // console.log(response.data);
    console.log(testdata);
    console.log(testdata[5]);
  }).catch(function (error) {
    console.error(error);
  });

  res.render("index.ejs");
});

// router to use api
app.use(rawgRoutes);



// Setup server ports
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));