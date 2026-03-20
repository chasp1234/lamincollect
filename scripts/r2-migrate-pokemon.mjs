#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(process.cwd());
const sourcePath = path.join(projectRoot, 'src/data/pokemon-vertical-lamincards-advanced.json');
const outputDir = path.join(projectRoot, 'tmp/r2');

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [k, v] = arg.split('=');
    return [k.replace(/^--/, ''), v ?? 'true'];
  }),
);

const baseUrl = (args.baseUrl || '').replace(/\/$/, '');
if (!baseUrl) {
  console.error('Missing --baseUrl. Example: --baseUrl=https://pub-xxxxxxxx.r2.dev');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
fs.mkdirSync(outputDir, { recursive: true });

const toFrontKey = (n) => `pokemon/vertical/front/${String(n).padStart(3, '0')}.jpg`;
const toBackKey = (n) => `pokemon/vertical/back/${String(n).padStart(3, '0')}.jpg`;

const uploadPlan = [];
const rewritten = {
  ...data,
  notes: `${data.notes} (served from Cloudflare R2)` ,
  cards: data.cards.map((card) => {
    const frontKey = toFrontKey(card.number);
    const backKey = toBackKey(card.number);
    uploadPlan.push({ key: frontKey, source: card.image });
    uploadPlan.push({ key: backKey, source: card.back });
    return {
      ...card,
      image: `${baseUrl}/${frontKey}`,
      back: `${baseUrl}/${backKey}`,
    };
  }),
};

const planJson = path.join(outputDir, 'upload-plan.json');
const planCsv = path.join(outputDir, 'upload-plan.csv');
const rewrittenJson = path.join(outputDir, 'pokemon-vertical-lamincards-advanced.r2.json');

fs.writeFileSync(planJson, JSON.stringify(uploadPlan, null, 2));
fs.writeFileSync(planCsv, ['key,source', ...uploadPlan.map((r) => `${r.key},${r.source}`)].join('\n'));
fs.writeFileSync(rewrittenJson, JSON.stringify(rewritten, null, 2));

console.log('Generated:');
console.log(`- ${planJson}`);
console.log(`- ${planCsv}`);
console.log(`- ${rewrittenJson}`);
console.log('\nNext: upload files to R2 with keys above, then replace src/data/pokemon-vertical-lamincards-advanced.json with rewritten JSON.');
