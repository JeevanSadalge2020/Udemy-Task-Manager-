const express = require("express");
const router = express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const { ObjectId } = require("mongodb");
const { Error } = require("mongoose");
require("../db/mongoose");

router.post("/users/create", async (req, res) => {
  const user = new User(req.body);
  try {
    if (!(await User.findOne({ email: req.body.email }))) {
      const token = await user.generateToken();
      await user.save();
      res.status(201).send({ user, token });
    } else {
      res.status(400).send("Email already registered");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/users/me", auth, async (req, res) => {
  const user = req.user;
  res.send(user);
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.getUserByCredentials(
      req.body.email,
      req.body.password
    );
    if (!user) res.status(400).send("Unable to authenticate");
    else {
      const token = await user.generateToken();
      await user.save();
      res.send({ user, token });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    const tokenToRemove = req.token;
    const user = req.user;
    user.tokens = user.tokens.filter(token => {
      // console.log("TOKEN FROM DB", token);
      // console.log("TOKEN FROM LOGIN", tokenToRemove);
      if (token.token !== tokenToRemove) {
        return token;
      }
    });
    await user.save();
    console.log(user.tokens);
    res.send("logout succeed");
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    const user = req.user;
    user.tokens = [];
    await user.save();
    res.send("logout succeed from all accounts");
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/users/welcome", auth, (req, res) => {
  res.send("welcome users");
});

router.get("/users/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findOne({ _id: new ObjectId(id) });
    if (!user) res.status(404).send("User not found");
    else res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/users/:id", async (req, res) => {
  const id = req.params.id;
  const keys = Object.keys(req.body);
  const props = Object.keys(User.schema.paths);
  const isUpdateValid = keys.every(key => props.includes(key));

  if (!isUpdateValid) {
    res.status(404).send("Invalid update request");
  }
  try {
    const user = await User.findById(id);
    // IMPORTANT;
    keys.forEach(key => {
      if (props.includes(key)) {
        user[key] = req.body[key];
      } else {
        // TRY ADDING A PROPERTY THAT DOES NOT EXISTS
        console.log("unknown property updating");
      }
    });

    console.log(user);
    await user.save();
    if (!user) {
      res.status(404).send("User not found");
    } else res.send(user);
  } catch (error) {
    console.log("error");
    res.status(500).send(error);
  }
  // NOTE;
  // "https://stackoverflow.com/questions/32811510/mongoose-findoneandupdate-doesnt-return-updated-document"
  // Hence we cannot use findOneAndUpdate here
});

router.delete("/users/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(404).send("User not found");
    }
    res.send("User deleted");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
