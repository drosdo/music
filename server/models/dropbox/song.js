const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define our model
const SongSchema = new Schema({
  name: String,
  band: String,
  createdTime: String,
  size: String,
  bpm: String,
  album: String,
  tempSongLink: Object,
  tempWaveLink: Object,
  wave: Object
});

console.log('SongSchema.index');
SongSchema.index({name: 'text', band: 'text', album: 'text'})
// Create the model class
const ModelClass = mongoose.model('song', SongSchema);

// Export the model
module.exports = ModelClass;
