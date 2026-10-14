import React from "react";
import { Composition } from "remotion";
import { ALTURA, FPS, LARGURA } from "./dados";
import { VIDEOS } from "./videos";
import { Video } from "./Video";
import { ALT, DURACAO_TOTAL, FPS as FPS_5S, LARG, Projeto5S } from "./cinco-s/Projeto5S";

export const Root: React.FC = () => (
  <>
    {Object.entries(VIDEOS).map(([id, v]) => (
      <Composition key={id} id={id} component={Video} defaultProps={{ video: id }} durationInFrames={v.duracao} fps={FPS} width={LARGURA} height={ALTURA} />
    ))}
    <Composition id="Projeto5S" component={Projeto5S} durationInFrames={DURACAO_TOTAL} fps={FPS_5S} width={LARG} height={ALT} />
  </>
);
