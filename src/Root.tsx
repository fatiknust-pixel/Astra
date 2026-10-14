import React from "react";
import { Composition } from "remotion";
import { ALTURA, FPS, LARGURA } from "./dados";
import { VIDEOS } from "./videos";
import { Video } from "./Video";

export const Root: React.FC = () => (
  <>
    {Object.entries(VIDEOS).map(([id, v]) => (
      <Composition key={id} id={id} component={Video} defaultProps={{ video: id }} durationInFrames={v.duracao} fps={FPS} width={LARGURA} height={ALTURA} />
    ))}
  </>
);
