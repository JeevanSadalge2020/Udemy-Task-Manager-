const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const tasksRouter = require("./routers/tasks");
const usersRouter = require("./routers/users");

app.use(express.json());
app.use(tasksRouter);
app.use(usersRouter);

app.listen(port, () => console.log("Listening on port", port));

const bcrypt = require("bcryptjs");

async function myFun() {
  const password = "jeevan1234";
  const hashedPassword = await bcrypt.hash(password, 8);
  console.log(password);
  console.log(hashedPassword);
  const isMatch = await bcrypt.compare("jjkk", hashedPassword);
  console.log(isMatch);
}

myFun();
