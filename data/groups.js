import fs from 'fs';
import path from 'path';

// Path to the JSON file
const filePath = path.join(new URL('.', import.meta.url).pathname, 'group.json');

// Load existing data or initialize empty object
let groups = {};
if (fs.existsSync(filePath)) {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    groups = JSON.parse(data);
  } catch (err) {
    console.error('❌ Failed to parse group.json, initializing empty object', err);
    groups = {};
  }
}

// Save function
function saveGroups() {
  try {
    fs.writeFileSync(filePath, JSON.stringify(groups, null, 2), 'utf-8');
  } catch (err) {
    console.error('❌ Failed to save group.json', err);
  }
}

// Get or create group
function getGroup(jid) {
  if (!groups[jid]) {
    groups[jid] = {
      jid,
      antilink: false,
      welcome: true,
      goodbye: true,
      welcomeMessage: "Welcome @user to @group!",
      goodbyeMessage: "Goodbye @user!",
      mute: false,
      locked: false,
      rules: "No rules set yet."
    };
    saveGroups();
  }
  return groups[jid];
}

// Update group settings
function updateGroup(jid, settings) {
  const group = getGroup(jid);
  Object.assign(group, settings);
  saveGroups();
  return group;
}

// Export
export { groups, getGroup, updateGroup };