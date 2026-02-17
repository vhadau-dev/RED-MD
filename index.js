import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  DisconnectReason,
  delay,
  Browsers
} from '@whiskeysockets/baileys';

import pino from 'pino';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import chalk from 'chalk';

import red from './lib/red.js';
import loadCommands from './lib/loader.js';
import config from './config.js';

const SESSION_PATH = path.resolve(config.SESSION_ID || './session');

if (!fs.existsSync(SESSION_PATH)) {
  fs.mkdirSync(SESSION_PATH, { recursive: true });
}

console.log(chalk.cyan(`
╔══════════════════════════════╗
║        RED-MD BOT           ║
║      Stable Core Build       ║
╚══════════════════════════════╝
`));

function askNumber() {
  return new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question('📱 Enter WhatsApp number (no +): ', n => {
      rl.close();
      resolve(n.replace(/[^0-9]/g, ''));
    });
  });
}

async function startBot() {
  await loadCommands();

  const { state, saveCreds } = await useMultiFileAuthState(SESSION_PATH);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
    },
    browser: Browsers.ubuntu('Chrome'),
    markOnlineOnConnect: true,
    syncFullHistory: false
  });

  red.setSock(sock);

  if (!state.creds.registered) {
    console.log('\n🔗 Pair your WhatsApp account');
    const number = await askNumber();

    console.log('⏳ Requesting pairing code...');
    await delay(2000);

    const code = await sock.requestPairingCode(number);
    console.log(chalk.green(`\n✅ PAIRING CODE: ${code}\n`));
    console.log('Open WhatsApp → Linked Devices → Link with phone number');
  }

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'open') {
      console.log(chalk.green('\n✅ Bot connected & ready'));
      console.log(`📦 Commands loaded: ${red.getCommands().length}\n`);
    }

    if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode;
      if (reason === DisconnectReason.loggedOut) {
        console.log('❌ Logged out. Delete session & restart.');
        process.exit(0);
      }
      console.log('🔄 Reconnecting...');
      startBot();
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    await red.handleMessage(sock, msg);
  });
}

startBot().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\n👋 Shutting down...');
  process.exit(0);
});