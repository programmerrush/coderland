const fetch = require("node-fetch");
const config = require("../config");
const uidUtil = require("../utils/uid.util");
const logger = require("../utils/logger.util");

async function post(endpoint, body) {
  const uid = uidUtil.getUID();
  const url = `${config.serverUrl}${endpoint}`;

  // Ensure UID is in body for identification
  const finalBody = { ...body };
  if (!finalBody.uid && uid) {
    finalBody.uid = uid;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(finalBody),
      headers: {
        "Content-Type": "application/json",
        "x-uid": uid || "",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error(
        `API Error: ${response.status} ${response.statusText} - ${errorText}`,
      );
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    logger.error(`Network Error: ${error.message}`);
    throw error;
  }
}

async function get(endpoint) {
  const uid = uidUtil.getUID();
  const url = `${config.serverUrl}${endpoint}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-uid": uid || "",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error(
        `API Error: ${response.status} ${response.statusText} - ${errorText}`,
      );
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    logger.error(`Network Error: ${error.message}`);
    throw error;
  }
}

module.exports = {
  post,
  get,
};
