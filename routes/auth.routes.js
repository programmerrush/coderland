const express = require("express");
const router = express.Router();
const authService = require("../services/auth.service");
const systemService = require("../services/system.service");

router.post("/join", async (req, res) => {
  try {
    let { uid, consent } = req.body;

    if (!uid || typeof uid !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Name/UID is required." });
    }

    // Alphanumeric check - relaxed to allow spaces for Names if needed,
    // but user requirement was previously alphanumeric.
    // "Name of the user" implies spaces might be needed.
    // Let's allow spaces for now.
    if (!/^[a-zA-Z0-9 ]+$/.test(uid)) {
      return res
        .status(400)
        .json({ success: false, message: "Name must be alphanumeric." });
    }

    const uidUtil = require("../utils/uid.util");
    uidUtil.saveUID(uid);

    await authService.joinClass(consent);
    // After joining, send system info immediately
    await systemService.sendSystemInfo();

    res.json({ success: true, redirect: "/dashboard.html" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
