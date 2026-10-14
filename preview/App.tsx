import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Player, PlayerRef } from "@remotion/player";
import { Video } from "../src/Video";
import { ALTURA, CENAS, DURACAO_TOTAL, FPS, LARGURA, TITULO } from "../src/dados";

const css = `
:root { --bg:#0B0F1A; --card:#161D33; --txt:#fff; --muted:rgba(255,255,255,.65); --acc:#FFD60A; --accTxt:#FFD60A; color-scheme:dark; }
@media (prefers-color-scheme: light) { :root:not([data-theme="dark"]) { --bg:#F2F3F7; --card:#fff; --txt:#12141C; --muted:#4A4F5E; --accTxt:#8A6D00; color-scheme:light; } }
:root[data-theme="light"] { --bg:#F2F3F7; --card:#fff; --txt:#12141C; --muted:#4A4F5E; --accTxt:#8A6D00; color-scheme:light; }
* { box-sizing:border-box; }
body { margin:0; background:var(--bg); color:var(--txt); font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
.wrap { max-width:1100px; margin:0 auto; padding:20px 16px 40px; display:flex; gap:24px; flex-wrap:wrap; justify-content:center; }
.player { width:min(420px, 100%); align-self:flex-start; border-radius:18px; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,.4); }
.lado { flex:1; min-width:280px; max-width:560px; }
h1 { font-size:22px; margin:4px 0 4px; } p.sub { color:var(--muted); margin:0 0 16px; font-size:14px; }
.cena:focus-visible { outline:3px solid var(--acc); outline-offset:2px; }
.cena { width:100%; text-align:left; background:var(--card); color:var(--txt); border:2px solid transparent; border-radius:12px; padding:10px 12px; margin-bottom:8px; cursor:pointer; font:inherit; }
.cena.ativa { border-color:var(--acc); }
.cena b { display:block; font-size:13px; color:var(--accTxt); text-transform:uppercase; letter-spacing:.06em; }
.cena span { font-size:14px; color:var(--muted); }
`;

const fmt = (fr: number) => { const s = Math.floor(fr / FPS); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };

const App: React.FC = () => {
  const ref = useRef<PlayerRef>(null);
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const p = ref.current;
    if (!p) return;
    const h = (e: any) => setFrame(e.detail.frame);
    p.addEventListener("frameupdate", h);
    return () => p.removeEventListener("frameupdate", h);
  }, []);
  return (
    <>
      <style>{css}</style>
      <div className="wrap">
        <div className="player">
          <Player ref={ref} component={Video} durationInFrames={DURACAO_TOTAL} fps={FPS} compositionWidth={LARGURA} compositionHeight={ALTURA}
            controls style={{ width: "100%" }} clickToPlay doubleClickToFullscreen allowFullscreen />
        </div>
        <div className="lado">
          <h1>{TITULO}</h1>
          <p className="sub">Prévia ao vivo · 9:16 · {fmt(DURACAO_TOTAL)} · clique numa cena para pular</p>
          {CENAS.map((c) => (
            <button key={c.id} className={"cena" + (frame >= c.inicio && frame < c.inicio + c.duracao ? " ativa" : "")}
              onClick={() => { ref.current?.seekTo(c.inicio); ref.current?.play(); }}>
              <b>{fmt(c.inicio)} · {c.id}</b>
              <span>{c.texto}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

createRoot(document.getElementById("app")!).render(<App />);
