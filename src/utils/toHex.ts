export function toHex(num: number, padding: number = 4) {
  return `0x${num.toString(16).toUpperCase().padStart(padding, '0')}`;
}