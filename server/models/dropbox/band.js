const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define our model
const bandSchema= new Schema({
  name: String,
});

// Create the model class
const ModelClass = mongoose.model('band', bandSchema);



// Export the model
module.exports = ModelClass;
