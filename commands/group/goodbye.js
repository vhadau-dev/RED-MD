import red from '../../lib/red.js';
import { groups } from '../../data/groups.js';

red.bot({
  cmd: "goodbye",
  desc: "Toggle goodbye messages",
  fromMe: false,
  type: "group",
  react: "👋",
  filename: import.meta.url,
  handler: async (sock, msg, args, { sender, isGroup }) => {
    if (!isGroup) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ This command can only be used in groups'
      }, { quoted: msg });
    }

    // Retrieve the group's config from the data/groups.js object
    let group = groups[sender];
    if (!group) {
      // Create default group config if it doesn't exist
      group = {
        goodbye: false,
        goodbyeMessage: "Goodbye @user!",
      };
      groups[sender] = group;
    }

    // Toggle goodbye messages
    group.goodbye = !group.goodbye;

    // Save the updated groups object to the JSON file
    import('fs').then(fs => {
      fs.writeFileSync('./data/group.json', JSON.stringify(groups, null, 2));
    });

    const text = `👋 *Goodbye Messages*\n\n` +
      `Status: ${group.goodbye ? '✅ Enabled' : '❌ Disabled'}\n\n` +
      `${group.goodbye ? 'Leaving members will receive a goodbye message.' : 'Goodbye messages are now disabled.'}\n\n` +
      `Current message:\n"${group.goodbyeMessage}"`;

    await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
  }
});