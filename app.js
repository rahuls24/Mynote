const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const passport = require('passport');

// middleware bodyparser
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// enable cross that will help to send data from same system
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

const auth = require('./routes/api/auth');
const notes = require('./routes/api/notes');

// initialize the database variable
const db = require('./setup/myurl').mongoURL;

// connecting to database
mongoose.set('useNewUrlParser', true);
mongoose
  .connect(db)
  .then(console.log('mongoDb connected successfully......'))
  .catch(err => console.log('err from mongodb connection' + err));

// initialize the passport middleware
app.use(passport.initialize());

// config for JWt Strategies
require('./strategies/jsonwtStrategies')(passport);
//testing
app.get('/', (req, res) => {
  res.json({ msg: 'testing of expressJs' });
});
app.use('/api/auth', auth);
app.use('/api/notes', notes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('running at port 7272.......'));
