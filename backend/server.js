const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./src/config/db");
const startOverdueTaskJob = require("./src/jobs/overdueTaskJob");

const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const projectRoutes = require("./src/routes/projectRoutes");
const invitationRoutes = require("./src/routes/invitationRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");
const commentRoutes = require("./src/routes/commentRoutes");
const leaveRequestRoutes = require("./src/routes/leaveRequestRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/invitations" , invitationRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notifications",notificationRoutes);
app.use("/api/comments" , commentRoutes);
app.use("/api/leave-requests",leaveRequestRoutes);


app.get("/", (req, res) => {
  res.json({
    message: "TaskFlow API is running"
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await db.query("SELECT 1");

    console.log(
      "MySQL connected successfully"
    );

    startOverdueTaskJob();

    app.listen(PORT, () => {
      console.log(
        `TaskFlow server running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Database connection failed:",
      error.message
    );
  }
};

startServer();