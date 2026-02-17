import red from '../../lib/red.js';
import config from '../../config.js';

red.bot({
  cmd: 'addmod',
  desc: 'Add a user to mods list',
  fromMe: false,
  type: 'owner',
  react: '✅',
  filename: import.meta.url,
  handler: async (sock, msg) => {
    // Get sender number
    const sender = msg.key.participant
      ? msg.key.participant.split('@')[0]
      : msg.key.remoteJid.split('@')[0];

    // Owner check
    if (!config.OWNERS.includes(sender)) {
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
        { text: '❌ You must mention a user to add as mod' },
        { quoted: msg }
      );
    }

    const user = mentioned[0].split('@')[0];

    // Check if user is already a mod
    const modsArray = config.MODS || [];
    if (modsArray.includes(user)) {
      return await sock.sendMessage(
        msg.key.remoteJid,
        { text: `⚠️ @${user} is already a mod`, mentions: mentioned },
        { quoted: msg }
      );
    }

    // Add user to mods list
    modsArray.push(user);
    config.MODS = modsArray; // update config
    process.env.MODS = modsArray.join(','); // keep .env string updated

    await sock.sendMessage(
      msg.key.remoteJid,
      {
        text: `✅ @${user} has been added to the mods list`,
        mentions: mentioned
      },
      { quoted: msg }
    );
  }
});