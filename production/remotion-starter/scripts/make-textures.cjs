// Generates paper + grain textures (original, procedural). Run: node scripts/make-textures.cjs
const {chromium} = require('playwright');
const path = require('path');
function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const r = rng(11);
let scratches='';
for(let i=0;i<70;i++){
  const x=r()*1080,y=r()*1920,len=20+r()*180,ang=(r()-.5)*1.2+ (r()<.3?1.57:0);
  const x2=x+Math.cos(ang)*len,y2=y+Math.sin(ang)*len;
  const cream=r()<.65;
  scratches+=`<path d="M${x.toFixed(1)} ${y.toFixed(1)} Q${((x+x2)/2+(r()-.5)*14).toFixed(1)} ${((y+y2)/2+(r()-.5)*14).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${cream?'#F3E8D8':'#2a0f10'}" stroke-opacity="${(0.18+r()*0.3).toFixed(2)}" stroke-width="${(0.6+r()*1.4).toFixed(1)}" fill="none" stroke-linecap="round"/>`;
}
const paper=`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920"><defs>
<filter id="dark" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.0028 0.0045" numOctaves="5" seed="7"/><feColorMatrix values="0 0 0 0 0.60  0 0 0 0 0.11  0 0 0 0 0.13  2.4 0 0 0 -0.82"/></filter>
<filter id="light" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.009 0.012" numOctaves="4" seed="3"/><feColorMatrix values="0 0 0 0 0.98  0 0 0 0 0.36  0 0 0 0 0.30  0 2.2 0 0 -0.95"/></filter>
<filter id="fiber" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9 0.35" numOctaves="3" seed="5"/><feColorMatrix values="0 0 0 0 0.2  0 0 0 0 0.04  0 0 0 0 0.05  0 0 1.4 0 -0.62"/></filter>
</defs><rect width="1080" height="1920" fill="#E83A36"/><rect width="1080" height="1920" filter="url(#dark)" opacity=".5"/><rect width="1080" height="1920" filter="url(#light)" opacity=".16"/><rect width="1080" height="1920" filter="url(#fiber)" opacity=".35"/></svg>`;
const grain=`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920"><defs>
<filter id="spk" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="2" seed="21"/><feColorMatrix values="0 0 0 0 0.08  0 0 0 0 0.05  0 0 0 0 0.06  14 0 0 0 -9.1"/></filter>
<filter id="spc" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" seed="44"/><feColorMatrix values="0 0 0 0 0.95  0 0 0 0 0.90  0 0 0 0 0.82  0 14 0 0 -9.4"/></filter>
</defs><rect width="1080" height="1920" filter="url(#spk)" opacity=".55"/><rect width="1080" height="1920" filter="url(#spc)" opacity=".5"/>${scratches}</svg>`;
(async()=>{
  const b=await chromium.launch();
  const p=await b.newPage({viewport:{width:1080,height:1920}});
  for(const [name,svg,omit] of [['paper_red',paper,false],['grain',grain,true]]){
    await p.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
    await p.screenshot({path:path.join('public/tex',name+'.png'),omitBackground:omit});
  }
  await b.close();
})();
