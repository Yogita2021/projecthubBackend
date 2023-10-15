const express = require("express");
require("dotenv").config();
const { User } = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(201).json({ msg: "User already exist !" });
    }
    const hashPassword = bcrypt.hashSync(password, 8);
    const newUser = new User({ name, email, password: hashPassword, role });
    await newUser.save();
    return res
      .status(200)
      .json({ isError: false, msg: "New user registered !", user: newUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(201).json({ msg: "Please login First!" });
    }
    let passCheck = bcrypt.compareSync(password, user.password);
    if (!passCheck) {
      return res.status(201).json({ msg: "Wrong credential" });
    }
    let payload = {
      userName: user.name,
      userID: user._id,
      userRole: user.role,
    };
    const token = jwt.sign(payload, process.env.Secrete_key, {
      expiresIn: "8h",
    });
    res
      .status(200)
      .send({ msg: "Login successful !", token: token, user: user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
userRouter.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Unable to retrieve users" });
  }
});

module.exports = { userRouter };
