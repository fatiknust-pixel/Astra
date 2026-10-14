#!/usr/bin/env python3
"""Gera a narração de cada cena + o tempo de cada palavra (para a legenda).

Só regenera as cenas cujo texto/voz mudou (cache por hash), então editar uma
frase do roteiro custa segundos, não o vídeo inteiro.

Motores:
  edge   -> vozes neurais da Microsoft (pt-BR-AntonioNeural etc.). Mais natural.
            Tempo das palavras vem exato do próprio TTS.  (pip install edge-tts)
  kokoro -> modelo local/offline (pip install kokoro-onnx soundfile). Tempo das
            palavras estimado frase a frase.

Uso:
  python3 scripts/gerar_audio.py                  # motor edge
  python3 scripts/gerar_audio.py --motor kokoro --modelo PASTA_COM_MODEL_E_VOICES
  python3 scripts/gerar_audio.py --forcar gancho  # refaz só a cena 'gancho'
  python3 scripts/gerar_audio.py --video bolsonaro  # só um vídeo (padrão: todos em conteudo/)
"""
import argparse, asyncio, hashlib, json, os, re, subprocess, sys, tempfile

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


def duracao(arquivo):
    out = subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                   "-of", "default=nw=1:nk=1", arquivo])
    return float(out.strip())


async def via_edge(texto, voz, velocidade, destino):
    import edge_tts
    kwargs = {"rate": velocidade}
    if "boundary" in edge_tts.Communicate.__init__.__code__.co_varnames:
        kwargs["boundary"] = "WordBoundary"
    proxy = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
    if proxy:
        kwargs["proxy"] = proxy
    com = edge_tts.Communicate(texto, voz, **kwargs)
    palavras = []
    with open(destino, "wb") as f:
        async for c in com.stream():
            if c["type"] == "audio":
                f.write(c["data"])
            elif c["type"] == "WordBoundary":
                ini = c["offset"] / 1e7
                palavras.append({"p": c["text"], "i": round(ini, 3), "f": round(ini + c["duration"] / 1e7, 3)})
    return palavras


def via_kokoro(texto, voz, velocidade, destino, modelo):
    import numpy as np, soundfile as sf
    from kokoro_onnx import Kokoro
    global _KOKORO
    if "_KOKORO" not in globals():
        _KOKORO = Kokoro(os.path.join(modelo, "kokoro-v1.0.onnx") if os.path.exists(os.path.join(modelo, "kokoro-v1.0.onnx")) else os.path.join(modelo, "model.onnx"),
                         os.path.join(modelo, "voices-v1.0.bin") if os.path.exists(os.path.join(modelo, "voices-v1.0.bin")) else os.path.join(modelo, "voices.bin"))
    frases = [f for f in re.split(r"(?<=[.!?:])\s+", texto.strip()) if f]
    pedacos, palavras, t, sr = [], [], 0.0, 24000
    for frase in frases:
        audio, sr = _KOKORO.create(frase, voice=voz, speed=velocidade, lang="pt-br")
        # corta silêncio do começo/fim para a estimativa ficar mais justa
        idx = np.where(np.abs(audio) > 0.01)[0]
        if len(idx):
            audio = audio[max(0, idx[0] - int(0.03 * sr)): idx[-1] + int(0.05 * sr)]
        dur = len(audio) / sr
        toks = frase.split()
        pesos = [len(re.sub(r"\W", "", w)) + 2 + (3 if re.search(r"[,.;:!?]$", w) else 0) for w in toks]
        total, acc = sum(pesos), 0.0
        for w, peso in zip(toks, pesos):
            ini = t + dur * acc / total
            acc += peso
            palavras.append({"p": re.sub(r"[^\wÀ-ÿ%ª º-]", "", w), "i": round(ini, 3), "f": round(t + dur * acc / total, 3)})
        pausa = np.zeros(int(sr * (0.28 if frase[-1] in ".!?" else 0.15)), dtype=audio.dtype)
        pedacos += [audio, pausa]
        t += dur + len(pausa) / sr
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        sf.write(tmp.name, np.concatenate(pedacos), sr)
        subprocess.check_call(["ffmpeg", "-y", "-loglevel", "error", "-i", tmp.name, "-b:a", "128k", destino])
        os.unlink(tmp.name)
    return palavras


def gerar(video, a):
    ROTEIRO = os.path.join(RAIZ, "conteudo", video, "roteiro.json")
    PASTA_AUDIO = os.path.join(RAIZ, "public", video, "audio")
    SAIDA = os.path.join(RAIZ, "src", "gerado", video, "narracao.json")
    roteiro = json.load(open(ROTEIRO, encoding="utf-8"))
    voz = roteiro["voz"]
    os.makedirs(PASTA_AUDIO, exist_ok=True)
    anterior = json.load(open(SAIDA, encoding="utf-8")) if os.path.exists(SAIDA) else {"cenas": {}}

    if a.motor == "edge":
        voz_id, vel = voz["edge"], voz.get("velocidade", "+0%")
    else:
        voz_id, vel = voz["kokoro"], voz.get("kokoroVelocidade", 1.0)

    saida = {"motor": a.motor, "voz": voz_id, "cenas": {}}
    for cena in roteiro["cenas"]:
        cid, texto = cena["id"], cena["texto"]
        h = hashlib.sha1(f"{a.motor}|{voz_id}|{vel}|{texto}".encode()).hexdigest()[:12]
        arq = f"audio/{cid}.mp3"
        dest = os.path.join(PASTA_AUDIO, f"{cid}.mp3")
        velho = anterior["cenas"].get(cid)
        refazer = a.forcar is not None and (len(a.forcar) == 0 or cid in a.forcar)
        if velho and velho.get("hash") == h and os.path.exists(dest) and not refazer:
            saida["cenas"][cid] = velho
            print(f"= {video}/{cid} (sem mudanças)")
            continue
        print(f"♪ {video}/{cid} …", flush=True)
        if a.motor == "edge":
            palavras = asyncio.run(via_edge(texto, voz_id, vel, dest))
            if not palavras:
                raise RuntimeError(f"edge-tts não devolveu áudio para a voz {voz_id}")
        else:
            palavras = via_kokoro(texto, voz_id, float(vel), dest, a.modelo)
        saida["cenas"][cid] = {"hash": h, "audio": arq, "duracao": round(duracao(dest), 3), "palavras": palavras}

    os.makedirs(os.path.dirname(SAIDA), exist_ok=True)
    json.dump(saida, open(SAIDA, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    total = sum(c["duracao"] for c in saida["cenas"].values())
    print(f"Narração de '{video}' pronta: {total:.1f}s em {len(saida['cenas'])} cenas")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--motor", default=os.environ.get("MOTOR_TTS", "edge"), choices=["edge", "kokoro"])
    ap.add_argument("--modelo", default=os.environ.get("KOKORO_MODELO", "modelos/kokoro"))
    ap.add_argument("--video", action="append", help="id do vídeo (pasta em conteudo/); padrão: todos")
    ap.add_argument("--forcar", nargs="*", help="ids de cenas para refazer (vazio = todas)")
    a = ap.parse_args()
    videos = a.video or sorted(d for d in os.listdir(os.path.join(RAIZ, "conteudo")) if os.path.isfile(os.path.join(RAIZ, "conteudo", d, "roteiro.json")))
    for v in videos:
        gerar(v, a)


if __name__ == "__main__":
    sys.exit(main())
