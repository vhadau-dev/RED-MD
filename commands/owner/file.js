import red from '../../lib/red.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createGzip } from 'zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

red.bot({
  cmd: 'red',
  desc: 'Create a zip of the entire bot files',
  fromMe: true,
  type: 'owner',
  react: '📦',
  filename: import.meta.url,
  handler: async (sock, msg) => {
    try {
      const botRoot = path.join(__dirname, '../../'); // Root folder of bot
      const outputFile = path.join(__dirname, 'RED-BOT.zip');
      const output = fs.createWriteStream(outputFile);
      const gzip = createGzip();

      const writeFileRecursive = async (dir) => {
        const items = fs.readdirSync(dir);
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stats = fs.statSync(fullPath);

          if (stats.isDirectory()) {
            await writeFileRecursive(fullPath);
          } else {
            const data = fs.readFileSync(fullPath);
            gzip.write(data);
          }
        }
      };

      await writeFileRecursive(botRoot);
      gzip.end();
      gzip.pipe(output);

      output.on('close', async () => {
        await sock.sendMessage(msg.key.remoteJid, {
          document: fs.readFileSync(outputFile),
          fileName: 'RED-BOT.zip',
          mimetype: 'application/zip'
        });
        fs.unlinkSync(outputFile); // Remove zip after sending
      });
    } catch (err) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ Failed to create bot zip: ${err.message}`
      }, { quoted: msg });
    }
  }
});