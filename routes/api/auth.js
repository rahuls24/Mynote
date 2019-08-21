const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jsonwt = require('jsonwebtoken');
const passport = require('passport');
const key = require('../../setup/myurl');
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
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            // Store hash in your password DB.
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log('error from user saving' + err));
          });
        });
      }
    })
    .catch(err =>
      console.log('err from signup route from findOne method' + err)
    );
});

// @type => POST
// @route => api/auth/login
// @desc => route for login
// @access => PUBLIC

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res
          .status(404)
          .json({ userErr: 'user not found. Check your email and try again' });
      }
      bcrypt
        .compare(password, user.password)
        .then(isCorrect => {
          if (!isCorrect) {
            return res.json({ passwordError: 'password is not match' });
          }
          // console.log(user.id, user.name, user.email, user.username);
          const payload = {
            id: user.id,
            name: user.name,
            email: user.email
          };
          // console.log(payload);
          jsonwt.sign(
            payload,
            key.secret,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: true,
                //  token: 'Bearer ' + token  // use when we choose auth in header in postman
                token: token // use postman auth bar and choose Bearer type
              });
            }
          );
        })
        .catch(err =>
          console.log('err from login route from bcrypt compare method' + err)
        );
    })
    .catch(err => console.log('error from login route' + err));
});

//testing
router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // console.log(req);
    res.json(req.user);
  }
);

module.exports = router;
