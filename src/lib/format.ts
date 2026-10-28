/** Formatting helpers — South African conventions (ZAR, en-ZA dates). */

/** "R1 250.00" */
export function zar(amount: number): string {
  const fixed = amount.toFixed(2);
  const [whole, cents] = fixed.split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, "\u2009");
  return `R${grouped}.${cents}`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function parseDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** "Sat 14 Mar" */
export function shortDate(iso: string): string {
  const d = parseDate(iso);
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

/** "14 March 2026" */
export function longDate(iso: string): string {
  const d = parseDate(iso);
  const full = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ][d.getMonth()];
  return `${d.getDate()} ${full} ${d.getFullYear()}`;
}

export function monthName(iso: string): string {
  return MONTHS[parseDate(iso).getMonth()].toUpperCase();
}

export function dayNumber(iso: string): string {
  return String(parseDate(iso).getDate()).padStart(2, "0");
}

/** Days until the event (from a fixed "today" so mock data stays consistent). */
export const TODAY = new Date(2026, 1, 9); // 9 Feb 2026

export function daysUntil(iso: string): number {
  const target = parseDate(iso).getTime();
  return Math.max(0, Math.round((target - TODAY.getTime()) / 86400000));
}

export function countdownLabel(iso: string): string {
  const d = daysUntil(iso);
  if (d === 0) return "Happening today";
  if (d === 1) return "Tomorrow";
  if (d < 7) return `In ${d} days`;
  if (d < 31) return `In ${Math.round(d / 7)} weeks`;
  return `In ${Math.round(d / 30)} months`;
}

export function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
