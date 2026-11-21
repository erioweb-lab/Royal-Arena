const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'../royal-arena');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const active=[...html.matchAll(/<script\b[^>]*src="([^"]+)"/g)].map(m=>m[1].split('?')[0]).filter(s=>!s.startsWith('http'));
let bad=0;
for(const file of active){const f=path.join(root,file);if(!fs.existsSync(f)){console.error('MISSING',file);bad++;continue;}const s=fs.readFileSync(f,'utf8');try{new vm.Script(s,{filename:file});}catch(e){console.error('PARSE',file,e.message);bad++;}if(Buffer.byteLength(s)>260000){console.error('BUDGET',file);bad++;}}
for(const file of ['js/g11-camera.js','js/g12-camera-ui.js','assets/camera.css']){
 if(!html.includes(file)){console.error('SHELL_REF',file);bad++;}
 if(!fs.readFileSync(path.join(root,'sw.js'),'utf8').includes(file)){console.error('SW_REF',file);bad++;}
}
const source=fs.readFileSync(path.join(root,'js/g1a-art-assets.js'),'utf8');
for(const marker of ['__RA_AUDIO',"'touchstart',unlock",'ra_muted'])if(!source.includes(marker)){console.error('AUDIO_MARKER',marker);bad++;}
console.log('ACTIVE-RESOURCES:'+(bad?'FAIL':'OK'),'activeScripts='+active.length,'failures='+bad);
process.exit(bad?1:0);
