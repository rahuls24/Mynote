const mongoose = require('mongoose');
const schema = mongoose.Schema;

const NoteSchema = new schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'myUser'
  },
  notes: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Note = mongoose.model('myNote', NoteSchema);
