function log(message, type = "INFO") {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${type}] ${message}`);
}

function info(message) {
  log(message, "INFO");
}

function error(message) {
  log(message, "ERROR");
}

module.exports = {
  info,
  error,
};
