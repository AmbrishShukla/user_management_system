const bodyParser = require("body-parser");
const express = require("express");
const exphbs = require("express-handlebars");

require("dotenv").config();

// The pool reads DB_* from the environment, so load it after dotenv.
const pool = require("./server/db");

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
app.engine('hbs', exphbs.engine({ extname: '.hbs', helpers: { eq: (a, b) => a === b } }));

// now setting up the view wngine
app.set('view engine', 'hbs');

// Behind a proxy that terminates TLS, secure cookies need Express to trust it.
if (process.env.TRUST_PROXY) app.set('trust proxy', 1);

// sessions, and the signed-in account for every view
app.use(require('./server/auth/session'));
app.use((req, res, next) => {
    res.locals.account = req.session.account;
    next();
});

// connect to database
pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected to database " + connection.threadId);
});


// routers: signing in first, then the admin area, then the user pages
app.use('/', require('./server/routes/auth'));
app.use('/admin', require('./server/routes/admin'));
const routes = require('./server/routes/user');
app.use('/', routes);

app.listen(port, () => console.log('Listening on port ' + port));