var express = require('express');
var app = express();

app.use(express.static('public'));

app.listen(3005, function () {
  console.log('App listening on port 3005!');
});
