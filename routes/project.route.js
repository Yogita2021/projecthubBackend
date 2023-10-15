const express = require("express");
const projectRouter = express.Router();
const { Projectlist } = require("../model/project.model");
// const { PlaylistMovieModel } = require("../model/playlistMovie.model");
const { authenticateUser, requireRole } = require("../middleware/auth");

// route for creating playlist

projectRouter.post(
  "/create",
  authenticateUser,
  requireRole(["Admin", "ProjectManager"]),
  async (req, res) => {
    try {
      const { name, description, startDate, endDate } = req.body;
      const ProjectList = new Projectlist({
        name,
        description,
        startDate,
        endDate,
      });
      await ProjectList.save();
      res.status(200).json({
        isError: false,
        msg: "Projectlist created !",
        Projectlist: ProjectList,
      });
    } catch (error) {
      res.status(400).json({
        isError: true,
        message: error.message,
      });
    }
  }
);
projectRouter.put("/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const updatedData = req.body;

    const updatedProject = await Projectlist.findByIdAndUpdate(
      projectId,
      updatedData,
      {
        new: true,
      }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Unable to update project" });
  }
});

projectRouter.get("/allProjects", async (req, res) => {
  try {
    const ProjectListData = await Projectlist.find();

    res.status(200).json({ isError: false, ProjectListData });
  } catch (error) {
    res.status(500).json({
      isError: true,
      message: "An error occurred while fetching playlists",
    });
  }
});
// Get a project by ID
projectRouter.get("/:id", async (req, res) => {
  const projectId = req.params.id;

  try {
    // Use the findById method to find the project by its ID
    const project = await Projectlist.findById(projectId);

    if (!project) {
      return res.status(404).json({
        isError: true,
        message: "Project not found",
      });
    }

    res.status(200).json({
      isError: false,
      project: project,
    });
  } catch (error) {
    res.status(500).json({
      isError: true,
      message: "An error occurred while fetching the project",
    });
  }
});

projectRouter.delete(
  "/:projectId",

  async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const deletedProject = await Projectlist.findByIdAndRemove(projectId);
      if (!deletedProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(200).json({
        message: "Project deleted successfully",
        project: deletedProject,
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: "Unable to delete project" });
    }
  }
);
module.exports = { projectRouter };
