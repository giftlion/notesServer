const mongoose = require("mongoose");

// Define the schema for notes
const noteSchema = new mongoose.Schema({
  _id: String,
  content: String,
  bgColor: String,
  date: String,
  pin: Boolean,
});

// Define the schema for the user document
const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  notes: [noteSchema], // Embedding the note schema as an array within the user schema
});

module.exports = mongoose.model("User", userSchema);
