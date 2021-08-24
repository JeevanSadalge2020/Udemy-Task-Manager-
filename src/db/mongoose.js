const mongoose = require("mongoose");
const url = process.env.mongooseUrl;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
