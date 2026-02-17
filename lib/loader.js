import { readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import red from './red.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Recursively load all commands from commands/categories folder
 * and register them with red.bot
 */
async function loadCommands() {
  console.log('📦 Loading commands...');

  const commandsPath = join(__dirname, '../commands');
  let totalLoaded = 0;

  function walk(dir) {
    const items = readdirSync(dir);
    const files = [];

    for (const item of items) {
      const fullPath = join(dir, item);
      if (statSync(fullPath).isDirectory()) {
        files.push(...walk(fullPath));
      } else if (item.endsWith('.js')) {
        files.push(fullPath);
      }
    }

    return files;
  }

  const commandFiles = walk(commandsPath);

  // Group files by category for logging
  const categories = {};
  for (const file of commandFiles) {
    const parts = file.split(/[\\/]/);
    const catIndex = parts.indexOf('commands') + 1;
    const category = parts[catIndex] || 'uncategorized';
    if (!categories[category]) categories[category] = [];
    categories[category].push(file);
  }

  // Load commands category by category
  for (const [category, files] of Object.entries(categories)) {
    console.log(`\n📁 Loading ${category} commands (${files.length} files)...`);

    for (const filePath of files) {
      try {
        const fileUrl = pathToFileURL(filePath).href;
        const cmdModule = await import(fileUrl);

        // Check if the module has default export or red.bot registration
        if (!cmdModule) {
          console.warn(`⚠️ Command file ${filePath} does not export anything`);
          continue;
        }

        // If the command file calls red.bot inside, it already registers itself
        // So no extra action is needed here
        totalLoaded++;
      } catch (error) {
        console.error(`❌ Failed to load ${filePath}:`, error.message);
      }
    }
  }

  console.log(`\n✅ Successfully loaded ${totalLoaded} commands\n`);
  return totalLoaded;
}

export default loadCommands;