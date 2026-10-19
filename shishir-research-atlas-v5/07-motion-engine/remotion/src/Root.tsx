import React from 'react';
import { Composition } from 'remotion';
import { Establishing } from './Establishing';

// P01-S01-M010: cinematic establishing sequence (motion.json). 8 s at 30 fps, 1920 × 1080.
export const Root: React.FC = () => (
  <>
    <Composition id="P01-S01-M010" component={Establishing} durationInFrames={240} fps={30} width={1920} height={1080} defaultProps={{ tour: ['skin', 'basket', 'tool'], generated: [] }} />
    <Composition id="P01-S01-M010-vertical" component={Establishing} durationInFrames={240} fps={30} width={1080} height={1350} defaultProps={{ tour: ['skin', 'basket', 'tool'], generated: [] }} />
  </>
);
