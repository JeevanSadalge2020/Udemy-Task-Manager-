const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = process.env.jwtSecret;

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
    unique: true,
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
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

UserSchema.methods.generateToken = function () {
  const user = this;
  const token = jwt.sign({ id: user._id.toString() }, secret);
  user.tokens.push({ token });
  return token;
};

UserSchema.statics.getUserByCredentials = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User does not exists");
      return undefined;
    } else {
      try {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          console.log("Password does not match");
          return undefined;
        } else {
          console.log("Login Successful");
          return user;
        }
      } catch (error) {
        throw new Error(error);
      }
    }
  } catch (error) {
    throw new Error(error);
  }
};

UserSchema.pre("save", async function (next) {
  const user = this;
  const password = user.password;
  let salt = 8;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();
  try {
    salt = await bcrypt.genSalt(salt);
  } catch (error) {
    next(error);
  }
  try {
    const hashPass = await bcrypt.hash(password, salt);
    user.password = hashPass;
  } catch (error) {
    next(error);
  }
  next();
});

UserSchema.methods.validatePassword = async function (
  inputPassword,
  databasePassword
) {
  try {
    return await bcrypt.compare(inputPassword, databasePassword);
  } catch (error) {
    return error;
  }
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
