const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const taskSchema = new Schema({
  description: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
  },
  completed: {
    type: Boolean,
    defalut: false,
  },
});

module.exports = mongoose.model("Task", taskSchema);
