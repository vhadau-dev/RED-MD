import red from '../../lib/red.js';
import config from '../../config.js';

const ReadMore = String.fromCharCode(8206).repeat(4001);

red.bot({
  cmd: 'menu',
  desc: 'Show bot command menu',
  fromMe: false,
  type: 'general',
  react: '🌙',
  filename: import.meta.url,

  handler: async (sock, msg) => {
    const prefix = config.PREFIX || '.';
    const botName = config.BOT_NAME || 'Riculu';
    const ownerName = config.OWNER_NAME || 'vhadau_t';
    const status = config.PUBLIC ? 'Public' : 'Private';
    const menuImage = process.env.RED_IMAGE;

    // ✅ CORRECT SOURCE (matches index.js)
    const commands = red.getCommands();
    const categories = {};

    // Group commands by type
    for (const cmd of commands) {
      if (!cmd.cmd || !cmd.type) continue;

      if (!categories[cmd.type]) {
        categories[cmd.type] = [];
      }
      categories[cmd.type].push(cmd);
    }

    // Header
    let text = `
╭── ✦ ${botName} ✦ ─
│ *name :* ${botName}
│ *creater :* ${ownerName}
│ *prefix :* ${prefix}
│ *stetus :* ${status}
╰────────────
${ReadMore}
`;

    // Categories + commands
    for (const category of Object.keys(categories)) {
      text += `
╭── 📌 *${category.toUpperCase()}*
`;

      for (const c of categories[category]) {
        text += `│ ✦ ${prefix}${c.cmd}\n`;
      }

      text += `╰────────────\n`;
    }

    // Footer
    text += `
─────────────
☽ Play • Win • Repeat ☾
•°• Moonlight • Haven •°•
─────────────
*TIP:* use ${prefix}support fore true support
`;

    // Send menu (with image if set)
    if (menuImage) {
      await sock.sendMessage(
        msg.key.remoteJid,
        {
          image: { url: menuImage },
          caption: text
        },
        { quoted: msg }
      );
    } else {
      await sock.sendMessage(
        msg.key.remoteJid,
        { text },
        { quoted: msg }
      );
    }
  }
});