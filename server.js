const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const express = require('express')
const app = express()
const port = 3000

// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add after body parser initialization!
app.use(expressValidator());

// Set db
require('./data/reddit-db');

app.get('/', (req, res) => res.send('Hello World!'))

require('./controllers/posts.js')(app);

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
