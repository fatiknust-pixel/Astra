#!/usr/bin/env python3
"""Narração do vídeo do Projeto 5S com Kokoro (offline).

Gera uma faixa por cena (frase por frase, então o início de cada frase é exato)
em public/5s/audio/<cena>.mp3 e os tempos em src/gerado/5s/narracao.json.

Uso:
  python3 scripts/gerar_audio_5s.py --modelo PASTA_COM_kokoro-v1.0.onnx_E_voices-v1.0.bin
"""
import argparse, json, os, subprocess, tempfile
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--modelo", default=os.path.join(RAIZ, "modelos"))
    a = ap.parse_args()
    rot = json.load(open(os.path.join(RAIZ, "conteudo/5s/video.json"), encoding="utf-8"))
    k = Kokoro(os.path.join(a.modelo, "kokoro-v1.0.onnx"), os.path.join(a.modelo, "voices-v1.0.bin"))
    pasta_audio = os.path.join(RAIZ, "public/5s/audio")
    os.makedirs(pasta_audio, exist_ok=True)
    os.makedirs(os.path.join(RAIZ, "src/gerado/5s"), exist_ok=True)
    saida = {}
    for cena in rot["cenas"]:
        pedacos, frases, t, sr = [], [], 0.0, 24000
        for frase in cena["frases"]:
            fala = frase
            for de, para in rot.get("pronuncia", {}).items():
                fala = fala.replace(de, para)
            audio, sr = k.create(fala, voice=rot["voz"], speed=rot["velocidade"], lang="pt-br")
            # corta silêncio das pontas
            idx = np.where(np.abs(audio) > 0.01)[0]
            if len(idx):
                audio = audio[max(0, idx[0] - 600): idx[-1] + 1200]
            dur = len(audio) / sr
            frases.append({"texto": frase, "i": round(t, 3), "f": round(t + dur, 3)})
            pedacos += [audio, np.zeros(int(rot["pausa"] * sr), dtype=audio.dtype)]
            t += dur + rot["pausa"]
        faixa = np.concatenate(pedacos)
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            sf.write(tmp.name, faixa, sr)
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", tmp.name, "-b:a", "160k",
                            os.path.join(pasta_audio, cena["id"] + ".mp3")], check=True)
            os.unlink(tmp.name)
        saida[cena["id"]] = {"duracao": round(len(faixa) / sr, 3), "frases": frases}
        print(f"{cena['id']}: {saida[cena['id']]['duracao']}s")
    json.dump(saida, open(os.path.join(RAIZ, "src/gerado/5s/narracao.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
