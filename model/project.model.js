const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  projectManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userData", // Reference to the User model
  },
  teamMembers: [
    {
      team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TeamMember", // Reference to the TeamMember model
      },
      role: String, // Specify the role for each team member
    },
  ],
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task", // Reference to the Task model
    },
  ],
  // ... (other fields)
});

const Projectlist = mongoose.model("projectlist", projectSchema);

module.exports = { Projectlist };
