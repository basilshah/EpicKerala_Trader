import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const seedPath = join(process.cwd(), 'prisma', 'seed.ts');
let content = readFileSync(seedPath, 'utf-8');

// Remove certificationFiles JSON.stringify blocks
content = content.replace(/\s*certificationFiles:\s*JSON\.stringify\(\[[\s\S]*?\]\),?\n/g, '\n');

// Remove catalogs JSON.stringify blocks
content = content.replace(/\s*catalogs:\s*JSON\.stringify\(\[[\s\S]*?\]\),?\n/g, '\n');

// Clean up any double newlines created
content = content.replace(/\n{3,}/g, '\n\n');

writeFileSync(seedPath, content, 'utf-8');

console.log('✓ Removed all certificationFiles and catalogs dummy data from seed.ts');
console.log('✓ These fields will now be null unless users upload real files');
