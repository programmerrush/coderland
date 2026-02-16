const apiService = require("./api.service");
const uidUtil = require("../utils/uid.util");

async function joinClass(consent) {
  if (!consent) {
    throw new Error("You must agree to send system data.");
  }

  const uid = uidUtil.getUID();
  if (!uid) {
    throw new Error("UID not found. Please restart the application.");
  }

  try {
    await apiService.post("/join", { uid });
    return { success: true, message: "Joined class successfully." };
  } catch (error) {
    throw new Error("Failed to join class: " + error.message);
  }
}

module.exports = {
  joinClass,
};
