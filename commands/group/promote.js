import red from '../../lib/red.js';
import { extractMentions } from '../../lib/utils.js';

red.bot({
  cmd: "promote",
  desc: "Promote a user to admin",
  fromMe: false,
  type: "group",
  react: "⬆️",
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
        text: '❌ Please mention a user to promote\nUsage: .promote @user'
      }, { quoted: msg });
    }
    
    try {
      await sock.groupParticipantsUpdate(sender, mentions, 'promote');
      
      const text = `⬆️ *User Promoted*\n\n` +
        `@${mentions[0].split('@')[0]} is now an admin!`;
      
      await sock.sendMessage(msg.key.remoteJid, { 
        text,
        mentions 
      }, { quoted: msg });
    } catch (error) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ Failed to promote user: ${error.message}`
      }, { quoted: msg });
    }
  }
});
