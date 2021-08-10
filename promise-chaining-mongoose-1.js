const mongoose = require("./src/db/mongoose");
const User = require("./src/models/user");

const id = "610fc8bcf84c2e491838310e";

// User.findByIdAndUpdate(id, { age: 28 }, { new: true }, (err, doc, res) => {
//   if (err) console.log(err);
//   else console.log(doc);
// });

User.findByIdAndUpdate(id, { age: 29 })
  .then(res => User.countDocuments({ age: 29 }).then(res => console.log(res)))
  .catch(err => console.log(err));
