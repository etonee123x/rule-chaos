export const clamp = (value: number, [borderMin, borderMax] = [0, 1]) =>
  Math.min(Math.max(value, borderMin), borderMax);
