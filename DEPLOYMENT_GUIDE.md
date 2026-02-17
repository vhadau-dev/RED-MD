# RED-MD Deployment Guide

This guide will help you deploy the RED-MD bot to your GitHub repository and get it running.

---

## 📦 What's Included

The complete RED-MD bot includes:

- **Core System Files:**
  - `index.js` - Main bot entry point with session validation
  - `config.js` - Bot configuration
  - `package.json` - Dependencies and scripts
  - `.env.example` - Environment variable template
  - `.gitignore` - Git ignore rules

- **Library Files (`lib/`):**
  - `red.js` - Command handler system
  - `loader.js` - Automatic command loader
  - `database.js` - MongoDB integration
  - `utils.js` - Utility functions

- **Commands:**
  - **Gambling (15 commands):** balance, bet, gamble, dice, slots, coinflip, daily, weekly, leaderboard, give, rob, deposit, withdraw, resetbalance, gamblehelp
  - **Fun (14 commands):** joke, meme, quote, fact, roast, compliment, ship, emoji, truth, dare, rate, ascii, say, funhelp
  - **Owner (15 commands):** addmod, mods, delmod, setprefix, eval, shell, restart, shutdown, setdb, backupdb, setmode, banuser, unbanuser, broadcast, ownerhelp
  - **Group (15 commands):** antilink, welcome, goodbye, kick, mute, unmute, promote, demote, tagall, hidetag, poll, rules, setrules, lock, grouphelp

**Total: 59 commands**

---

## 🔄 Deploying to GitHub

### Option 1: Replace All Files (Recommended)

1. **Clone your repository:**
   ```bash
   git clone https://github.com/vhadau-dev/RED-MD.git
   cd RED-MD
   ```

2. **Delete existing files (except .git):**
   ```bash
   # On Linux/Mac
   find . -not -path './.git/*' -not -name '.git' -delete
   
   # On Windows
   # Manually delete all files except the .git folder
   ```

3. **Copy new files:**
   ```bash
   # Copy all files from /home/ubuntu/red-md-rebuild/ to your repository
   cp -r /home/ubuntu/red-md-rebuild/* .
   cp /home/ubuntu/red-md-rebuild/.gitignore .
   cp /home/ubuntu/red-md-rebuild/.env.example .
   ```

4. **Commit and push:**
   ```bash
   git add .
   git commit -m "Complete rebuild: New RED-MD bot with 59 commands"
   git push origin main
   ```

### Option 2: Create a New Repository

1. **Initialize a new repository:**
   ```bash
   cd /home/ubuntu/red-md-rebuild
   git init
   git add .
   git commit -m "Initial commit: RED-MD bot"
   ```

2. **Add remote and push:**
   ```bash
   git remote add origin https://github.com/vhadau-dev/RED-MD.git
   git branch -M main
   git push -u origin main --force
   ```

---

## 🚀 Setting Up the Bot

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file:

```env
SESSION_ID=your_session_id_here
MONGO_URI=mongodb://localhost:27017/redmd
RED_IMAGE=https://your-image-url.com/image.jpg
```

### 3. Configure Bot Settings

Edit `config.js`:

```javascript
OWNERS: ["2347012345678"], // Replace with your WhatsApp number
```

### 4. Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB
sudo apt-get install mongodb

# Start MongoDB
sudo systemctl start mongodb
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Add it to `.env` as `MONGO_URI`

### 5. Start the Bot

```bash
npm start
```

---

## ⚠️ Important Notes

### Session ID

The bot **requires** a valid `SESSION_ID` in the `.env` file. It will not start without one.

- If `SESSION_ID` is missing → Bot exits with error message
- If `SESSION_ID` is invalid → Bot exits with error message
- The bot does NOT support auto-pairing

### Database Connection

The bot **requires** a working MongoDB connection. It will not start if the database connection fails.

### Owner Configuration

Make sure to set your WhatsApp number in `config.js` under the `OWNERS` array. This gives you access to all owner commands.

---

## 📊 Command Summary

| Category | Commands | Description |
|----------|----------|-------------|
| Gambling | 15 | Balance, betting, daily rewards, leaderboard |
| Fun | 14 | Jokes, quotes, games, entertainment |
| Owner | 15 | Bot management, moderation, system control |
| Group | 15 | Group settings, member management, rules |

---

## 🛠️ Customization

### Adding New Commands

1. Create a new file in the appropriate category folder:
   ```javascript
   // commands/fun/mycommand.js
   import red from '../../lib/red.js';
   
   red.bot({
     cmd: "mycommand",
     desc: "My custom command",
     fromMe: false,
     type: "fun",
     react: "✨",
     filename: import.meta.url,
     handler: async (sock, msg, args) => {
       await sock.sendMessage(msg.key.remoteJid, {
         text: 'Hello from my command!'
       }, { quoted: msg });
     }
   });
   ```

2. Restart the bot - the command will be loaded automatically!

### Modifying Configuration

Edit `config.js` to change:
- Bot name and prefix
- Currency settings
- Gambling rewards and cooldowns
- Default group settings

---

## 🐛 Troubleshooting

### Bot won't start

- Check Node.js version: `node --version` (should be v18+)
- Verify `SESSION_ID` is set in `.env`
- Verify MongoDB is running and accessible
- Check console for error messages

### Commands not working

- Verify prefix is correct in `config.js`
- Check user permissions
- Look for errors in console

### Database errors

- Verify `MONGO_URI` is correct in `.env`
- Ensure MongoDB is running
- Check database connection logs

---

## 📞 Support

For issues or questions:
- Check the README.md for documentation
- Review error messages in the console
- Verify all configuration files are correct

---

**Created by:** vhadau_t (vhadau-dev)  
**Repository:** https://github.com/vhadau-dev/RED-MD
