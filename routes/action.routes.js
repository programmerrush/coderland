const express = require("express");
const router = express.Router();
const apiService = require("../services/api.service");
const uidUtil = require("../utils/uid.util");

// Raise Hand
router.post("/raise-hand", async (req, res) => {
  try {
    await apiService.post("/raise-hand", { timestamp: Date.now() });
    res.json({ success: true, message: "Hand raised!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send Message
router.post("/message", async (req, res) => {
  const { title, message } = req.body;

  if (!title || title.length > 5) {
    return res
      .status(400)
      .json({ success: false, message: "Title must be 1-5 characters." });
  }
  if (!message || message.length > 200) {
    return res
      .status(400)
      .json({ success: false, message: "Message must be 1-200 characters." });
  }

  try {
    await apiService.post("/message", {
      title,
      message,
      timestamp: Date.now(),
    });
    res.json({ success: true, message: "Message sent!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Reset Client
router.post("/reset", (req, res) => {
  try {
    uidUtil.resetData();
    res.json({ success: true, redirect: "/" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to reset client." });
  }
});

// Get Trainer Messages
router.get("/messages", async (req, res) => {
  try {
    // In real scenario, we might pass a timestamp or since param
    const response = await apiService.get("/messages");
    const messages = response.messages || [];
    res.json({ success: true, messages });
  } catch (error) {
    // Fallback or empty if error
    res.json({ success: false, messages: [] });
  }
});

module.exports = router;
