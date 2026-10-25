/** Ticks limpios desde 0 (0, 2, 4…) que cubren `max`, con 3 a 5 divisiones. */
export function niceTicks(max: number, target = 4): number[] {
  if (max <= 0) return [0, 1];
  const raw = max / target;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].map((m) => m * magnitude).find((s) => s >= raw) ?? magnitude * 10;
  const top = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = 0; v <= top + step / 2; v += step) ticks.push(Math.round(v * 1000) / 1000);
  return ticks;
}

/** Columna con las esquinas del extremo de datos redondeadas y la base recta. */
export function columnPath(x: number, y: number, w: number, h: number, r = 4): string {
  if (h <= 0 || w <= 0) return '';
  const rr = Math.min(r, w / 2, h);
  return [
    `M${x},${y + h}`,
    `V${y + rr}`,
    `Q${x},${y} ${x + rr},${y}`,
    `H${x + w - rr}`,
    `Q${x + w},${y} ${x + w},${y + rr}`,
    `V${y + h}`,
    'Z',
  ].join(' ');
}

/** Barra horizontal: base recta a la izquierda, extremo derecho redondeado si `roundEnd`. */
export function barPath(
  x: number,
  y: number,
  w: number,
  h: number,
  roundEnd = true,
  r = 4,
): string {
  if (h <= 0 || w <= 0) return '';
  const rr = roundEnd ? Math.min(r, h / 2, w) : 0;
  return [
    `M${x},${y}`,
    `H${x + w - rr}`,
    `Q${x + w},${y} ${x + w},${y + rr}`,
    `V${y + h - rr}`,
    `Q${x + w},${y + h} ${x + w - rr},${y + h}`,
    `H${x}`,
    'Z',
  ].join(' ');
}

/** 0.62 → «62 %». */
export function formatPercent(ratio: number): string {
  return `${Math.round(ratio * 100)} %`;
}

/** Horas → «18 h» o «2,5 d» desde 48 h. */
export function formatHours(hours: number): string {
  if (hours < 48) return `${Math.round(hours)} h`;
  const days = Math.round((hours / 24) * 10) / 10;
  return `${String(days).replace('.', ',')} d`;
}
