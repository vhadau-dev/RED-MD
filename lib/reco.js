import config from '../config.js';
import { users } from '../data/users.js';
import { mods } from '../data/mods.js';
import { groups } from '../data/groups.js';

const reco = {

  // Convert jid to number format +27675859928
  jidToNumber(jid) {
    return jid.includes('@') ? '+' + jid.split('@')[0] : '+' + jid;
  },

  // Check if the sender is a bot owner
  isOwner(sender) {
    const senderNumber = reco.jidToNumber(sender);
    return config.OWNERS.includes(senderNumber);
  },

  // Check if the sender is a moderator
  isMod(sender) {
    const senderNumber = reco.jidToNumber(sender);
    return mods.includes(senderNumber) || reco.isOwner(senderNumber);
  },

  // Check if the sender is in the group as an admin
  async isAdmin(sock, groupId, sender) {
    try {
      const groupMetadata = await sock.groupMetadata(groupId);
      const participant = groupMetadata.participants.find(p => p.id === sender);
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
        balance: config.STARTING_BALANCE,
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

  // Get all mods (tag format @+number)
  getMods() {
    return mods.map(num => `@${num}`);
  }
};

export default reco;