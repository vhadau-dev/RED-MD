import red from '../../lib/red.js';
import { getGroup, updateGroup } from '../../data/groups.js';

red.bot({
  cmd: "unmute",
  desc: "Unmute the group (everyone can send messages)",
  fromMe: false,
  type: "group",
  react: "🔊",
  filename: import.meta.url,
  handler: async (sock, msg, args, { sender, isGroup }) => {
    if (!isGroup) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ This command can only be used in groups'
      }, { quoted: msg });
    }

    try {
      // Update the WhatsApp group to allow messages
      await sock.groupSettingUpdate(sender, 'not_announcement');

      // Get or create the group configuration
      const group = getGroup(sender);
      group.mute = false; // set mute to false in your JSON data
      updateGroup(sender, group); // persist changes

      const text = `🔊 *Group Unmuted*\n\nEveryone can send messages now.`;
      await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
    } catch (error) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ Failed to unmute group: ${error.message}`
      }, { quoted: msg });
    }
  }
});