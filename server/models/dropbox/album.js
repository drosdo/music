const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define our model
const albumSchema = new Schema({
  name: String,
  band: String
});

// Create the model class
const ModelClass = mongoose.model('album', albumSchema);

// Export the model
module.exports = ModelClass;
