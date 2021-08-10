const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const validator = require("validator");

const UserSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: "{VALUE} is not a valid email",
      isAsync: false,
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    // validate: {
    //   validator: validator.isStrongPassword,
    //   options: {
    //     minLength: 5,
    //     minLowercase: 1,
    //     minUppercase: 1,
    //     minSymbols: 1,
    //   },
    //   message: "{VALUE} Password not matching criteria!",
    // },
    validate(value) {
      if (validator.isEmpty(value)) {
        throw new Error("Please enter your password!");
      } else if (validator.equals(value.toLowerCase(), "password")) {
        throw new Error("Password is invalid!");
      } else if (validator.contains(value.toLowerCase(), "password")) {
        throw new Error("Password should not contain password!");
      } else if (
        !validator.isStrongPassword(value, {
          minLength: 5,
          minLowercase: 1,
          minUppercase: 1,
          minSymbols: 1,
        })
      ) {
        throw new Error("Password not matching criteria!");
      }
    },
  },
  age: {
    type: Number,
    trim: true,
    default: 0,
    integerOnly: true,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
