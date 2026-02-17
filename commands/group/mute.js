import red from '../../lib/red.js';
import { groups } from '../../data/groups.js';

red.bot({
  cmd: "mute",
  desc: "Mute the group (only admins can send messages)",
  fromMe: false,
  type: "group",
  react: "🔇",
  filename: import.meta.url,
  handler: async (sock, msg, args, { sender, isGroup }) => {
    if (!isGroup) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ This command can only be used in groups'
      }, { quoted: msg });
    }
    
    try {
      await sock.groupSettingUpdate(sender, 'announcement');
      
      const group = await db.getGroup(sender);
      group.mute = true;
      await group.save();
      
      const text = `🔇 *Group Muted*\n\nOnly admins can send messages now.`;
      
      await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
    } catch (error) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ Failed to mute group: ${error.message}`
      }, { quoted: msg });
    }
  }
});
