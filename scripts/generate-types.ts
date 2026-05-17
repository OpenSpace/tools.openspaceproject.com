import { compileFromFile } from 'json-schema-to-typescript';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const schemaUrl = 'https://raw.githubusercontent.com/sgct/sgct/master/sgct.schema.json';
const schemaPath = join(process.cwd(), 'src/sgct/util/sgct.schema.json');
const outputPath = join(process.cwd(), 'src/sgct/util/sgct.d.ts');

interface Decl {
  name: string;
  kind: 'type' | 'interface';
  /** Structural definition excluding the name, used for equality comparison */
  definition: string;
  /** First line index of this block, including any preceding JSDoc comment */
  lineStart: number;
  /** Last line index of this block, inclusive */
  lineEnd: number;
}

/** Returns true when a type-alias RHS is syntactically complete (balanced brackets + trailing `;`). */
function isTypeDefComplete(def: string): boolean {
  let depth = 0;
  for (const ch of def) {
    if (ch === '{' || ch === '[' || ch === '(') depth++;
    else if (ch === '}' || ch === ']' || ch === ')') depth--;
  }
  return depth === 0 && def.trimEnd().endsWith(';');
}

function parseDeclarations(ts: string): Decl[] {
  const lines = ts.split('\n');
  const decls: Decl[] = [];
  let i = 0;

  while (i < lines.length) {
    const lineStart = i;

    const line = lines[i];

    // Skip blank lines (lineStart will be reset on the next iteration)
    if (line === '' || line === undefined) {
      i++;
      continue;
    }

    // Skip JSDoc / block comments, keeping lineStart at the comment's first line
    if (line.trimStart().startsWith('/*')) {
      while (i < lines.length && !lines[i]!.includes('*/')) i++;
      if (i < lines.length) i++;
      if (i >= lines.length) break;
    }

    // Type alias: export type Name = ...;
    const typeMatch = line.match(/^export type (\w+) = (.*)$/);
    if (typeMatch) {
      const [, name, initialDef] = typeMatch;
      if (name === undefined || initialDef === undefined) {
        i++;
        continue;
      }
      let def = initialDef;
      while (!isTypeDefComplete(def)) {
        i++;
        def += '\n' + (lines[i] ?? '');
      }
      decls.push({
        name,
        kind: 'type',
        definition: def.trimEnd().slice(0, -1).trim(), // strip trailing ;
        lineStart,
        lineEnd: i
      });
      i++;
      continue;
    }

    // Interface: export interface Name { ... }
    const ifaceMatch = line.match(/^export interface (\w+)/);
    if (ifaceMatch) {
      const exportLine = i;
      let depth = 0;
      for (const ch of line) {
        if (ch === '{') depth++;
        else if (ch === '}') depth--;
      }
      while (depth > 0 && i < lines.length - 1) {
        i++;
        for (const ch of lines[i]!) {
          if (ch === '{') depth++;
          else if (ch === '}') depth--;
        }
      }
      // Compare only the body (from `{` onwards), not the interface name
      const braceIdx = lines[exportLine]!.indexOf('{');
      const bodyLines =
        braceIdx !== -1
          ? [lines[exportLine]!.slice(braceIdx), ...lines.slice(exportLine + 1, i + 1)]
          : lines.slice(exportLine, i + 1);
      decls.push({
        name: ifaceMatch[1]!,
        kind: 'interface',
        definition: bodyLines.join('\n'),
        lineStart,
        lineEnd: i
      });
      i++;
      continue;
    }

    i++;
  }

  return decls;
}

function applyAliases(text: string, aliasMap: Map<string, string>): string {
  let result = text;
  for (const [dup, canon] of aliasMap) {
    result = result.replace(new RegExp(`\\b${dup}\\b`, 'g'), canon);
  }
  return result;
}

/**
 * Removes duplicate type/interface declarations produced by json-schema-to-typescript.
 *
 * The library generates a new named type for every `$ref` usage site that carries a
 * sibling `title`, resulting in pairs like `CameraFieldOfView` / `CameraFieldOfView1`
 * with identical definitions. This function detects those duplicates via a fixed-point
 * iteration (needed because e.g. `HFovVFov1` references `HorizontalFieldOfView1`, which
 * is itself a duplicate of `HorizontalFieldOfView`) and removes them, replacing all
 * references to the numbered variant with the canonical name.
 */
function deduplicateTypes(ts: string): string {
  const decls = parseDeclarations(ts);
  const defMap = new Map<string, string>(decls.map((d) => [d.name, d.definition]));

  // Build alias map via fixed-point iteration
  const aliasMap = new Map<string, string>(); // FooN -> Foo
  let changed = true;
  while (changed) {
    changed = false;
    for (const [name, def] of defMap) {
      if (aliasMap.has(name)) continue;

      const m = name.match(/^(.+?)(\d+)$/);
      if (!m) continue;

      const [baseName] = m;
      if (!defMap.has(baseName)) continue;

      const normalize = (s: string) =>
        applyAliases(s, aliasMap).replace(/\s+/g, ' ').trim();

      if (normalize(def) === normalize(defMap.get(baseName)!)) {
        aliasMap.set(name, baseName);
        changed = true;
      }
    }
  }

  if (aliasMap.size === 0) return ts;

  // Mark lines belonging to duplicate declarations for removal
  const removeLines = new Set<number>();
  for (const decl of decls) {
    if (aliasMap.has(decl.name)) {
      for (let j = decl.lineStart; j <= decl.lineEnd; j++) removeLines.add(j);
    }
  }

  let result = ts
    .split('\n')
    .filter((_, idx) => !removeLines.has(idx))
    .join('\n');

  // Replace all remaining references to the removed names
  for (const [dup, canon] of aliasMap) {
    result = result.replace(new RegExp(`\\b${dup}\\b`, 'g'), canon);
  }

  return result.replace(/\n{3,}/g, '\n\n');
}

async function main() {
  const response = await fetch(schemaUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch schema: ${response.status} ${response.statusText}`);
  }

  writeFileSync(schemaPath, await response.text());
  const ts = await compileFromFile(schemaPath);
  writeFileSync(outputPath, deduplicateTypes(ts));
}

void main();
