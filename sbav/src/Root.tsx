import { Composition } from "remotion";
import { Video } from "./Video";
import { NARRACAO } from "./dados";
import "./tema";

// Apresentação do TCC em dois formatos; cada cena reorganiza o layout conforme a proporção.
export const Root = () => (
  <>
    <Composition id="SBAV" component={Video} durationInFrames={NARRACAO.total} fps={NARRACAO.fps} width={1920} height={1080} />
    <Composition id="SBAVVertical" component={Video} durationInFrames={NARRACAO.total} fps={NARRACAO.fps} width={1080} height={1920} />
  </>
);
