// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const connectToDatabase = require("./utils/mongo");

const statsRouter = require("./route/stats");
const founderRouter = require("./route/founder");
const aboutRouter = require("./route/about");
const servicesRouter = require("./route/services");
const projectsRouter = require("./route/projects");
const eventsRouter = require("./route/events");
const getInvolvedRouter = require("./route/getInvolved");
const testimonialsRouter = require("./route/testimonials");
const meetingsRouter = require("./route/meetings");
const contributorsRouter = require("./route/contributors");
const teamDepartmentRouter = require("./route/teamdepartment");
const reelsRouter = require("./route/reel");
const blogRouter = require("./route/blog");
const commentRouter = require("./route/comment");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use(async (req, res, next) => {
  try {
    await connectToDatabase(process.env.MONGO_URL);
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Database connection error",
      error: err.message
    });
  }
});

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ROUTES
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is running and Database is connected!",
  });
});

app.use("/stats", statsRouter);
app.use("/founder", founderRouter);
app.use("/about", aboutRouter);
app.use("/services", servicesRouter);
app.use("/projects", projectsRouter);
app.use("/events", eventsRouter);
app.use("/get-involved", getInvolvedRouter);
app.use("/testimonials", testimonialsRouter);
app.use("/meetings", meetingsRouter);
app.use("/contributors", contributorsRouter);
app.use("/team-department", teamDepartmentRouter);
app.use("/reels", reelsRouter);
app.use("/blogs", blogRouter);
app.use("/comments", commentRouter);
app.use("/contact", require("./route/contact"));

// START SERVER
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;
// Force restart
