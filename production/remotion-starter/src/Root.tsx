import React from 'react';
import {Composition} from 'remotion';
import {AlfaazFilm} from './AlfaazFilm';
import {AlfaazProof} from './AlfaazProof';
export const Root: React.FC = () => <>
  <Composition id="AlfaazProof20" component={AlfaazProof} durationInFrames={480} fps={24} width={1080} height={1920} />
  <Composition
    id="AlfaazProofOfConcept"
    component={AlfaazFilm}
    durationInFrames={8400}
    fps={24}
    width={1080}
    height={1920}
  />
</>;
