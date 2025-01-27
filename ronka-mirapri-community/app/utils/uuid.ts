function generateUUID(): string {
  return `${randomHex(8)}-${randomHex(4)}-4${randomHex(3)}-${randomHex(
    4
  )}-${randomHex(12)}`;
}

function randomHex(length: number): string {
  return Math.random()
    .toString(16)
    .substring(2, 2 + length);
}

export { generateUUID };
