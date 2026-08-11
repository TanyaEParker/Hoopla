
export function hexToRgbArray(hex: number): [number, number, number] {
  return [(hex >> 16) & 0xff, (hex >> 8) & 0xff, hex & 0xff];
}
 
export function rgbStringToArray(rgb: string): [number, number, number] {
  const match = rgb.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
  if (!match) {
    throw new Error(`Invalid rgb() string: "${rgb}"`);
  }
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}