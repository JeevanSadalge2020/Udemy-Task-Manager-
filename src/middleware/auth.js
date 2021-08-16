const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  // console.log("request header", req.header("Authorization"));
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "secret");
    console.log("decoded", decoded);
    const user = await User.findOne({ _id: decoded.id, "tokens.token": token });
    console.log("USER", user);
    // console.log("user", user);
    if (!user) throw new Error();
    // IMPORTANT
    req.user = user;
    next();
  } catch (error) {
    res.status(404).send("You are not a authenticated user");
    // res.status(404).send({ error: "You are not a authenticated user" });
    // throw new Error("You are not a authenticated user");
  }
};

module.exports = auth;
