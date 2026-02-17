# RED-MD Bot Rebuild Analysis

## Requirements Summary

### Core Requirements
- **Platform**: WhatsApp using Baileys library
- **Command Handler Structure**: `red.bot({ cmd, desc, fromMe, type, react, filename })`
- **Session Management**: Must use SESSION_ID from .env, no auto-pairing
- **Database**: MongoDB for user balance, gambling cooldowns, group settings, permissions
- **Bot Name**: RED-MD
- **Creator**: vhadau_t (vhadau-dev)

### Session & Pairing System
- Bot ONLY starts if SESSION_ID exists in .env
- Check `process.env.SESSION_ID` on startup
- If missing → show "❌ SESSION_ID not found. Please pair your bot." → exit
- If expired/invalid → show "⚠️ Session expired, please get a new one." → exit
- No auto-pairing logic
- Session must be reusable across restarts
- Must allow/use any session set in env

### Database Requirements
- MongoDB (preferred) or database defined in config.js/.env
- Must store:
  - User balance
  - Gambling cooldowns
  - Group settings
  - Owner & admin permissions
- Database connection required before bot starts
- If database fails → bot must stop with error message

### Command Categories

#### 1. Gambling Commands (15)
1. balance
2. bet
3. gamble
4. dice
5. slots
6. coinflip
7. daily
8. weekly
9. leaderboard
10. give
11. rob
12. deposit
13. withdraw
14. resetbalance
15. gamblehelp

#### 2. Fun Commands (14)
1. joke
2. meme
3. quote
4. fact
5. roast
6. compliment
7. ship
8. emoji
9. truth
10. dare
11. rate
12. ascii
13. say
14. funhelp

#### 3. Owner Commands (15)
1. addmod
2. mods (can be used by anyone - lists all available mods)
3. delmod
4. setprefix
5. eval
6. shell
7. restart
8. shutdown
9. setdb
10. backupdb
11. setmode
12. banuser
13. unbanuser
14. broadcast
15. ownerhelp

#### 4. Group Commands (15)
1. antilink
2. welcome
3. goodbye
4. kick
5. mute
6. unmute
7. promote
8. demote
9. tagall
10. hidetag
11. poll
12. rules
13. setrules
14. lock
15. grouphelp

### Permissions
- `fromMe: true` → owner-only
- Group admins can access some group commands
- Owner commands must NEVER be usable by normal users
- Gambling commands must have cooldowns stored in database

### Configuration
- **config.js** must include:
  - owners array
  - bot name
  - prefix
  - database URL
  - default currency
  - RED_IMAGE (URL for images used in menu, mods, etc.)
- **.env** must include:
  - SESSION_ID
  - MONGO_URI (or database URI)

### Error Handling
- Unknown command → friendly error message
- Missing permissions → clear permission message
- Database error → stop bot safely
- Invalid session → pairing required message

### Code Style
- Modular command files
- Each command in its own file
- Commands grouped by category folders
- Clean logging on startup
- No hardcoded secrets

## Design Decisions

### Project Structure
```
RED-MD/
├── commands/
│   ├── gambling/      # 15 gambling commands
│   ├── fun/           # 14 fun commands
│   ├── owner/         # 15 owner commands
│   └── group/         # 15 group commands
├── lib/
│   ├── red.js        # Command handler
│   ├── loader.js      # Command loader
│   ├── database.js    # MongoDB manager
│   └── utils.js       # Utility functions
├── session/           # Auto-generated session files
├── .env.example       # Environment template
├── .gitignore
├── config.js          # Bot configuration
├── index.js           # Main entry point
├── package.json
└── README.md
```

### Technology Stack
- **WhatsApp Library**: @whiskeysockets/baileys (latest)
- **Database**: MongoDB with mongoose
- **Runtime**: Node.js v18+
- **Package Manager**: npm/pnpm

### Key Features
1. Strict session validation on startup
2. Database-driven gambling system with cooldowns
3. Role-based permission system
4. Modular command architecture
5. Image configuration for branding (RED_IMAGE)
6. Comprehensive error handling
7. Easy command addition/removal

## Implementation Plan

### Phase 1: Core System
- index.js with session validation
- config.js with all required settings
- red.js command handler
- database.js MongoDB connection
- loader.js command loader

### Phase 2: Command Implementation
- Gambling commands with cooldown system
- Fun commands with API integrations
- Owner commands with security checks
- Group commands with admin verification

### Phase 3: Documentation
- README.md with setup instructions
- .env.example template
- Command documentation
- Deployment guide
