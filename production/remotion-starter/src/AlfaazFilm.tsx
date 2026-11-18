import React from 'react';
import {AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import scenes from './scenes.json';

const FPS = 24;
const W = 1080;
const H = 1920;
const PAINT = '#E83A36';
const CREAM = '#F3E8D8';
const BLACK = '#171415';
const ENABLE_PLACEHOLDER_CAPTION = true;
// IMPORTANT: this is a SILENT VISUAL STARTER. No voice/music is embedded.
// Record licensed VO and score and implement Audio (see 08_IMPLEMENTATION_CLAUDE_MUSE.md).
// The displayed caption is an *excerpt placeholder*, not a timed access caption.

type Scene = typeof scenes[number];

const RoughHeadline: React.FC<{text: string; localFrame: number}> = ({text,localFrame}) => {
  const enter = interpolate(localFrame,[0,9,18],[0,0.3,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const size = text.length > 15 ? 88 : text.length > 10 ? 112 : 158;
  return <div style={{position:'absolute',left:68,right:68,top:185,display:'flex',justifyContent:'center',opacity:enter}}>
    <div style={{fontFamily:'Impact, sans-serif',fontSize:size,fontWeight:900,color:CREAM,textAlign:'center',letterSpacing:'-0.016em',textTransform:'uppercase',lineHeight:1.02,filter:'drop-shadow(2px 1px 0 #38191a)',transform:`rotate(${Math.sin(localFrame/23)*0.7-1.1}deg)`}}>{text}</div>
  </div>;
};

const ScenePlate: React.FC<{scene:Scene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const index = parseInt(scene.id.slice(1),10);
  const subtle = 1.00+0.006*Math.sin(frame/39);
  // Each scene has an original SVG symbolic study. These are illustrative PLATES,
  // not production final art, and must be replaced with actual layered illustrations.
  const previewExcerpt = scene.narration.split(' ').slice(0,11).join(' ')+'...';
  return <AbsoluteFill style={{background:PAINT,overflow:'hidden'}}>
    <Img src={staticFile(`boards/${scene.id}.svg`)} style={{width:W,height:H,objectFit:'cover',transform:`scale(${subtle})`}} />
    <AbsoluteFill style={{background:'linear-gradient(to bottom, transparent 0%, transparent 68%, rgba(16,12,12,.16) 100%)'}}/>
    <RoughHeadline text={scene.hero_word} localFrame={frame}/>
    {ENABLE_PLACEHOLDER_CAPTION && <div style={{position:'absolute',left:100,right:100,bottom:260,padding:'16px 24px',background:'rgba(23,20,21,.73)',borderRadius:12,textAlign:'center',color:CREAM,fontSize:45,lineHeight:1.25,fontFamily:'Arial, sans-serif'}}>{previewExcerpt}</div>}
    <div style={{position:'absolute',left:40,bottom:65,fontSize:24,fontFamily:'Arial, sans-serif',color:CREAM,opacity:.8}}>STORYBOARD ONLY · {scene.id} · REPLACE ART / SYNC VO</div>
  </AbsoluteFill>;
};

export const AlfaazFilm: React.FC = () => <AbsoluteFill style={{background:BLACK}}>
 {scenes.map((scene) => {
   const start = Math.round(scene.start*FPS);
   const end = Math.round(scene.end*FPS);
   return <Sequence key={scene.id} from={start} durationInFrames={Math.max(1,end-start)}>
      <ScenePlate scene={scene}/>
    </Sequence>;
 })}
</AbsoluteFill>;
