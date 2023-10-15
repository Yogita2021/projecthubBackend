// Update your Mongoose schema to store an array of user IDs
const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
  },
  userIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userData", // Reference to the User model (assuming you have a User schema)
      required: true,
    },
  ],
});

const TeamMember = mongoose.model("TeamMember", teamMemberSchema);

module.exports = TeamMember;
