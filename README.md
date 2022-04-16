# csi_3450_project
Uses API data from rawg.io to populate postgresql database.  Website then fetches data from the database to demonstrate database functionality

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

### Config
index.js is our server config file
passportConfig.js is the passport config file for securing passwords