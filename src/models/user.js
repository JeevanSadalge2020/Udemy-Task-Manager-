const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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

// UserSchema.pre("findOneAndUpdate", async function (next) {
//   console.log(
//     "......................................in findOne middleware........................"
//   );

//   const user = await this.model.findOne(this.getQuery());
//   console.log("=========user==========", user);
//   // const docToUpdate = await this.model.findOne(this.getQuery());
//   const password = user.password;
//   console.log("updated password", password);
//   let salt = 8;
//   // only hash the password if it has been modified (or is new)
//   if (!user.isModified("password")) return next();
//   try {
//     console.log("in try of salt of pre update");
//     salt = await bcrypt.genSalt(salt);
//   } catch (error) {
//     console.log("in catch of salt of pre update");
//     console.log(error);
//     next(error);
//   }
//   try {
//     console.log("in try of hash of pre update");
//     const hashPass = await bcrypt.hash(password, salt);
//     console.log("hashpass", hashPass);
//     user.password = hashPass;
//   } catch (error) {
//     console.log("in catch of salt of pre update");
//     console.log(error);
//     next(error);
//   }
//   console.log("nothing is workng properly");
//   next();
// });

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

// UserSchema.pre("save", function (next) {
//   var user = this;
//   console.log("user", user);

//   // only hash the password if it has been modified (or is new)
//   if (!user.isModified("password")) return next();

//   // generate a salt
//   bcrypt.genSalt(8, function (err, salt) {
//     console.log(salt);
//     if (err) return next(err);

//     // hash the password using our new salt
//     bcrypt.hash(user.password, salt, null, function (err, hash) {
//       if (err) return next(err);

//       // override the cleartext password with the hashed one
//       user.password = hash;
//       next();
//     });
//   });
// });

const User = mongoose.model("User", UserSchema);

module.exports = User;
