// Audit des textes UI : ce contrôle ignore les imports techniques et les identifiants.
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
const root = join(process.cwd(), 'src');
const failures = [];
function walk(dir) {
 for (const entry of readdirSync(dir,{withFileTypes:true})) {
  const full=join(dir,entry.name);
  if(entry.isDirectory()){walk(full);continue;}
  if(!entry.name.endsWith('.tsx'))continue;
  const lines=readFileSync(full,'utf8').split(/\r?\n/);
  lines.forEach((line,index)=>{
   if(/^\s*import\b/.test(line))return;
   // Identifiants techniques et noms de fichiers ne sont pas des textes visibles.
   const cleaned=line.replace(/\bsupabase\b(?=\s*[.(])/g,'').replace(/supabaseClient/g,'');
   if(/\bSupabase\b/i.test(cleaned))failures.push(relative(process.cwd(),full)+':'+(index+1));
  });
 }
}
walk(root);
if(failures.length){console.error('Nom technique détecté dans une interface :\n'+failures.join('\n'));process.exitCode=1;}
else console.log('Contrôle des interfaces TSX : aucun nom technique trouvé.');
