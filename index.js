#!/usr/bin/env node
const express = require("express");
const path = require("path");
const fs = require("fs");
const os = require("os");
const inquirer = require("inquirer").default;



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




// Function to start the server
const startServer = () => {
  app.listen(config.port, () => {
    logger.info(`Client running on http://localhost:${config.port}`);
    // logger.info(`Connected to Server at: ${config.serverUrl}`);
  });
};

const DATA_FILE = path.join(os.homedir(), ".codeland-links.json");

function readLinks() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
}



function saveLinks(links) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(links, null, 2));
}

async function chooseServerUrl() {
  let links = readLinks();

  const choices = [];

  for (const l of links) {
    choices.push({ name: l, value: l });
  }

  // Always add manual option
  choices.push({ name: "➕ Enter manually", value: "MANUAL" });

  console.log("DEBUG choices:", choices); // <-- TEMP DEBUG

  const { selected } = await inquirer.prompt([
    {
      type: "rawlist",
      name: "selected",
      message: "Select a Server URL (use ↑ ↓ and Enter):",
      choices,
      pageSize: 10,
    },
  ]);

  let finalUrl = selected;

  if (selected === "MANUAL") {
    const { manualUrl } = await inquirer.prompt([
      {
        type: "input",
        name: "manualUrl",
        message: "Enter Server URL:",
        validate: (input) => input.trim() !== "" || "URL cannot be empty",
      },
    ]);

    finalUrl = manualUrl.trim().replace(/\/$/, "");
  }

  if (finalUrl && !links.includes(finalUrl)) {
    links.push(finalUrl);
    saveLinks(links);
    console.log("✅ Server URL saved");
  }

  return finalUrl;
}


// If Server URL is provided via env/config, skip interactive prompt
(async () => {
  try {
    const url = await chooseServerUrl();
    config.serverUrl = url;
    console.log(`Using Server URL: ${config.serverUrl}`);
    startServer();
  } catch (err) {
    if (err && err.name === "ExitPromptError") {
      console.log("\n👋 Cancelled by user.");
      process.exit(0);
    } else {
      console.error("❌ Failed to start:", err);
      process.exit(1);
    }
  }
})();