const si = require("systeminformation");
const apiService = require("./api.service");
const uidUtil = require("../utils/uid.util");

async function getSystemDetails() {
  const osInfo = await si.osInfo();
  const cpu = await si.cpu();
  const mem = await si.mem();
  const nodeVersion = process.version;

  return {
    os: `${osInfo.platform} ${osInfo.release}`,
    cpu: `${cpu.manufacturer} ${cpu.brand}`,
    totalRam: `${(mem.total / 1024 / 1024 / 1024).toFixed(2)} GB`,
    nodeVersion: nodeVersion,
    platform: process.platform,
  };
}

async function sendSystemInfo() {
  try {
    const details = await getSystemDetails();
    const systemData = {
      ...details,
      uid: uidUtil.getUID(),
    };

    await apiService.post("/system-info", systemData);
    return { success: true, message: "System info sent successfully." };
  } catch (error) {
    throw new Error("Failed to send system info: " + error.message);
  }
}

module.exports = {
  sendSystemInfo,
  getSystemDetails,
};
