import red from '../../lib/red.js';
import { getGroup, updateGroup } from '../../data/groups.js';
import config from '../../config.js';

red.bot({
  cmd: "welcome",
  desc: "Toggle or configure welcome messages",
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

    const group = getGroup(sender); // get or create the group config

    // If user types just ".welcome" -> show status & instructions
    if (!args[0]) {
      const status = group.welcome ? '✅ Enabled' : '❌ Disabled';
      const text = `👋 *Welcome Messages*\n\n` +
        `Status: ${status}\n\n` +
        `Current message:\n"${group.welcomeMessage}"\n\n` +
        `*Placeholders you can use in the welcome message:*\n` +
        `@user - Tag the new user\n@gname - Tag the group name\n@count - Total members\n@time - Current time\n@p - Show user profile\n\n` +
        `Commands:\n.welcome on - Enable welcome messages\n.welcome off - Disable welcome messages\n.welcomeset <message> - Set new welcome message`;
      
      return await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
    }

    // Handle ".welcome on" / ".welcome off"
    const arg = args[0].toLowerCase();
    if (arg === 'on' || arg === 'off') {
      group.welcome = arg === 'on';
      updateGroup(sender, group);
      
      const text = `👋 *Welcome Messages*\n\n` +
        `Status: ${group.welcome ? '✅ Enabled' : '❌ Disabled'}\n\n` +
        `Current message:\n"${group.welcomeMessage}"`;
      
      return await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
    }

    // Handle ".welcomeset <message>"
    if (arg === 'welcomeset') {
      args.shift(); // remove 'welcomeset'
      const newMessage = args.join(' ');
      if (!newMessage) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '❌ Please provide a welcome message.\nUsage: .welcomeset Welcome @user to @gname!'
        }, { quoted: msg });
      }

      group.welcomeMessage = newMessage;
      updateGroup(sender, group);

      const text = `👋 *Welcome Message Updated*\n\n` +
        `New message:\n"${group.welcomeMessage}"\n\n` +
        `Placeholders: @user, @gname, @count, @time, @p`;
      
      return await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
    }

    // If invalid argument
    return await sock.sendMessage(msg.key.remoteJid, {
      text: '❌ Invalid command option.\nUse .welcome to see usage instructions.'
    }, { quoted: msg });
  }
});