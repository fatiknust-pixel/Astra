import React from "react";
import { Composition } from "remotion";
import { ALTURA, DURACAO_TOTAL, FPS, LARGURA } from "./dados";
import { Video } from "./Video";

export const Root: React.FC = () => (
  <Composition id="Video" component={Video} durationInFrames={DURACAO_TOTAL} fps={FPS} width={LARGURA} height={ALTURA} />
);
