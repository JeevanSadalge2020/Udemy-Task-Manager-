const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const tasksRouter = require("./routers/tasks");
const usersRouter = require("./routers/users");

app.use(express.json());
app.use(tasksRouter);
app.use(usersRouter);

app.listen(port, () => console.log("Listening on port", port));
