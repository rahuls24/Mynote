const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

// middleware bodyparser
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
const auth = require('./routes/api/auth');
const notes = require('./routes/api/notes');

// initilize the database variable
const db = require('./setup/myurl').mongoURL;

// connecting to database
mongoose.set('useNewUrlParser', true);
mongoose
  .connect(db)
  .then(console.log('mongoDb connected sucessfully......'))
  .catch(err => console.log('err from mongodb connection' + err));
//testing
app.get('/', (req, res) => {
  res.json({ msg: 'testing of expressJs' });
});
app.use('/api/auth', auth);
app.use('/api/notes', notes);
const port = process.env.PORT || 7272;
app.listen(port, () => console.log('running at port 7272.......'));
