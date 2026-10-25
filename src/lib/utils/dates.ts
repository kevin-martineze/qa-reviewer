// Formato de fechas de la UI. Zona horaria fija para que el server (SSR) y el
// navegador produzcan el mismo texto y no haya diferencias al hidratar.
// Intl solo se usa para extraer números (año, mes, día, hora): el texto se arma
// a mano porque cada versión de ICU escribe distinto («20 oct» vs «20 de oct»,
// «p. m.» con o sin espacio duro) y eso rompería la hidratación.
export const TIME_ZONE = 'America/Bogota';

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const MONTHS = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sept',
  'oct',
  'nov',
  'dic',
];

const partsFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hourCycle: 'h23',
});

interface Parts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

function partsOf(date: Date): Parts {
  const out: Parts = { year: 0, month: 0, day: 0, hour: 0, minute: 0 };
  for (const p of partsFmt.formatToParts(date)) {
    if (
      p.type === 'year' ||
      p.type === 'month' ||
      p.type === 'day' ||
      p.type === 'hour' ||
      p.type === 'minute'
    ) {
      out[p.type] = Number(p.value);
    }
  }
  return out;
}

const pad = (n: number) => String(n).padStart(2, '0');

function shortDay(p: Parts): string {
  return `${p.day} ${MONTHS[p.month - 1]}`;
}

function timeOf(p: Parts): string {
  const h = p.hour % 12 === 0 ? 12 : p.hour % 12;
  return `${h}:${pad(p.minute)} ${p.hour < 12 ? 'a. m.' : 'p. m.'}`;
}

/** `2026-10-25` en la zona horaria de la UI. */
export function dayKey(date: Date): string {
  const p = partsOf(date);
  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
}

function dayDiff(a: Date, b: Date): number {
  const ka = Date.parse(`${dayKey(a)}T00:00:00Z`);
  const kb = Date.parse(`${dayKey(b)}T00:00:00Z`);
  return Math.round((ka - kb) / DAY);
}

/** `4:58 p. m.` */
export function formatTime(iso: string): string {
  return timeOf(partsOf(new Date(iso)));
}

/** `12 oct 2026, 4:58 p. m.` */
export function formatDateTime(iso: string): string {
  const p = partsOf(new Date(iso));
  return `${shortDay(p)} ${p.year}, ${timeOf(p)}`;
}

/** `12 oct` (o `12 oct 2025` si no es del año de `now`). */
export function formatShortDate(iso: string, now: Date = new Date()): string {
  const p = partsOf(new Date(iso));
  return p.year === partsOf(now).year ? shortDay(p) : `${shortDay(p)} ${p.year}`;
}

/** Pasado reciente: «Hace 5 min», «Hace 2 h», «Ayer, 4:58 p. m.», «12 oct». */
export function formatRelative(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  const diff = now.getTime() - date.getTime();
  if (diff < MINUTE) return 'Ahora';
  if (diff < HOUR) return `Hace ${Math.floor(diff / MINUTE)} min`;
  const days = dayDiff(now, date);
  if (days === 0) return `Hace ${Math.floor(diff / HOUR)} h`;
  if (days === 1) return `Ayer, ${formatTime(iso)}`;
  if (days < 7) return `Hace ${days} días`;
  return formatShortDate(iso, now);
}

/** Fecha futura o pasada respecto a hoy: «Hoy, 5:00 p. m.», «Mañana, …», «En 3 días», «12 oct». */
export function formatDay(iso: string, now: Date = new Date()): string {
  const days = dayDiff(new Date(iso), now);
  if (days === 0) return `Hoy, ${formatTime(iso)}`;
  if (days === 1) return `Mañana, ${formatTime(iso)}`;
  if (days === -1) return `Ayer, ${formatTime(iso)}`;
  if (days > 1 && days < 7) return `En ${days} días`;
  if (days < -1 && days > -7) return `Hace ${-days} días`;
  return formatShortDate(iso, now);
}

/** Etiqueta de grupo por día para listas: «Hoy», «Ayer» o «12 oct». */
export function dayGroupLabel(iso: string, now: Date = new Date()): string {
  const days = dayDiff(now, new Date(iso));
  if (days === 0) return 'Hoy';
  if (days === 1) return 'Ayer';
  return formatShortDate(iso, now);
}
