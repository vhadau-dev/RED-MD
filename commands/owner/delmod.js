import red from '../../lib/red.js';
import config from '../../config.js';

red.bot({
  cmd: 'delmod',
  desc: 'Remove a user from mods list',
  fromMe: false,
  type: 'owner',
  react: '🗑️',
  filename: import.meta.url,
  handler: async (sock, msg) => {
    // Get sender number
    const sender = msg.key.participant
      ? msg.key.participant.split('@')[0]
      : msg.key.remoteJid.split('@')[0];

    // Only owners can use this
    if (!config.OWNER.includes(sender)) {
      return await sock.sendMessage(
        msg.key.remoteJid,
        { text: '❌ Only bot owners can use this command' },
        { quoted: msg }
      );
    }

    // Check if someone is mentioned
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    if (!mentioned || mentioned.length === 0) {
      return await sock.sendMessage(
        msg.key.remoteJid,
        { text: '❌ You must mention a user to remove from mods' },
        { quoted: msg }
      );
    }

    const user = mentioned[0].split('@')[0];

    // Check if user is a mod
    const modsArray = config.MODS || [];
    if (!modsArray.includes(user)) {
      return await sock.sendMessage(
        msg.key.remoteJid,
        { text: `⚠️ @${user} is not a mod`, mentions: mentioned },
        { quoted: msg }
      );
    }

    // Remove user from mods list
    config.MODS = modsArray.filter(u => u !== user);
    process.env.MODS = config.MODS.join(',');

    await sock.sendMessage(
      msg.key.remoteJid,
      {
        text: `✅ @${user} has been removed from mods`,
        mentions: mentioned
      },
      { quoted: msg }
    );
  }
});