import red from '../../lib/red.js';

red.bot({
  cmd: "tagall",
  desc: "Tag all group members",
  fromMe: false,
  type: "group",
  react: "📢",
  filename: import.meta.url,
  handler: async (sock, msg, args, { sender, isGroup }) => {
    if (!isGroup) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ This command can only be used in groups'
      }, { quoted: msg });
    }
    
    const message = args.join(' ') || 'Attention everyone!';
    
    try {
      const groupMetadata = await sock.groupMetadata(sender);
      const participants = groupMetadata.participants.map(p => p.id);
      
      let text = `📢 *Tag All*\n\n${message}\n\n`;
      participants.forEach(p => {
        text += `@${p.split('@')[0]} `;
      });
      
      await sock.sendMessage(msg.key.remoteJid, { 
        text,
        mentions: participants 
      }, { quoted: msg });
    } catch (error) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ Failed to tag all: ${error.message}`
      }, { quoted: msg });
    }
  }
});
