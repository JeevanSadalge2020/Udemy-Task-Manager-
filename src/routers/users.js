const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { ObjectId } = require("mongodb");
require("../db/mongoose");

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(err);
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
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      res.status(404).send("User not found");
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
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
