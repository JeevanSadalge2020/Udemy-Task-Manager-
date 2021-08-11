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

taskSchema.pre("save", async function (next) {
  const task = this;
  const password = task.password;
  let salt = 8;
  // only hash the password if it has been modified (or is new)
  if (!task.isModified("password")) return next();
  try {
    salt = await bcrypt.genSalt(salt);
  } catch (error) {
    next(error);
  }
  try {
    const hashPass = await bcrypt.hash(password, salt);
    task.password = hashPass;
  } catch (error) {
    next(error);
  }
  next();
});

module.exports = mongoose.model("Task", taskSchema);
