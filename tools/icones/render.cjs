// Converte os SVGs gerados por gerar.py em PNG usando o Chromium do Playwright.
const path=require('path'),fs=require('fs');
let pw;try{pw=require('playwright')}catch(e){pw=require(path.join(process.execPath,'..','..','lib','node_modules','playwright'))}
const jobs=JSON.parse(fs.readFileSync(path.join(__dirname,'_svg','jobs.json'),'utf8'));
(async()=>{const b=await pw.chromium.launch();const p=await b.newPage();
for(const [src,out,size] of jobs){await p.setViewportSize({width:size,height:size});
  await p.setContent(`<body style="margin:0">${fs.readFileSync(src,'utf8').replace('<svg ',`<svg width="${size}" height="${size}" `)}</body>`);
  await p.locator('svg').screenshot({path:out,omitBackground:true});}
await b.close();fs.rmSync(path.join(__dirname,'_svg'),{recursive:true});console.log(jobs.length+' ícones gerados');})();
