
const mongoose = require("mongoose");

const errorSchema = new mongoose.Schema({
  errorType: {
    type: String,
    required: true,
    unique: false,
  },
  description: {
    type: String,
    required: true,
    unique: false
  },
  num_of_times_occured: {
    type: Number,
    required: true,
    unique: false,
  },
  created_at: {
    type: String,
    require: false,
    unique: false,
  },
  status: { // Logged, Active, In-Active , Closed 
    type: String,
    require: false,
    unique: false,
  },
  priority: { // Low , High, Medium
    type: String,
    required: true,
    unique: false
  }

});


// frontend-error is table name 
//mongoose.model - creates a model with schema
const Error = mongoose.model("frontend-error", errorSchema);

module.exports = Error;