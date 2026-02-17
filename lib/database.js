import fs from 'fs';
import path from 'path';
import config from '../config.js';

// Root data directory
const dataDir = path.join(process.cwd(), 'data');

// File paths
const usersFile = path.join(dataDir, 'users.js');
const groupsFile = path.join(dataDir, 'groups.js');
const modsFile = path.join(dataDir, 'mods.js');

// Ensure root data directory exists
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// Initialize files with proper named exports
function initFile(filePath, exportName) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, `export const ${exportName} = {};`);
  }
}

initFile(usersFile, 'users');
initFile(groupsFile, 'groups');
initFile(modsFile, 'mods'); // mods can also be an object {} or array []

// Import in-memory objects
import { users } from './data/users.js';
import { groups } from './data/groups.js';
import { mods } from './data/mods.js';

// Save helper
function saveFile(filePath, varName, data) {
  const content = `export const ${varName} = ${JSON.stringify(data, null, 2)};`;
  fs.writeFileSync(filePath, content);
}

// Helper to extract user ID from JID
function getUserId(jid) {
  return jid.split('@')[0];
}

// -------- DATABASE OBJECT --------
const db = {

  // USERS
  getUser(jid) {
    const id = getUserId(jid);
    if (!users[id]) {
      users[id] = {
        id,
        balance: config.STARTING_BALANCE,
        lastDaily: 0,
        lastWeekly: 0,
        lastRob: 0,
        totalWins: 0,
        totalLosses: 0,
        totalGambled: 0,
        isBanned: false,
        banReason: null,
        createdAt: Date.now()
      };
      saveFile(usersFile, 'users', users);
    }
    return users[id];
  },

  saveUser(jid, data) {
    const id = getUserId(jid);
    users[id] = { ...users[id], ...data };
    saveFile(usersFile, 'users', users);
    return users[id];
  },

  // GROUPS
  getGroup(jid) {
    if (!groups[jid]) {
      groups[jid] = {
        jid,
        antilink: false,
        welcome: false,
        goodbye: false,
        welcomeMessage: 'Welcome @user to @group!',
        goodbyeMessage: 'Goodbye @user!',
        mute: false,
        locked: false,
        rules: 'No rules set yet.',
        createdAt: Date.now()
      };
      saveFile(groupsFile, 'groups', groups);
    }
    return groups[jid];
  },

  updateGroupSettings(jid, settings) {
    const group = db.getGroup(jid);
    Object.assign(group, settings);
    saveFile(groupsFile, 'groups', groups);
    return group;
  },

  // MODS
  getModerators() {
    return mods.map(jid => ({ jid }));
  },

  isModerator(jid) {
    return mods.includes(jid);
  },

  addModerator(jid) {
    if (!mods.includes(jid)) {
      mods.push(jid);
      saveFile(modsFile, 'mods', mods);
      return true;
    }
    return false;
  },

  removeModerator(jid) {
    const index = mods.indexOf(jid);
    if (index !== -1) {
      mods.splice(index, 1);
      saveFile(modsFile, 'mods', mods);
      return true;
    }
    return false;
  }
};

export default db;