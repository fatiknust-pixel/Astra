import { Composition } from "remotion";
import { Video } from "./Video";
import { NARRACAO } from "./dados";
import "./tema";

export const Root = () => (
  <Composition
    id="AstraPromo"
    component={Video}
    durationInFrames={NARRACAO.total}
    fps={NARRACAO.fps}
    width={1920}
    height={1080}
  />
);
