const express = require("express");

const cors = require("cors");

const app = express();

require("dotenv").config();

const { connection } = require("./config/db");

const { userRouter } = require("./routes/user.route");
const { projectRouter } = require("./routes/project.route");
const taskrouter = require("./routes/task.route");
const teamrouter = require("./routes/team.route");
app.use(cors());

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Welcome to MovieAPP Server!");
});

app.use("/user", userRouter);
app.use("/projects", projectRouter);
app.use("/task", taskrouter);
app.use("/team", teamrouter);
app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log(`Connected to db at port ${process.env.PORT}`);
  } catch (error) {
    console.log(error);
  }
});
