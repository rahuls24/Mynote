const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Note = require('../../models/notes');

// testing router
router.get('/', (req, res) => {
  res.json({ msg: 'msg from notes router' });
});

// @type => POST
// @route => /api/notes/addnote
// @desc => router for adding notes of login user
// @access => PRIVATE
router.post(
  '/addnote',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const newNotes = new Note({
      user: req.user.id,
      title: req.body.title,
      note: req.body.note
    });
    newNotes
      .save()
      .then(res.status(200).json(newNotes))
      .catch(err => console.log('err from saving note route' + err));
  }
);

// @type => POST
// @route => /api/notes/mynotes
// @desc => router for showing notes of login user
// @access => PRIVATE
router.get(
  '/mynotes',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Note.find({ user: req.user.id })
      .then(note => {
        // checking either login user has a note or not
        if (Object.keys(note).length === 0) {
          return res
            .status(404)
            .json({ noteErr: 'no notes found for current user' });
        }
        res.json(note);
      })
      .catch(err => console.log('err in finding the user notes' + err));
  }
);

module.exports = router;
