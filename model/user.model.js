const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin", "ProjectManager", "user"] },
});

const User = mongoose.model("userData", userSchema);

module.exports = { User };
