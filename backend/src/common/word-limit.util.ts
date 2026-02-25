export function hasMaxWords(value: string, maxWords: number): boolean {
  if (!value) {
    return true;
  }

  const count = value.trim().split(/\s+/).filter(Boolean).length;
  return count <= maxWords;
}
