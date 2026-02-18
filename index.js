#!/usr/bin/env node
const express = require("express");
const path = require("path");
const fs = require("fs");
const os = require("os");
const readline = require("readline");
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

// Config Cache Logic
const CONFIG_DIR = path.join(os.homedir(), ".coderland");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

function loadSavedConfig() {
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      const raw = fs.readFileSync(CONFIG_FILE, "utf-8");
      return JSON.parse(raw);
    } catch (error) {
      return null;
    }
  }
  return null;
}

function saveConfig(data) {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR);
  }
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2));
}



<<<<<<< Updated upstream
// Function to start the server
const startServer = () => {
=======
// Interactive startup to get Server URL
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer));
  });
}

async function setUpServerUrl() {
  const saved = loadSavedConfig();

  if (saved && saved.serverUrl) {
    console.log(`\n Last Backend URL: ${saved.serverUrl}`);
    console.log("1) Use this");
    console.log("2) Enter new URL");

    const choice = await ask("Choose an option (1 or 2):");

    if (choice.trim() === "1") {
      config.serverUrl = saved.serverUrl;
      console.log(`Using saved Server URL: ${config.serverUrl}`);
      return;
    }
  }

  // First time or User choose to enter new URL
  const url = await ask("Enter Backend Server URL:");

  if (!url || !url.trim()) {
    console.log("No URL entered. Exiting.");
    process.exit(1);
  }

  const cleanUrl = url.trim().replace(/\/$/, "");
  config.serverUrl = cleanUrl;

  saveConfig({ serverUrl: cleanUrl });
  console.log(`Using Server URL: ${config.serverUrl}`);
}

// Start App

(async () => {
  await setUpServerUrl();
  rl.close();

>>>>>>> Stashed changes
  app.listen(config.port, () => {
    logger.info(`Client running on http://localhost:${config.port}`);
    logger.info(`Connected to Server at: ${config.serverUrl}`);
  });
<<<<<<< Updated upstream
};

// If Server URL is provided via env/config, skip interactive prompt
if (config.serverUrl) {
  console.log(`Using Server URL from config: ${config.serverUrl}`);
  startServer();
} else {
  // Interactive startup to get Server URL
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(`Enter Server URL : `, (url) => {
    if (url && url.trim()) {
      config.serverUrl = url.trim().replace(/\/$/, "");
    }

    console.log(`Using Server URL: ${config.serverUrl}`);
    rl.close();

    startServer();
  });
}
=======
})();


>>>>>>> Stashed changes
