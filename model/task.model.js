const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  dueDate: Date,
  priority: String,
  status: String,
  assignedUser: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userData", // Reference to the User model
    },
  ],
  project: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Projectlist", // Reference to the Projectlist model
    },
  ],
  team: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeamMember", // Reference to the TeamMember model
    },
  ],
  // ... (other fields)
});

const Tasklist = mongoose.model("Task", taskSchema);

module.exports = Tasklist;
