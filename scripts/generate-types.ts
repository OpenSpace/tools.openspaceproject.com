import { compileFromFile } from 'json-schema-to-typescript';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const schemaUrl = 'https://raw.githubusercontent.com/sgct/sgct/master/sgct.schema.json';
const schemaPath = join(process.cwd(), 'src/sgct/util/sgct.schema.json');
const outputPath = join(process.cwd(), 'src/sgct/util/sgct.d.ts');

async function main() {
  const response = await fetch(schemaUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch schema: ${response.status} ${response.statusText}`);
  }

  writeFileSync(schemaPath, await response.text());
  const ts = await compileFromFile(schemaPath);
  writeFileSync(outputPath, ts);
}

void main();
