const mongoose = require('mongoose');

const TacoSchema = new mongoose.Schema({
  userFrom: {
    type: String,
    required: true
  },
  userTo: {
    type: String,
    required: true
  },
  channel: {
    type: String,
    required: true
  },
  time: { type: Date }
});

module.exports.Taco = mongoose.model('Taco', TacoSchema);
