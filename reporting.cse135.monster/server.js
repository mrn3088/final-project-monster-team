var express = require('express');
var app = express();
const cors = require('cors');

app.use(express.static('public'));

app.use(cors());

app.listen(3005, function () {
  console.log('App listening on port 3005!');
});