import qrcode from "qrcode-generator";
import { useMemo } from "react";

// QR Code de verdade (mesmo formato do app: "TAB:posto-14", "MAQ:7"), módulo a módulo,
// com opção de "montar" os quadradinhos em ordem embaralhada.
export const Qr: React.FC<{ texto: string; tamanho: number; revelar?: number; cor?: string; fundo?: string }> = ({
  texto,
  tamanho,
  revelar = 1,
  cor = "#0B1220",
  fundo = "#fff",
}) => {
  const { n, mods } = useMemo(() => {
    const q = qrcode(0, "M");
    q.addData(texto);
    q.make();
    const n = q.getModuleCount();
    const mods: { r: number; c: number; o: number }[] = [];
    for (let r = 0; r < n; r++)
      for (let c = 0; c < n; c++)
        if (q.isDark(r, c)) mods.push({ r, c, o: ((r * 37 + c * 91) % 97) / 97 });
    return { n, mods };
  }, [texto]);
  const m = 2;
  const total = n + m * 2;
  return (
    <svg viewBox={`0 0 ${total} ${total}`} width={tamanho} height={tamanho} style={{ display: "block", background: fundo, borderRadius: tamanho * 0.04 }}>
      {mods.map(({ r, c, o }, i) => {
        const v = Math.min(1, Math.max(0, (revelar - o * 0.7) / 0.3));
        if (v <= 0) return null;
        const s = 0.5 + 0.5 * v;
        return (
          <rect
            key={i}
            x={c + m + (1 - s) / 2}
            y={r + m + (1 - s) / 2}
            width={s + 0.02}
            height={s + 0.02}
            fill={cor}
            opacity={v}
          />
        );
      })}
    </svg>
  );
};
