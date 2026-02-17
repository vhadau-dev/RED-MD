import config from '../config.js';
import { users } from '../data/users.js';
import { mods } from '../data/mods.js';
import { groups } from '../data/groups.js';

const reco = {
  // Convert jid to number format (e.g., 27675859928)
  jidToNumber(jid) {
    if (!jid) return '';
    return jid.split('@')[0];
  },

  // Check if the sender is the bot itself
  isSelf(sock, sender) {
    const botId = reco.jidToNumber(sock.user.id);
    const senderId = reco.jidToNumber(sender);
    return botId === senderId;
  },

  // Check if the sender is a bot owner
  isOwner(sender) {
    const senderNumber = reco.jidToNumber(sender);
    const owners = Array.isArray(config.OWNERS) ? config.OWNERS : config.OWNERS.split(',');
    return owners.map(o => o.trim()).includes(senderNumber);
  },

  // Check if the sender is a moderator
  isMod(sender) {
    const senderNumber = reco.jidToNumber(sender);
    // Mods can be from data/mods.js or from the .env MODS list
    const envMods = Array.isArray(config.MODS) ? config.MODS : (config.MODS ? config.MODS.split(',') : []);
    const allMods = [...new Set([...mods, ...envMods.map(m => m.trim())])];
    return allMods.includes(senderNumber) || reco.isOwner(sender);
  },

  // Check if the sender is in the group as an admin
  async isAdmin(sock, groupId, sender) {
    try {
      const groupMetadata = await sock.groupMetadata(groupId);
      const participant = groupMetadata.participants.find(p => reco.jidToNumber(p.id) === reco.jidToNumber(sender));
      return participant?.admin === 'admin' || participant?.admin === 'superadmin';
    } catch {
      return false;
    }
  },

  // Check if sender is a normal registered user
  isUser(sender) {
    const senderNumber = reco.jidToNumber(sender);
    return users[senderNumber] ? true : false;
  },

  // Get user data
  getUser(sender) {
    const senderNumber = reco.jidToNumber(sender);
    if (!users[senderNumber]) {
      users[senderNumber] = {
        number: senderNumber,
        balance: config.STARTING_BALANCE || 25000,
        lastDaily: null,
        lastWeekly: null,
        totalWins: 0,
        totalLosses: 0
      };
    }
    return users[senderNumber];
  },

  // Save user (update the object)
  saveUser(sender, data) {
    const senderNumber = reco.jidToNumber(sender);
    users[senderNumber] = { ...users[senderNumber], ...data };
    return users[senderNumber];
  },

  // Add mod
  addMod(sender) {
    const senderNumber = reco.jidToNumber(sender);
    if (!mods.includes(senderNumber)) mods.push(senderNumber);
    return true;
  },

  // Remove mod
  removeMod(sender) {
    const senderNumber = reco.jidToNumber(sender);
    const index = mods.indexOf(senderNumber);
    if (index > -1) mods.splice(index, 1);
    return true;
  },

  // Get all mods (tag format @number)
  getMods() {
    return mods.map(num => `@${num}`);
  }
};

export default reco;
