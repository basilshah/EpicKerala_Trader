import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const seedFilePath = join(process.cwd(), 'prisma', 'seed.ts');

try {
  console.log('Removing images from seed.ts...');
  
  let content = readFileSync(seedFilePath, 'utf-8');
  
  // Remove all images: JSON.stringify([...]), blocks
  // Match from "images: JSON.stringify([" to the closing "]),\n"
  const imagesRegex = /\s*images:\s*JSON\.stringify\(\[[\s\S]*?\]\),\n/g;
  
  const originalLength = content.length;
  content = content.replace(imagesRegex, '');
  const removedChars = originalLength - content.length;
  
  writeFileSync(seedFilePath, content, 'utf-8');
  
  console.log(`✓ Successfully removed all image references from seed.ts (removed ${removedChars} characters)`);
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}
