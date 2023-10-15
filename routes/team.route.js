const express = require("express");
const teamrouter = express.Router();
const TeamMember = require("../model/team.model");
const { authenticateUser, requireRole } = require("../middleware/auth");
// Route to add a new team member
teamrouter.post(
  "/addteam",
  authenticateUser,
  requireRole(["Admin", "ProjectManager"]),
  async (req, res) => {
    try {
      const { teamName, userIds } = req.body;

      // Create a new Team Member document with an array of user IDs
      const teamMember = new TeamMember({ teamName, userIds });

      // Save the Team Member to the database
      await teamMember.save();

      res.status(200).json({ message: "Team member added successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error adding team member" });
    }
  }
);

// teamrouter.get("/teams", async (req, res) => {
//   try {
//     const team = await TeamMember.find();
//     console.log(team);
//     res.status(200).json({ teams: team });
//   } catch (error) {
//     res.status(500).json({ error: "Unable to retrieve users" });
//   }
// });
teamrouter.get("/teams", async (req, res) => {
  try {
    // Use the `populate` method to retrieve user data for each team member
    const teams = await TeamMember.find().populate("userIds", "name"); // Replace 'name' with the fields you want to retrieve from UserData

    console.log(teams);
    res.status(200).json({ teams });
  } catch (error) {
    res.status(500).json({ error: "Unable to retrieve teams and users" });
  }
});
// Other routes related to Team Members can be defined here

teamrouter.get("/:teamId", async (req, res) => {
  try {
    const teamId = req.params.teamId;

    // Query the team data and populate the 'members' field with user details
    const team = await TeamMember.findById(teamId).populate("userIds", "name");

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }
    // console.log(team.userIds);
    let userData = team.userIds;
    // console.log(userData.name);
    // Extract the usernames from the populated 'members' field
    const usernames = userData.map((member) => member.name);
    const userids = userData.map((ids) => ids._id);
    // console.log(usernames);
    // console.log(userids);

    res.status(200).json({ team: team, userName: usernames, userids: userids });
  } catch (error) {
    console.error("Error retrieving team data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
teamrouter.delete("/:teamMemberId", async (req, res) => {
  try {
    const teamMemberId = req.params.teamMemberId;
    const deletedTeamMember = await TeamMember.findByIdAndRemove(teamMemberId);

    if (!deletedTeamMember) {
      return res.status(404).json({ message: "Team Member not found" });
    }

    res.status(200).json({ message: "Team Member deleted successfully" });
  } catch (error) {
    console.error("Error deleting Team Member:", error);
    res.status(500).json({ error: "Unable to delete Team Member" });
  }
});
teamrouter.get("/teams/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find teams that include the specified user ID
    const teams = await TeamMember.find({ userIds: userId })
      .select("teamName")
      .populate("userIds");
    console.log(teams);
    res.status(200).json({ isError: false, teams });
  } catch (error) {
    res.status(500).json({
      isError: true,
      message: "An error occurred while fetching teams",
    });
  }
});
module.exports = teamrouter;
