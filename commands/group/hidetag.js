import red from '../../lib/red.js';

red.bot({
  cmd: "hidetag",
  desc: "Tag all members without showing tags",
  fromMe: false,
  type: "group",
  react: "👻",
  filename: import.meta.url,
  handler: async (sock, msg, args, { sender, isGroup }) => {
    if (!isGroup) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ This command can only be used in groups'
      }, { quoted: msg });
    }
    
    const message = args.join(' ') || 'Hidden tag message';
    
    try {
      const groupMetadata = await sock.groupMetadata(sender);
      const participants = groupMetadata.participants.map(p => p.id);
      
      await sock.sendMessage(msg.key.remoteJid, { 
        text: message,
        mentions: participants 
      }, { quoted: msg });
    } catch (error) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ Failed to send hidden tag: ${error.message}`
      }, { quoted: msg });
    }
  }
});
