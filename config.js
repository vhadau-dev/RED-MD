import 'dotenv/config';

const config = {
  // Bot Information
  BOT_NAME: process.env.BOT_NAME || "Riculu",
  OWNER_NAME: process.env.OWNER_NAME || "vhadau_t",
  VERSION: "1.0.0",

  // Command Configuration
  PREFIX: process.env.PREFIX || ".",

  // Owner Configuration
  OWNER: (process.env.OWNER || "27675859928")
    .split(',')
    .map(n => n.trim()),

  // Session Configuration
  SESSION_ID: process.env.SESSION_ID || "./session",

  // Image Configuration
  RED_IMAGE: process.env.RED_IMAGE || "https://d.uguu.se/HpAPramA.jpg",
  // Bot Behavior
  AUTO_READ: process.env.AUTO_READ === "true",
  AUTO_REACT: process.env.AUTO_REACT === "false",
  AUTO_TYPING: process.env.AUTO_TYPING === "true",
  MODS: (process.env.MODS || "27675859928"), 

  // Group Settings Defaults (still fine)
  DEFAULT_GROUP_SETTINGS: {
    antilink: true,
    welcome: false,
    goodbye: false,
    mute: false,
    locked: false
  },

  // Timezone
  TIMEZONE: process.env.TIMEZONE || "Africa/Lagos",

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || "info"
};

export default config;
