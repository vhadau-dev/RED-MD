import red from '../../lib/red.js';
import { groups } from '../../data/groups.js';

red.bot({
  cmd: "lock",
  desc: "Lock group settings (only admins can edit group info)",
  fromMe: false,
  type: "group",
  react: "🔒",
  filename: import.meta.url,
  handler: async (sock, msg, args, { sender, isGroup }) => {
    if (!isGroup) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ This command can only be used in groups'
      }, { quoted: msg });
    }
    
    try {
      await sock.groupSettingUpdate(sender, 'locked');
      
      const group = await db.getGroup(sender);
      group.locked = true;
      await group.save();
      
      const text = `🔒 *Group Locked*\n\nOnly admins can edit group info now.`;
      
      await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
    } catch (error) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ Failed to lock group: ${error.message}`
      }, { quoted: msg });
    }
  }
});
