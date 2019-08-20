const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const User = require('../../models/user');

// testing purpose
router.get('/', (req, res) => {
  res.json({ msg: 'msg from auth route' });
});

// @type => POST
// @route => "/api/auth/signup"
// @desc => router for signup for User
// @access => public
router.post('/signup', (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        return res.json({ emailError: 'user already exit' });
      } else {
        // checking length of password
        if (req.body.password.length < 6) {
          return res.json({
            passwordError: 'password length must be greater then 5 character'
          });
        }
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          username: req.body.username
        });
        // encrypt the password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            // Store hash in your password DB.
            newUser.password = hash;
          });
        });
        newUser
          .save()
          .then(newUser => res.json(newUser))
          .catch(err =>
            console.log('err from signup router at saving method' + err)
          );
      }
    })
    .catch(err =>
      console.log('err from signup route from findone method' + err)
    );
});

module.exports = router;
