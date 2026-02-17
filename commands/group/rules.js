import red from '../../lib/red.js';
import { getGroup } from '../../data/groups.js';

red.bot({
  cmd: "rules",
  desc: "View group rules",
  fromMe: false,
  type: "group",
  react: "📜",
  filename: import.meta.url,
  handler: async (sock, msg, args, { sender, isGroup }) => {
    if (!isGroup) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ This command can only be used in groups'
      }, { quoted: msg });
    }

    // Fetch group config or create default if not exists
    const group = getGroup(sender);

    const text = `📜 *Group Rules*\n\n${group.rules || "No rules set yet."}`;

    await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
  }
});