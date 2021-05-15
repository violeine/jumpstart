export interface Color {
  red: number;
  green: number;
  blue: number;
}

export function hexToRGB(h: string): Color {
  const red = Number(`0x${h[1]}${h[2]}`);
  const green = Number(`0x${h[3]}${h[4]}`);
  const blue = Number(`0x${h[5]}${h[6]}`);
  return {
    red,
    green,
    blue,
  };
}
export function RGBtoHex({ red, blue, green }: Color): string {
  return (
    "#" + ((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1)
  );
}
