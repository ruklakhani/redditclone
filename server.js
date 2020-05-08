require('dotenv').config();

const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const express = require('express')
const app = express()
const port = 3000
const Post = require('./models/post');

const exphbs = require('express-handlebars');

app.use(cookieParser()); // Add this after you initialize express.

// setup app
app.engine('handlebars', exphbs({ defaultLayout: 'main',  partialsDir: __dirname + '/views/partials/'}));
app.set('view engine', 'handlebars');

// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add after body parser initialization!
app.use(expressValidator());

// Set db
require('./data/reddit-db');

var checkAuth = (req, res, next) => {
  console.log("Checking authentication");
  if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
    req.user = null;
  } else {
    var token = req.cookies.nToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
  }

  next();
};
app.use(checkAuth);

// INDEX
app.get('/', (req, res) => {
  var currentUser = req.user;
  // res.render('home', {});
  console.log(req.cookies);
  Post.find().lean().populate('author')
  .then(posts => {
      res.render('posts-index', { posts, currentUser });
      // res.render('home', {});
  }).catch(err => {
      console.log(err.message);
  })
})



require('./controllers/post.js')(app);

require('./controllers/comments.js')(app);

require('./controllers/auth.js')(app);

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

module.exports = app;