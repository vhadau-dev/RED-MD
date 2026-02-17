import red from '../../lib/red.js';
import { getGroup, updateGroup } from '../../data/groups.js';

red.bot({
  cmd: "setrules",
  desc: "Set group rules",
  fromMe: false,
  type: "group",
  react: "📝",
  filename: import.meta.url,
  handler: async (sock, msg, args, { sender, isGroup }) => {
    if (!isGroup) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ This command can only be used in groups'
      }, { quoted: msg });
    }

    const rules = args.join(' ');
    if (!rules) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ Please provide rules to set\nUsage: .setrules <rules text>'
      }, { quoted: msg });
    }

    // Get group config or create default if not exists
    const group = getGroup(sender);
    group.rules = rules; // set the new rules

    // Save the updated group config
    updateGroup(sender, group);

    const text = `📝 *Rules Updated*\n\n${rules}`;
    await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
  }
});