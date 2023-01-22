const bodyParser = require("body-parser");
const express = require("express");
const exphbs = require("express-handlebars");
const mysql = require("mysql");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// parsing middleware
// parse application / x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parsing application/jason
app.use(bodyParser.json());

// static file ..for using our static files like css images etc
app.use(express.static("public"));

// setting up templating engine using handle bars and not ejs

// changing handlebars extension (.handlebars -> .hbs)
//---> note : either use exphbs.engine or || const {exphbs} = require("express-handlebars") at top
app.engine('hbs', exphbs.engine({ extname: '.hbs' }));

// now setting up the view wngine
app.set('view engine', 'hbs');

// connection pool
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAMe
});

// connect to database
pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected to database " + connection.threadId);
});


// router: sending the get
const routes = require('./server/routes/user');
app.use('/', routes);

app.listen(port, () => console.log('Listening on port ' + port));