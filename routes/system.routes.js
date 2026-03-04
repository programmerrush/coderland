const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const config = require("../config");
const systemService = require("../services/system.service");
const uidUtil = require("../utils/uid.util");

// Return current server URL config to the frontend
router.get("/config", (req, res) => {
  res.json({ serverUrl: config.serverUrl || "" });
});

// Set server URL from the frontend and validate connection
router.post("/server-url", async (req, res) => {
  try {
    const { serverUrl } = req.body;
    if (!serverUrl || typeof serverUrl !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Server URL is required." });
    }

    const cleanUrl = serverUrl.trim().replace(/\/$/, "");

    // Validate connection to the server
    try {
      await fetch(cleanUrl, {
        method: "GET",
        timeout: 5000,
      });
      // Any response (including 401, 403, etc.) means the server is reachable
    } catch (fetchErr) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot connect to the server. Please check the URL and try again.",
      });
    }

    config.serverUrl = cleanUrl;
    res.json({ success: true, message: "Server URL set successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/status", (req, res) => {
  try {
    const uid = uidUtil.getUID();
    res.json({ uid });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get status." });
  }
});

router.post("/info", async (req, res) => {
  try {
    await systemService.sendSystemInfo();
    res.json({ success: true, message: "System info sent." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/preview", async (req, res) => {
  try {
    const details = await systemService.getSystemDetails();
    res.json(details);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
