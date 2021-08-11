const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { ObjectId } = require("mongodb");
const { findOneAndUpdate } = require("../models/user");
require("../db/mongoose");

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
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
      console.log("============", key);
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
