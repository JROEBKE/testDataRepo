const mongoose = require('mongoose'),
  Schema = mongoose.Schema;
  bodyParser = require('body-parser');
  timestamps = require('mongoose-timestamp')
  mongoosePaginate = require('mongoose-paginate');
  moment = require("moment"); // timestamp format
  check = require('express-validator'); // Request validation
  validationResult = require('express-validator');
  matchedData = require('express-validator');
  sanitize = require('express-validator');



// create a schema
const testDataEntrySchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    index: true,
    unique: 'There exists already an email with value ({VALUE})'
  },
  password: String,
  description: String,
  stages: {
    type : Array ,
    "default" : []
  },
  tags: {
    type : Array ,
    "default" : []
  }
});

// index for search all
testDataEntrySchema.index({ email: "text", stages: "text", description: "text", tags: "text"});

//Plugins mongoose
testDataEntrySchema.plugin(timestamps);
testDataEntrySchema.plugin(mongoosePaginate);


// middleware -----
testDataEntrySchema.pre('save', function(next) {
  this.slug = slugify(this.email);
  next();
});

// create the model
var testDataEntryModel = mongoose.model('TestDataEntry', testDataEntrySchema);

// export the model
module.exports = testDataEntryModel;

// function to slugify a vin
function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '')            // Remove spaces
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}
