import red from '../../lib/red.js';
import { random, extractMentions } from '../../lib/utils.js';

red.bot({
  cmd: "ship",
  desc: "Ship two people together",
  fromMe: false,
  type: "fun",
  react: "💕",
  filename: import.meta.url,
  handler: async (sock, msg, args, { senderNumber }) => {
    const mentions = extractMentions(msg);
    
    if (mentions.length < 2) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ Please mention two users to ship\nUsage: .ship @user1 @user2'
      }, { quoted: msg });
    }
    
    const person1 = mentions[0];
    const person2 = mentions[1];
    
    const percentage = random(0, 100);
    
    let emoji = '';
    let message = '';
    
    if (percentage < 25) {
      emoji = '💔';
      message = 'Not meant to be...';
    } else if (percentage < 50) {
      emoji = '😐';
      message = 'Just friends maybe?';
    } else if (percentage < 75) {
      emoji = '💕';
      message = 'There\'s potential here!';
    } else if (percentage < 90) {
      emoji = '💖';
      message = 'Great match!';
    } else {
      emoji = '💞';
      message = 'Perfect couple!';
    }
    
    const bar = '█'.repeat(Math.floor(percentage / 5)) + '░'.repeat(20 - Math.floor(percentage / 5));
    
    const text = `💕 *Ship Calculator*\n\n` +
      `@${person1.split('@')[0]} 💕 @${person2.split('@')[0]}\n\n` +
      `${bar}\n` +
      `${percentage}% ${emoji}\n\n` +
      `${message}`;
    
    await sock.sendMessage(msg.key.remoteJid, { 
      text,
      mentions: [person1, person2]
    }, { quoted: msg });
  }
});
