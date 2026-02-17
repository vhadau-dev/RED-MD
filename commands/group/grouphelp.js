import red from '../../lib/red.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import config from '../../config.js';

red.bot({
  cmd: 'grouphelp',
  desc: 'List all group commands with their descriptions',
  fromMe: false,
  type: 'support',
  react: '🛠️',
  filename: import.meta.url,
  handler: async (sock, msg) => {
    const commandsPath = join('./commands/group');
    let helpText = `✨🌙─── *GROUP COMMANDS* ───🌙✨\n\n`;

    try {
      const files = readdirSync(commandsPath).filter(f => f.endsWith('.js'));

      for (const file of files) {
        try {
          const commandModule = await import(join(commandsPath, file));
          const cmdObj = commandModule.default || commandModule;
          if (cmdObj.cmd && cmdObj.desc) {
            helpText += `📌 ${cmdObj.cmd}\n> ${cmdObj.desc}\n\n`;
          }
        } catch {
          // Skip files that fail to import
          continue;
        }
      }

      // Add RED_IMAGE header if exists
      const imageUrl = config.RED_IMAGE || null;

      if (imageUrl) {
        await sock.sendMessage(msg.key.remoteJid, {
          image: { url: imageUrl },
          caption: helpText
        }, { quoted: msg });
      } else {
        await sock.sendMessage(msg.key.remoteJid, { text: helpText }, { quoted: msg });
      }
    } catch (error) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ Failed to load group commands: ${error.message}`
      }, { quoted: msg });
    }
  }
});