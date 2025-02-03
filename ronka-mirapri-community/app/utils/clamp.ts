function clamp(min: number, val: number, max: number) {
  min = min > max ? max : min;
  return val < min ? min : val > max ? max : val;
}
export { clamp };
