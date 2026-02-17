import red from '../../lib/red.js';
import { extractMentions } from '../../lib/utils.js';

red.bot({
  cmd: "kick",
  desc: "Kick a user from the group",
  fromMe: false,
  type: "group",
  react: "👢",
  filename: import.meta.url,
  handler: async (sock, msg, args, { sender, isGroup }) => {
    if (!isGroup) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ This command can only be used in groups'
      }, { quoted: msg });
    }
    
    const mentions = extractMentions(msg);
    
    if (mentions.length === 0) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ Please mention a user to kick\nUsage: .kick @user'
      }, { quoted: msg });
    }
    
    try {
      await sock.groupParticipantsUpdate(sender, mentions, 'remove');
      
      const text = `👢 *User Kicked*\n\n` +
        `Removed: @${mentions[0].split('@')[0]}`;
      
      await sock.sendMessage(msg.key.remoteJid, { 
        text,
        mentions 
      }, { quoted: msg });
    } catch (error) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ Failed to kick user: ${error.message}`
      }, { quoted: msg });
    }
  }
});
