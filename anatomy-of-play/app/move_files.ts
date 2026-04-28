import fs from 'fs';
import path from 'path';

function findFiles(dir, match) {
  for (const f of fs.readdirSync(dir)) {
    if (f === 'node_modules' || f === '.git') continue;
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) findFiles(p, match);
    else if (p.match(match)) console.log(p);
  }
}
findFiles('.', /grasp/i);
