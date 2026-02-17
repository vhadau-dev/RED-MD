// lib/red.js
import config from '../config.js';

class RedBot {
  constructor() {
    this.commands = new Map(); // Store commands
    this.sock = null;          // WhatsApp socket
  }

  // Set the socket
  setSock(sock) {
    this.sock = sock;
  }

  /**
   * Register a command
   * cmdConfig = {
   *   cmd: string,
   *   desc: string,
   *   fromMe: boolean | 'mod',
   *   type: string ('general', 'group', etc),
   *   react: string,
   *   filename: string,
   *   handler: async function(sock, msg, args, extra)
   * }
   */
  bot(cmdConfig) {
    const { cmd, desc, fromMe, type, react, filename, handler } = cmdConfig;

    if (!cmd || !handler) {
      console.error('❌ Command registration failed: cmd and handler are required');
      return;
    }

    this.commands.set(cmd.toLowerCase(), {
      cmd: cmd.toLowerCase(),
      desc: desc || 'No description',
      fromMe: fromMe || false, 
      type: type || 'general',
      react: react || '✅',
      filename: filename || 'unknown',
      handler
    });

    console.log(`✅ Loaded command: ${cmd} (${type})`);
  }

  // Handle incoming messages
  async handleMessage(sock, msg) {
    try {
      if (!msg.message) return;

      // Extract message text
      let text = '';
      const type = Object.keys(msg.message)[0];

      if (type === 'conversation') text = msg.message.conversation;
      else if (type === 'extendedTextMessage') text = msg.message.extendedTextMessage.text;
      else if (type === 'imageMessage') text = msg.message.imageMessage.caption || '';
      else if (type === 'videoMessage') text = msg.message.videoMessage.caption || '';

      if (!text) return;

      // Only process messages starting with PREFIX
      if (!text.startsWith(config.PREFIX)) return;

      const args = text.slice(config.PREFIX.length).trim().split(/\s+/);
      const commandName = args.shift().toLowerCase();

      const command = this.commands.get(commandName);
      if (!command) return;

      const sender = msg.key.remoteJid;
      const senderNumber = msg.key.participant || sender;
      const isGroup = sender.endsWith('@g.us');

      // Owner/mod checks from config
      const isOwner = config.OWNERS.includes(senderNumber.replace('@s.whatsapp.net', ''));
      const isMod = config.MODS?.includes(senderNumber.replace('@s.whatsapp.net', '')) || false;

      // Permissions
      if (command.fromMe === true && !isOwner) return;
      if (command.fromMe === 'mod' && !isOwner && !isMod) return;

      // Group admin check
      if (command.type === 'group' && isGroup && command.fromMe !== true) {
        const metadata = await sock.groupMetadata(sender);
        const participant = metadata.participants.find(p => p.id === senderNumber);
        const isAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin';
        if (!isAdmin && !isOwner && !isMod) return;
      }

      // React if enabled
      if (config.AUTO_REACT && command.react) {
        await sock.sendMessage(sender, { react: { text: command.react, key: msg.key } });
      }

      // Execute command
      await command.handler(sock, msg, args, { isOwner, isMod, isGroup, sender, senderNumber });

    } catch (err) {
      console.error('❌ Error handling message:', err);
    }
  }

  // Get all commands or by type
  getCommands(type = null) {
    if (type) return Array.from(this.commands.values()).filter(cmd => cmd.type === type);
    return Array.from(this.commands.values());
  }

  // Get single command
  getCommand(name) {
    return this.commands.get(name.toLowerCase());
  }
}

// Singleton instance
const red = new RedBot();
export default red;