import red from '../../lib/red.js';
import config from '../../config.js';

red.bot({
  cmd: 'mods',
  desc: 'Show mods list',
  fromMe: false,
  type: 'support',
  react: '👮‍♂️',
  filename: import.meta.url,
  handler: async (sock, msg) => {
    // Ensure MODS is an array
    const modsArray = (config.MODS || '').split(',').map(m => m.trim()).filter(Boolean);

    if (modsArray.length === 0) {
      return await sock.sendMessage(msg.key.remoteJid, { text: '❌ No mods have been set yet.' }, { quoted: msg });
    }

    const modsText = [];

    for (let i = 0; i < modsArray.length; i++) {
      const number = modsArray[i];
      const jid = number.includes('@') ? number : number + '@s.whatsapp.net';
      let status = '🔴 *Offline*';

      try {
        await sock.presenceSubscribe(jid);
        const presence = sock.presences?.[jid];
        if (presence?.lastKnownPresence === 'available') {
          status = '🟢 *Online*';
        }
      } catch (e) {
        status = '🔴 *Offline*';
      }

      modsText.push(`┃ ${i + 1}. 👤 @${number}\n┃    ┗ ${status}`);
    }

    const caption = `
*╭━━━〔 📌 Moonlight Haven 〕━━━╮*
*┃*
${modsText.join('\n')}
*┃*
*╰━━━━━━━━━━━━━━━━━━━━╯*
> ⚠️ Status may not be accurate
`;

    await sock.sendMessage(msg.key.remoteJid, {
      image: { url: config.RED_IMAGE },
      caption,
      mentions: modsArray.map(u => u + '@s.whatsapp.net')
    }, { quoted: msg });
  }
});