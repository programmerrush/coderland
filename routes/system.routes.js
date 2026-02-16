const express = require("express");
const router = express.Router();
const systemService = require("../services/system.service");
const uidUtil = require("../utils/uid.util");

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
