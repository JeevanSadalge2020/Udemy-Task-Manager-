const express = require("express");
const router = express.Router();
const Task = require("../models/task");
require("../db/mongoose");

router.post("/tasks", async (req, res) => {
  const task = new Task(req.body);
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/tasks/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      res.status(404).send("Task not found");
    }
    res.send("Task deleted");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/tasks/:id", async (req, res) => {
  const id = req.params.id;
  const keys = Object.keys(req.body);
  const props = Object.keys(Task.schema.paths);
  const isUpdateValid = keys.every(key => props.includes(key));

  if (!isUpdateValid) {
    res.status(404).send("Invalid update request");
  }

  try {
    const task = await Task.findById(id);
    // IMPORTANT;
    keys.forEach(key => {
      if (props.includes(key)) {
        task[key] = req.body[key];
      } else {
        // TRY ADDING A PROPERTY THAT DOES NOT EXISTS
        console.log("unknown property updating");
      }
    });

    await task.save();
    if (!task) {
      res.status(404).send("task not found");
    } else res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
  // NOTE Below code wont work for middleware which we are using in this operation of updating the user NOTE
  // IMPORTANT;
  // "https://stackoverflow.com/questions/54579752/using-mongoose-pre-hook-to-get-document-before-findoneandupdate"

  // try {
  //   const task = await Task.findByIdAndUpdate(id, req.body, {
  //     new: true,
  //     runValidators: true,
  //   });
  //   if (!task) {
  //     res.status(404).send("Task not found");
  //   }
  //   res.send(task);
  // } catch (error) {
  //   res.status(500).send(error);
  // }
});

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/tasks/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const task = await Task.findById(id);
    if (!task) res.status(404).send("User not found");
    else res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
