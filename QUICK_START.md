# RED-MD Quick Start Guide

Get your RED-MD bot running in 5 minutes!

---

## 🚀 Quick Setup

### Step 1: Clone or Download

```bash
git clone https://github.com/vhadau-dev/RED-MD.git
cd RED-MD
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure

Create `.env` file:

```env
SESSION_ID=your_session_id_here
MONGO_URI=mongodb://localhost:27017/redmd
RED_IMAGE=https://i.imgur.com/example.jpg
```

Edit `config.js`:

```javascript
OWNERS: ["YOUR_PHONE_NUMBER"], // e.g., "2347012345678"
```

### Step 4: Start Bot

```bash
npm start
```

---

## ✅ Checklist

- [ ] Node.js v18+ installed
- [ ] MongoDB running (local or cloud)
- [ ] `.env` file created with `SESSION_ID`
- [ ] Owner number set in `config.js`
- [ ] Dependencies installed (`npm install`)

---

## 🎯 First Commands to Try

Once your bot is running:

1. **Check if bot is alive:**
   - Send: `.balance`
   - You should get your balance

2. **Test owner commands:**
   - Send: `.mods`
   - Should show moderator list

3. **Test fun commands:**
   - Send: `.joke`
   - Should get a random joke

---

## ⚠️ Common Issues

### "SESSION_ID not found"
- Make sure `.env` file exists
- Verify `SESSION_ID` is set in `.env`

### "Database connection failed"
- Check if MongoDB is running
- Verify `MONGO_URI` in `.env`

### Commands not responding
- Check if prefix is correct (default: `.`)
- Verify bot has started successfully

---

## 📚 Next Steps

- Read [README.md](README.md) for full documentation
- Read [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed setup
- Customize commands in `commands/` folder
- Adjust settings in `config.js`

---

**Need help?** Check the console logs for error messages!
