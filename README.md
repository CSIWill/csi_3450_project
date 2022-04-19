# csi_3450_project
Uses API data from rawg.io to populate PostgreSQL database.  Website then fetches data from the database to demonstrate database functionality

## Cloning/Forking/Pulling
If you plan on cloning/forking/pulling this repository, you must get a rawg API key as well as the URL for your database.  You can register for a rawg API key by making an account and registering for an api key @ https://rawg.io/.  You can get a free database from Heroku which will provide database credentials and URL.  Once you have this information, store it in a new file named config.env in the root directory.

## File Structure
### public
This holds our CSS stylesheet, old HTML files that served as prototypes for our EJS view templates, and our favicon

### routes\api
#### rawgRoutes
This runs at server startup.  It calls the rawg API for data and then saves the data by inserting into our PostgreSQL database.  I have this commented out as we have a limited number of free calls to rawg API.  If running on a new/clean database, make sure to uncomment this code.
#### loginRoutes
This uses Passport and bcrypt to encrypt user passwords and then store thme into our PostgreSQL database.
#### gameRoutes
This uses the database data to render our EJS view templates

### views
Hold our EJS view templates
#### login related
Here are all the login related views: dashboard.ejs, deleteaccount.ejs, login.ejs, register.ejs
##### search related
Here are all the search related views: search.ejs, advancedResults.ejs, results.ejs

### Config
index.js is our server config file
passportConfig.js is the passport config file for securing passwords

## Codepen for interactivity with nav bar and footer
https://codepen.io/erikterwan/pen/EVzeRP

https://codepen.io/tutsplus/pen/yWrEgW

