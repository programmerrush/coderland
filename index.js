const express = require("express");
const path = require("path");
const config = require("./config");
const logger = require("./utils/logger.util");

const authRoutes = require("./routes/auth.routes");
const systemRoutes = require("./routes/system.routes");
const actionRoutes = require("./routes/action.routes");

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/system", systemRoutes);
app.use("/api/action", actionRoutes);

// Root route to serve index.html (redundant with static, but explicit is good)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Dashboard route
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

const readline = require("readline");

// Interactive startup to get Server URL
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
// (default: ${config.serverUrl})
rl.question(`Enter Server URL : `, (url) => {
  if (url && url.trim()) {
    config.serverUrl = url.trim().replace(/\/$/, "");
  }

  console.log(`Using Server URL: ${config.serverUrl}`);
  rl.close();

  // Start server after configuration
  app.listen(config.port, () => {
    logger.info(`Client running on http://localhost:${config.port}`);
    // logger.info(`Connected to Server at: ${config.serverUrl}`);
  });
});
