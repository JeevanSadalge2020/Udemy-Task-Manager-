const mongoose = require("./src/db/mongoose");
const User = require("./src/models/user");

// const id = "610fc8bcf84c2e491838310e";

// User.findByIdAndDelete(id)
//   .then(res => User.countDocuments({}).then(res => console.log(res)))
//   .catch(err => console.log(err));

async function findAndCount(id) {
  await User.findByIdAndDelete(id);
  return User.countDocuments({ age: 95 });
}

findAndCount("611018ca71dca057305fcad0")
  .then(res => console.log(res))
  .catch(err => console.log(err));
