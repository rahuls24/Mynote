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

// @type => GET
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

// @type => GET
// @route => /api/notes/mynotes:title
// @desc => finding note by entering note title
// @access => PRIVATE
router.get(
  '/mynotes/:title',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Note.find({ title: req.params.title })
      .then(note => {
        if (Object.keys(note).length === 0) {
          return res
            .status(404)
            .json({ noteErr: 'no notes found for current user' });
        }
        res.json(note);
      })
      .catch(err => console.log('err from finding title by title name' + err));
  }
);

// @type => DELATE
// @route => /api/notes/mynotes/del
// @desc => deleting selected note
// @access => PRIVATE

router.delete(
  '/mynotes/del',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log(req.body.id);
    Note.findByIdAndDelete({ _id: req.body.id })
      .then(note => {
        if (note) {
          return res.status(200).json({ msg: 'deleted successfully ' });
        }
        res.status(404).json({ userNotFound: 'user not found' });
      })
      .catch(err => console.log('err from del' + err));
  }
);

module.exports = router;
