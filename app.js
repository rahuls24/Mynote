const express = require('express');
const bodyparser = require('body-parser');
const moongoes = require('mongoose');
const app = express();

//testing
app.get('/', (req, res) => {
  res.json({ msg: 'testing of expressJs' });
});
const port = process.env.PORT || 7272;
app.listen(port, () => console.log('running at port 7272.......'));
