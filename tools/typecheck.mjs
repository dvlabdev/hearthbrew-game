// npm run typecheck: TypeScript over our JSDoc (jsconfig.json, strict), with no project dependencies.
// npm can't install on the Google Drive disk, so locally TypeScript lives outside the repo, in
// %LOCALAPPDATA%/hearthbrew-tools (one-time install below). CI (no such folder) runs it through npx.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const VERSION = '5.9.3';
const toolsDir = process.env.LOCALAPPDATA ? join(process.env.LOCALAPPDATA, 'hearthbrew-tools') : '';
const localTsc = toolsDir && join(toolsDir, 'node_modules', 'typescript', 'bin', 'tsc');
const args = ['-p', 'jsconfig.json'];

let r;
if (localTsc && existsSync(localTsc)) r = spawnSync(process.execPath, [localTsc, ...args], { stdio: 'inherit' });
else if (process.env.CI) r = spawnSync('npx', ['-y', '-p', `typescript@${VERSION}`, 'tsc', ...args], { stdio: 'inherit', shell: true });
else {
  console.error(`TypeScript isn't installed for this project yet. One-time install, outside the Drive folder:\n  npm install --prefix "${toolsDir || '<a local folder>'}" typescript@${VERSION}`);
  process.exit(2);
}
if (r.status === 0) console.log('typecheck: 0 errors');
process.exit(r.status ?? 1);
