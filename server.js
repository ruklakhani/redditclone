const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const express = require('express')
const app = express()
const port = 3000
const Post = require('./models/post');

const exphbs = require('express-handlebars');

// setup app
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add after body parser initialization!
app.use(expressValidator());

// Set db
require('./data/reddit-db');

app.get('/', (req, res) => {
  Post.find().lean().then(posts => {
    res.render("posts-index", { posts });
  }).catch(err => {
    console.log(err.message);
});})

require('./controllers/post.js')(app);

require('./controllers/comments.js')(app);

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

module.exports = app;