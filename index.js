#!/usr/bin/env node
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
const { exec } = require("child_process");
const { version } = require("./package.json");

// Parse command-line arguments
const args = process.argv.slice(2);

// --version flag
if (args.includes("--version") || args.includes("-v")) {
  console.log(`coderland v${version}`);
  process.exit(0);
}

// --help flag
if (args.includes("--help") || args.includes("-h")) {
  console.log(`
  coderland v${version}

  Usage:
    coderland [options]

  Options:
    --url <url>      Set the server URL and open the browser
    --version, -v    Show the current version
    --help, -h       Show this help message

  Examples:
    coderland --url https://myserver.com/abc
  `);
  process.exit(0);
}

// Parse --url from command-line arguments or npm config
const urlFlagIndex = args.indexOf("--url");
const argUrl =
  urlFlagIndex !== -1 && args[urlFlagIndex + 1]
    ? args[urlFlagIndex + 1].trim()
    : null;
// npm start --url=VALUE sets process.env.npm_config_url
const npmUrl = process.env.npm_config_url || null;
const cliUrl = argUrl || npmUrl ? (argUrl || npmUrl).replace(/\/$/, "") : null;

if (cliUrl) {
  config.serverUrl = cliUrl;
}

// Open URL in the default browser
const openInBrowser = (url) => {
  const platform = process.platform;
  const cmd =
    platform === "win32"
      ? `start ${url}`
      : platform === "darwin"
        ? `open ${url}`
        : `xdg-open ${url}`;
  exec(cmd, (err) => {
    if (err) logger.error(`Failed to open browser: ${err.message}`);
  });
};

// Function to start the server
const startServer = (autoOpen = false) => {
  app.listen(config.port, () => {
    logger.info(`Client running on http://localhost:${config.port}`);
    // logger.info(`Connected to Server at: ${config.serverUrl}`);
    if (autoOpen) {
      openInBrowser(`http://localhost:${config.port}`);
    }
  });
};

// If Server URL is provided via --url flag or env/config, skip interactive prompt
if (config.serverUrl) {
  console.log(`Using Server URL: ${config.serverUrl}`);
  startServer(!!cliUrl);
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
