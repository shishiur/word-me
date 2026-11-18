const {bundle}=require('@remotion/bundler');const {renderStill,selectComposition}=require('@remotion/renderer');
const t=require('../src/timing.json');
(async()=>{
 const b=await bundle({entryPoint:require('path').resolve('src/index.ts')});
 const browserExecutable='/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
 const c=await selectComposition({serveUrl:b,id:'AlfaazFull',browserExecutable,chromeMode:'headless-shell'});
 const ids=process.argv.slice(2);
 for(const s of t.scenes){ if(ids.length&&!ids.includes(s.id))continue;
  const a=Math.round(s.start*24), e=Math.round(s.end*24); const fr=a+Math.round((e-a)*(+process.env.FR||0.6));
  await renderStill({composition:c,serveUrl:b,output:`/tmp/claude-0/st_${s.id}.png`,frame:fr,browserExecutable,chromeMode:'headless-shell'});
  console.log(s.id,fr);}
})();
