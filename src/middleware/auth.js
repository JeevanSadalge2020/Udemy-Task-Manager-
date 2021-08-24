const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "secret");
    // IMPORTANT
    const user = await User.findOne({ _id: decoded.id, "tokens.token": token });
    if (!user) throw new Error(); //this will go to catch block
    // IMPORTANT
    req.token = token;
    req.user = user;
  } catch (error) {
    res.status(401).send("You are not a authenticated user");
  }
  next();
};

module.exports = auth;
