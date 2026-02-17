import red from '../../lib/red.js';
import { groups } from '../../data/groups.js';

red.bot({
  cmd: "demote",
  desc: "Demote an admin to member",
  fromMe: false,
  type: "group",
  react: "⬇️",
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
        text: '❌ Please mention a user to demote\nUsage: .demote @user'
      }, { quoted: msg });
    }
    
    try {
      await sock.groupParticipantsUpdate(sender, mentions, 'demote');
      
      const text = `⬇️ *User Demoted*\n\n` +
        `@${mentions[0].split('@')[0]} is no longer an admin.`;
      
      await sock.sendMessage(msg.key.remoteJid, { 
        text,
        mentions 
      }, { quoted: msg });
    } catch (error) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ Failed to demote user: ${error.message}`
      }, { quoted: msg });
    }
  }
});
