// Genera `src/lib/api/generated/schema.ts` desde el OpenAPI del API.
//
//   pnpm types         regenera desde la copia versionada (`generated/openapi.json`)
//   pnpm types:sync    trae el openapi.json de `main` del API y regenera
//   pnpm types:check   falla si la copia versionada no coincide con schema.ts (CI)
//
// OPENAPI_SOURCE cambia el origen de `types:sync`: una URL o una ruta local,
// por ejemplo ../../backend/qa-reviewer-api/openapi.json.
import { readFile, writeFile } from 'node:fs/promises';

import openapiTS, { astToString } from 'openapi-typescript';
import { format, resolveConfig } from 'prettier';

const DIR = new URL('../src/lib/api/generated/', import.meta.url);
const SPEC = new URL('openapi.json', DIR);
const SCHEMA = new URL('schema.ts', DIR);
const DEFAULT_SOURCE =
  'https://raw.githubusercontent.com/kevin-martineze/qa-reviewer-api/main/openapi.json';
const HEADER =
  '// Generado por scripts/openapi-types.mjs desde generated/openapi.json. No editar a mano:\n' +
  '// corre `pnpm types:sync` cuando cambie el contrato del API.\n\n';

async function fetchSpec(source) {
  if (/^https?:\/\//.test(source)) {
    const res = await fetch(source);
    if (!res.ok) throw new Error(`${source} respondió ${res.status}`);
    return res.text();
  }
  return readFile(source, 'utf8');
}

async function render(specText) {
  const ast = await openapiTS(JSON.parse(specText));
  const path = SCHEMA.pathname;
  const options = (await resolveConfig(path)) ?? {};
  return format(HEADER + astToString(ast), { ...options, filepath: path });
}

const mode = process.argv[2] ?? 'generate';

if (mode === 'sync') {
  const text = await fetchSpec(process.env.OPENAPI_SOURCE ?? DEFAULT_SOURCE);
  JSON.parse(text);
  await writeFile(SPEC, text.endsWith('\n') ? text : `${text}\n`);
}

const spec = await readFile(SPEC, 'utf8');
const schema = await render(spec);

if (mode === 'check') {
  const current = await readFile(SCHEMA, 'utf8').catch(() => '');
  if (current !== schema) {
    console.error('schema.ts no coincide con openapi.json: corre `pnpm types`.');
    process.exit(1);
  }
} else {
  await writeFile(SCHEMA, schema);
}
