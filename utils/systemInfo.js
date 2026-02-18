const { exec } = require("child_process");
const util = require("util");

const execAsync = util.promisify(exec);

async function getPythonVersion() {
  try {
    const { stdout } = await execAsync("python --version");
    return stdout.trim();
  } catch (error) {
    try {
      const { stdout } = await execAsync("python3 --version");
      return stdout.trim();
    } catch (err) {
      return "Not Installed";
    }
  }
}

module.exports = { getPythonVersion };
