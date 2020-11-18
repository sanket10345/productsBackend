const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const auth = require('./middleware/auth');

//Route files
const user = require("./routes/user")
const product = require("./routes/product")

var app = express();
app.use(cors())
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Hello World!');
  });

// Mount Router
app.use('/api/user', auth, user)
app.use('/api/product', auth, product)

app.listen(3001, () => console.log('server started'));
