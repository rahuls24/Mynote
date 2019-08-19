const express = require('express');
const app = express();

//testing
app.get('/', (req, res) => {
  res.json({ msg: 'testing of expressJs' });
});

app.listen(7272, () => console.log('running at port 7272.......'));
