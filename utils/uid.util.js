// In-memory storage for UID (no file persistence)
let currentUid = null;

function getUID() {
  return currentUid;
}

function saveUID(uid) {
  currentUid = uid;
  return currentUid;
}

function resetData() {
  currentUid = null;
  return null;
}

function getUIDData() {
  return { uid: currentUid };
}

module.exports = {
  getUID,
  saveUID,
  resetData,
  getUIDData,
};
