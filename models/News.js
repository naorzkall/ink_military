const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsSchema = new Schema({
  division: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);
